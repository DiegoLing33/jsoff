import setupErrorElement from "./errorFrame.js";
import {createObject} from "./objectBuilder.js";

const {ipcRenderer} = require('electron')
const parseJson = require("json-parse-better-errors");

window.onload = () => {

    const windowHeight = window.innerHeight;
    const $bar = document.querySelector(".app-bar");
    const $wrapper = document.querySelector(".app-wrapper");
    const $footer = document.querySelector(".app-footer");
    const $results = document.querySelector("#results");
    const $text = document.querySelector("#text");
    const $me = document.querySelector("#me");

    const {printError, setVisibleError} = setupErrorElement()

    const $textArea = document.querySelector("#area");
    const $reformatButton = document.querySelector("#reformatButton");
    const codeMirror = CodeMirror.fromTextArea($textArea, {
        mode: 'javascript',
        matchBrackets: true,
        autoCloseBrackets: true,
        theme: 'darcula'
    });

    $me.onclick = () => ipcRenderer.invoke('open', 'http://ling.black');

    const resize = (h = windowHeight) => {
        $wrapper.style['height'] = (h - ($bar.clientHeight + $footer.clientHeight)) + 'px';
        $results.style['height'] = $wrapper.style['height'];
        $text.style['height'] = $wrapper.style['height'];
    }

    ipcRenderer.on('resize', (e, size) => {
        resize(size[1]);
    });
    resize();

    $reformatButton.onclick = () => {
        const o = getInputJSONObject();
        codeMirror.getDoc().setValue(JSON.stringify(o, null, 4));
        generateBlocks(o);
    };

    let timeout = null;
    codeMirror.on('change', () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            generateBlocks(getInputJSONObject());
        }, 400);
    });

    function setVisibleResults(flag) {
        $results.style['display'] = flag ? null : 'none';
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



};