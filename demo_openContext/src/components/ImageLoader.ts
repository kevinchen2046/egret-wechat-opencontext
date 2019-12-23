module ui {
    export class ImageLoader {
        private static _map: { [key: string]: { handlers: { caller: any, method: Function }[], texture: egret.Texture, isloading: boolean } }
        public static load(url: string, scale9grid: boolean, caller: any, method: Function) {
            if (!this._map) {
                this._map = {};
            }
            if (!this._map[url]) {
                this._map[url] = { handlers: [], texture: null, isloading: false };
            }
            if (this._map[url].texture) {
                method.call(caller, this._map[url].texture);
                return;
            }
            var handlers = this._map[url].handlers;
            for (var obj of handlers) {
                if (obj.caller == caller && obj.method == method) return;
            }
            handlers.push({ caller: caller, method: method });
            if (!this._map[url].isloading) {
                ImageLoader.loadImage(url, scale9grid, this, (texture: egret.Texture, object: any) => {
                    object.texture = texture;
                    var list = object.handlers;
                    if (list && list.length) {
                        for (var handler of list) {
                            handler.method.call(handler.caller, texture);
                        }
                        list.length = 0;
                    }
                }, this._map[url])
            }
        }

        public static remove(url: string, caller: any, method: Function) {
            if (!this._map) return;
            if (!this._map[url]) return;
            var handlers = this._map[url].handlers;
            var i: number = 0;
            for (var obj of handlers) {
                if (obj.caller == caller && obj.method == method) {
                    handlers.splice(i, 1);
                    break;
                }
                i++;
            }
        }

        private static loadImage(url: string, scale9grid: boolean, caller: any, method: Function, param: any) {
            if (!!(window as any).wx) {
                const image = wx.createImage();
                image.onload = () => {
                    const bitmapdata = new egret.BitmapData(image);
                    const texture = new egret.Texture();
                    texture._setBitmapData(bitmapdata);
                    if (scale9grid) {
                        texture["scale9Grid"] = scale9grid;
                    }

                    setTimeout(() => {
                        method.call(caller, texture, param);
                    }, 0);
                }
                image.onerror = (e) => {
                    console.error(e, url);
                }
                image.src = url;
            } else {
                var loader: egret.ImageLoader = new egret.ImageLoader();
                loader.once(egret.Event.COMPLETE, (e: egret.Event) => {
                    const texture = new egret.Texture();
                    texture._setBitmapData(e.target.data);
                    if (scale9grid) {
                        texture["scale9Grid"] = scale9grid;
                    }
                    setTimeout(() => {
                        method.call(caller, texture, param);
                    }, 0);
                }, this);
                loader.load(url);
            }
        }

        public static getRes(url: string) {
            return this._map && this._map[url].texture;
        }
    }
}

