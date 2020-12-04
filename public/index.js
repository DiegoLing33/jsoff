import setupErrorElement from "./errorFrame.js";
import {createObject} from "./objectBuilder.js";
import {MainFrame} from "./frames/mainFrame.js";
import {useExtensions} from "./extensions.js";
import {ModesFrame} from "./frames/modesFrame.js";
import {makeid, subTitle, title} from "./utils.js";

const {ipcRenderer} = require('electron')
const parseJson = require("json-parse-better-errors");
const md5 = require("md5");

// Connects the extensions
useExtensions();

// Defaults
let currentMode = 'parsing';
let detectedTypes = {};
let lastModifiedCode = '';

window.onload = () => {


    const mainFrame = new MainFrame();
    const modesFrame = new ModesFrame({initialMode: currentMode});

    //
    // Handling
    //
    modesFrame.onModeChanged = m => {
        if (currentMode === m) return;
        // ....
        currentMode = m;
        resetCodeCache();
        work();
        console.log('Now mod is: ' + m);
    };

    const $results = document.querySelector("#results");
    const $typings = document.querySelector("#typings");
    const $me = document.querySelector("#me");

    const {printError, setVisibleError} = setupErrorElement()

    const $textArea = document.querySelector("#area");
    const $textAreaTyping = document.querySelector("#area-typing");

    const $reformatButton = document.querySelector("#reformatButton");
    const $addEntityButton = document.querySelector("#add-entities-button");

    const codeMirror = CodeMirror.fromTextArea($textArea, {
        mode: 'javascript',
        matchBrackets: true,
        autoCloseBrackets: true,
        theme: 'darcula',
    });
    const codeMirrorTyping = CodeMirror.fromTextArea($textAreaTyping, {
        mode: 'text/typescript',
        matchBrackets: true,
        autoCloseBrackets: true,
        theme: 'darcula',
    });

    $me.onclick = () => ipcRenderer.invoke('open', 'http://ling.black');
    ipcRenderer.on('resize', () => mainFrame.resize());

    $reformatButton.onclick = () => {
        work(null, {withReformat: true});
    };
    $addEntityButton.onclick = () => {
        work(null, {withEntities: true});
    };

    let timeout = null;
    codeMirror.on('change', () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => work(), 400);
    });

    function resetCodeCache() {
        lastModifiedCode = "";
    }

    function work(src, args = {}) {
        const o = src ?? getInputJSONObject();
        const jsonString = JSON.stringify(o, null, 4);
        let prettyHash = md5(jsonString);

        if (args.withReformat) {
            codeMirror.getDoc().setValue(JSON.stringify(o, null, 4));
        }

        if (args.withEntities) resetCodeCache();

        // Exit if the same code
        if (lastModifiedCode === prettyHash) return;
        lastModifiedCode = prettyHash;

        // Switch modes
        switch (currentMode) {
            case "parsing":
            default:
                setVisibleTypings(false);
                setVisibleResults(true);
                generateBlocks(o);
                break;
            case "typing":
                setVisibleTypings(true);
                setVisibleResults(false);
                generateClasses(o, args.withEntities);
                break;
        }
    }


    function createTypingHash(o) {
        return md5(Object.keys(o).join("") + Object.values(o).map(v => typeof v).join(""));
    }

    function typeTheArray(a, prefix) {
        const pf = prefix ?? '';
        if (a.length > 0) {
            let types = [];
            let hashes = [];
            let arrayName = pf + 'Item' + makeid();
            a.forEach(element => {
                const elementType = typeof element;
                if (elementType === 'object') {
                    const hash = createTypingHash(element);
                    const type = typeTheObject(element, arrayName);
                    if (!hashes.includes(hash)) {
                        types.push(type);
                        hashes.push(hash);
                    }
                } else {
                    if (!types.includes(elementType)) types.push(elementType);
                }
            });
            return 'Array<' + types.join(' | ') + '>';
        } else {
            return '[]';
        }
    }

    function typeTheObject(o, prefix) {
        const pf = prefix ?? 'Object';
        const typeHash = createTypingHash(o);
        const interfaceName = pf + makeid();
        if (detectedTypes.hasOwnProperty(typeHash)) return interfaceName;
        const fields = [];

        Object.keys(o).forEach(key => {
            const type = typeof o[key];
            let typeName = type;

            if (type === "object") {
                if (o[key] instanceof Array) {
                    typeName = typeTheArray(o[key], title(key));
                } else {
                    typeName = typeTheObject(o[key], title(key));
                }
            }

            fields.push({name: key, type: typeName});
        });
        detectedTypes[typeHash] = {
            name: interfaceName,
            fields,
        };
        return interfaceName;
    }

    function createInterfaceByTypeObject(typeObject) {
        let s = `export interface ${typeObject.name} {`;
        typeObject.fields.forEach(field => {
            s += `\n\t${field.name}: ${field.type};`
        });
        s += "\n}";
        return s;
    }

    function createEntityByTypeObject(typeObject) {
        let s = `export class ${typeObject.name}Entity{`;
        s += '\n\n\t// Properties'
        typeObject.fields.forEach(field => {
            s += `\n\tpublic ${subTitle(field.name)}: ${field.type};`
        });
        s += `\n\n\t// Constructor\n\tconstructor(raw: ${typeObject.name}) {`
        typeObject.fields.forEach(field => {
            s += `\n\t\tthis.${subTitle(field.name)} = raw.${field.name};`
        });
        s += "\n\t}"
        s += "\n}";
        return s;
    }

    function generateClasses(input, withTypes) {
        // Resets
        detectedTypes = [];
        makeid(true);

        typeTheObject(input);

        const values = [];
        values.push('// +-----------------------+\n//         Interfaces       \n// +-----------------------+');
        values.push(...Object.values(detectedTypes).map(createInterfaceByTypeObject));

        if (withTypes) {
            values.push('// +-----------------------+\n//         Entities         \n// +-----------------------+');
            values.push(...Object.values(detectedTypes).map(createEntityByTypeObject));
        }

        codeMirrorTyping.getDoc().setValue(values.join("\n\n"));
    }

    function setVisibleResults(flag) {
        $results.style['display'] = flag ? null : 'none';
    }

    function setVisibleTypings(flag) {
        $typings.style['display'] = flag ? null : 'none';
    }

    function generateBlocks(o) {
        $results.innerHTML = "";
        $results.appendChild(createObject(o, undefined, 1));
        setVisibleResults(true);
    }

    function getInputJSONValue() {
        return codeMirror.getDoc().getValue();
    }

    /**
     * Returns the object from input
     * @return {any}
     */
    function getInputJSONObject() {
        try {
            setVisibleError(false);
            return parseJson(getInputJSONValue());
        } catch (e) {
            setVisibleResults(false);
            printError(e);
        }
    }


}
;