declare namespace wx{
    export interface Image{
        onload:Function
        onerror:Function
        src:string
    }
    export function createImage():Image

    export function onMessage(method:(res:any)=>void):void
}