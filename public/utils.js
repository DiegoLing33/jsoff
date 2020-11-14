

export function getDisplayType(value){
    if(value === undefined) return  'undefined';
    else if(value === null) return  'null';
    else if(value instanceof Array) return  'array';
    return typeof value;
}

