import {getDisplayType} from "./utils.js";

/**
 * Creates the key
 * @param name
 * @param type
 * @return {string}
 */
export function createKey(name, type) {
    return `<span class="key">key: </span>${name}<span class="ot">${type}</span>`;
}

/**
 * Creates the value
 * @param name
 * @return {string}
 */
export function createValue(name){
    return `<span class="key">value: </span><span class="value">${name}</span>`;
}

/**
 * Creates the object
 *
 * @param o
 * @param name
 * @param sub
 * @return {HTMLDivElement}
 */
export function createObject(o, name, sub) {
    const element = createObjectElement(name, sub - 1);

    const keys = Object.keys(o);

    for (const key of keys) {
        const value = o[key];

        const valueType = typeof value;
        const keyName = createKey(key, getDisplayType(value))

        if (value !== undefined && value !== null && valueType === 'object') {
            element.appendChild(createObject(value, keyName, sub + 1))
        } else {
            element.appendChild(createBlockElement(keyName, createValue(o[key]), sub));
        }
    }
    return element;
}

/**
 * Creates the element for object
 * @param name
 * @param sub
 * @return {HTMLDivElement}
 */
export function createObjectElement(name, sub = 0) {
    const $block = document.createElement("div");
    $block.className = "json-object hdn";
    $block.style['margin-left'] = (sub * 12) + 'px';

    const $header = createBlockElement(name || 'Object', undefined);
    $block.appendChild($header);
    $header.onclick = (e) => {
        e.stopPropagation();
        if ($block.classList.contains('hdn')) {
            $block.classList.remove('hdn');
        } else {
            $block.querySelectorAll('.json-object').forEach((item)=>{
               item.classList.add('hdn');
            });
            $block.classList.add('hdn');
        }
    };
    return $block;
}


/**
 * Creates the block element
 * @param title
 * @param text
 * @param sub
 * @return {HTMLDivElement}
 */
export function createBlockElement(title, text, sub = 0) {
    const $block = document.createElement("div");
    $block.style['margin-left'] = (sub * 12) + 'px';
    $block.className = "json-section";

    if (text === undefined) {
        $block.classList.add('item');
    }

    if (title) {
        const $title = document.createElement("div");
        $title.className = "title";
        $title.innerHTML = title;
        $block.appendChild($title);
    }

    if (text) {
        const $text = document.createElement("div");
        $text.className = "text";
        $text.innerHTML = text;
        $block.appendChild($text);
    }

    return $block;
}