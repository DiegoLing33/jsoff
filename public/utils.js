export function getDisplayType(value) {
    if (value === undefined) return 'undefined';
    else if (value === null) return 'null';
    else if (value instanceof Array) return 'array';
    return typeof value;
}

export function px(n) {
    return `${n}px`;
}

export function pc(n) {
    return `${n}%`;
}

let lastId = 0;

export function makeid(reset) {
    if (reset) {
        lastId = 0;
        return;
    }
    return ++lastId;
}

export function title(s) {
    return s.split("_")
        .map(v => v.substring(0, 1).toUpperCase() + v.substring(1).toLowerCase())
        .join("");
}

export function subTitle(s) {
    const t = title(s);
    return t.substring(0, 1).toLowerCase() + t.substring(1);
}