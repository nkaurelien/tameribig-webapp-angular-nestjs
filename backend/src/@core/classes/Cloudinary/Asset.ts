// To parse this data:
//
//   import { Convert, Asset } from "./file";
//
//   const asset = Convert.toAsset(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Asset {
    public_id: string;
    format: string;
    version: number;
    resource_type: string;
    type: string;
    created_at: Date;
    bytes: number;
    width: number;
    height: number;
    url: string;
    secure_url: string;
    next_cursor: string;
    derived: Derived[];
    rate_limit_allowed: number;
    rate_limit_reset_at: string;
    rate_limit_remaining: number;
}

export interface Derived {
    transformation: string;
    format: string;
    bytes: number;
    id: string;
    url: string;
    secure_url: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAsset(json: string): Asset {
        return cast(JSON.parse(json), r("Asset"));
    }

    public static assetToJson(value: Asset): string {
        return JSON.stringify(uncast(value, r("Asset")), null, 2);
    }
}

function invalidValue(typ: any, val: any): never {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = {key: p.js, typ: p.typ});
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = {key: p.json, typ: p.typ});
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {
            }
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return {arrayItems: typ};
}

function u(...typs: any[]) {
    return {unionMembers: typs};
}

function o(props: any[], additional: any) {
    return {props, additional};
}

function m(additional: any) {
    return {props: [], additional};
}

function r(name: string) {
    return {ref: name};
}

const typeMap: any = {
    "Asset": o([
        {json: "public_id", js: "public_id", typ: ""},
        {json: "format", js: "format", typ: ""},
        {json: "version", js: "version", typ: 0},
        {json: "resource_type", js: "resource_type", typ: ""},
        {json: "type", js: "type", typ: ""},
        {json: "created_at", js: "created_at", typ: Date},
        {json: "bytes", js: "bytes", typ: 0},
        {json: "width", js: "width", typ: 0},
        {json: "height", js: "height", typ: 0},
        {json: "url", js: "url", typ: ""},
        {json: "secure_url", js: "secure_url", typ: ""},
        {json: "next_cursor", js: "next_cursor", typ: ""},
        {json: "derived", js: "derived", typ: a(r("Derived"))},
        {json: "rate_limit_allowed", js: "rate_limit_allowed", typ: 0},
        {json: "rate_limit_reset_at", js: "rate_limit_reset_at", typ: ""},
        {json: "rate_limit_remaining", js: "rate_limit_remaining", typ: 0},
    ], false),
    "Derived": o([
        {json: "transformation", js: "transformation", typ: ""},
        {json: "format", js: "format", typ: ""},
        {json: "bytes", js: "bytes", typ: 0},
        {json: "id", js: "id", typ: ""},
        {json: "url", js: "url", typ: ""},
        {json: "secure_url", js: "secure_url", typ: ""},
    ], false),
};
