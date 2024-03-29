var egret = window.egret;var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var ui;
(function (ui) {
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component() {
            var _this = _super.call(this) || this;
            _this._enabled = true;
            _this._pivot = new egret.Point();
            _this.createChildren();
            return _this;
            //this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createChildren, this);
        }
        Component.prototype.createChildren = function () {
            //this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.createChildren, this);
        };
        Component.prototype.invalidateNow = function () {
            this.invalidateSize();
        };
        Object.defineProperty(Component.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (value) {
                this._enabled = value;
                this.touchEnabled = this.touchChildren = value;
            },
            enumerable: true,
            configurable: true
        });
        Component.prototype.size = function (w, h) {
            this.width = w;
            this.height = h;
        };
        Object.defineProperty(Component.prototype, "width", {
            get: function () {
                return egret.superGetter(ui.Component, this, 'width');
                ;
            },
            //@ts-ignore
            set: function (v) {
                egret.superSetter(ui.Component, this, 'width', v);
                egret.callLater(this.invalidateSize, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "height", {
            get: function () {
                return egret.superGetter(ui.Component, this, 'height');
                ;
            },
            //@ts-ignore
            set: function (v) {
                egret.superSetter(ui.Component, this, 'height', v);
                egret.callLater(this.invalidateSize, this);
            },
            enumerable: true,
            configurable: true
        });
        Component.prototype.invalidateSize = function () {
            if (this._pivot.x != 0 || this._pivot.y != 0) {
                if (this.width && this.height) {
                    this.anchor(this.width * this._pivot.x, this.height * this._pivot.y);
                }
            }
        };
        Component.prototype.anchor = function (x, y) {
            this.anchorOffsetX = x;
            this.anchorOffsetY = y != undefined ? y : x;
            this.updateAnchorOffset();
        };
        Component.prototype.pivot = function (x, y) {
            if (!this._pivot)
                this._pivot = new egret.Point();
            this._pivot.setTo(x, y != undefined ? y : x);
            this.invalidateSize();
        };
        Component.prototype.pos = function (x, y) {
            this.x = x;
            this.y = y != undefined ? y : x;
        };
        Component.prototype.scale = function (x, y) {
            this.scaleX = x;
            this.scaleY = y != undefined ? y : x;
        };
        Component.prototype.updateAnchorOffset = function () { };
        return Component;
    }(egret.DisplayObjectContainer));
    ui.Component = Component;
    __reflect(Component.prototype, "ui.Component");
})(ui || (ui = {}));
var ui;
(function (ui) {
    var Image = (function (_super) {
        __extends(Image, _super);
        function Image() {
            return _super.call(this) || this;
        }
        Image.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this._bitmap = new egret.Bitmap();
            this.addChild(this._bitmap);
        };
        Object.defineProperty(Image.prototype, "scale9grid", {
            set: function (v) {
                this._scale9grid = v;
                this._bitmap.fillMode = egret.BitmapFillMode.SCALE;
                this._bitmap.scale9Grid = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Image.prototype, "url", {
            set: function (v) {
                if (this._url != v) {
                    if (this._url) {
                        ui.ImageLoader.remove(this._url, this, this.loadedHandler);
                    }
                    this._url = v;
                    if (this._url) {
                        ui.ImageLoader.load(this._url, !!this._scale9grid, this, this.loadedHandler);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Image.prototype.loadedHandler = function (texture) {
            if (!texture)
                return;
            this._bitmap.texture = texture;
            if (!this.width || !this.height) {
                this.size(texture.textureWidth, texture.textureHeight);
            }
            this.updateAnchorOffset();
        };
        Image.prototype.invalidateSize = function () {
            _super.prototype.invalidateSize.call(this);
            this._bitmap.width = this.width;
            this._bitmap.height = this.height;
        };
        return Image;
    }(ui.Component));
    ui.Image = Image;
    __reflect(Image.prototype, "ui.Image");
})(ui || (ui = {}));
var openctx;
(function (openctx) {
    var UIOpenContext = (function (_super) {
        __extends(UIOpenContext, _super);
        function UIOpenContext() {
            return _super.call(this) || this;
        }
        UIOpenContext.prototype.add = function () {
        };
        UIOpenContext.prototype.remove = function () {
        };
        return UIOpenContext;
    }(ui.Component));
    openctx.UIOpenContext = UIOpenContext;
    __reflect(UIOpenContext.prototype, "openctx.UIOpenContext");
    var OpenCtxManager = (function () {
        function OpenCtxManager() {
            this._views = {};
        }
        Object.defineProperty(OpenCtxManager, "instance", {
            get: function () {
                if (!OpenCtxManager._instance) {
                    OpenCtxManager._instance = new OpenCtxManager();
                }
                return OpenCtxManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OpenCtxManager.prototype, "mainContainer", {
            get: function () { return this._mainContainer; },
            enumerable: true,
            configurable: true
        });
        OpenCtxManager.prototype.initialize = function (stage, mainContainer) {
            this._stage = stage;
            this._mainContainer = mainContainer;
            wx.onMessage(this.messageHandler.bind(this));
        };
        OpenCtxManager.prototype.messageHandler = function (res) {
            switch (res.event) {
                case openctx.Event.OPEN:
                    this.show(res.viewName, res.x, res.y);
                    break;
                case openctx.Event.CLOSE:
                    this.close();
                    break;
                default:
                    if (this._messageHandlers[res.event]) {
                        var list = this._messageHandlers[res.event];
                        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                            var obj = list_1[_i];
                            obj.method.call(obj.caller, res);
                        }
                    }
                    break;
            }
        };
        OpenCtxManager.prototype.registerMessage = function (event, caller, method) {
            if (!this._messageHandlers[event]) {
                this._messageHandlers[event] = [];
            }
            this._messageHandlers[event].push({ caller: caller, method: method });
        };
        OpenCtxManager.prototype.registerView = function (viewName, contentClass) {
            this._views[viewName] = { clazz: contentClass, view: null };
        };
        OpenCtxManager.prototype.show = function (viewName, x, y) {
            //((window as any).player as Player);
            if (this._views[viewName]) {
                if (!this._views[viewName].view) {
                    this._views[viewName].view = new (this._views[viewName].clazz)();
                }
                if (this._views[viewName].view) {
                    this._mainContainer.addChild(this._views[viewName].view);
                    this._curView = this._views[viewName].view;
                    this._curView.x = x;
                    this._curView.y = y;
                    this._curView.add();
                    var tx = this._curView.x;
                    var ty = this._curView.y;
                    var w = this._curView.width;
                    var h = this._curView.height;
                    this._curView.scaleX = this._curView.scaleY = 0.1;
                    this._curView.x = tx + w / 2 - (this._curView.width * this._curView.scaleX) / 2;
                    this._curView.y = ty + h / 2 - (this._curView.height * this._curView.scaleY) / 2;
                    console.log('t', tx, ty, this._curView.x, this._curView.y);
                    egret.Tween.get(this._curView).to({ x: tx, y: ty, scaleX: 1, scaleY: 1 }, 300, egret.Ease.backOut);
                }
            }
        };
        OpenCtxManager.prototype.close = function () {
            egret.Tween.removeTweens(this._curView);
            if (this._curView.parent) {
                this._curView.remove();
                this._curView.parent.removeChild(this._curView);
            }
        };
        return OpenCtxManager;
    }());
    __reflect(OpenCtxManager.prototype, "OpenCtxManager");
    openctx.initialize = OpenCtxManager.instance.initialize.bind(OpenCtxManager.instance);
    openctx.registerView = OpenCtxManager.instance.registerView.bind(OpenCtxManager.instance);
    openctx.registerMessage = OpenCtxManager.instance.registerMessage.bind(OpenCtxManager.instance);
    openctx.show = OpenCtxManager.instance.show.bind(OpenCtxManager.instance);
    openctx.close = OpenCtxManager.instance.close.bind(OpenCtxManager.instance);
})(openctx || (openctx = {}));
var ui;
(function (ui) {
    var IconButton = (function (_super) {
        __extends(IconButton, _super);
        function IconButton() {
            var _this = _super.call(this) || this;
            _this._sound = 'ui_click_routine';
            _this._soundOvedrride = false;
            _this._minscale = 0.9;
            return _this;
        }
        IconButton.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this._scaleX = this.scaleX;
            this._scaleY = this.scaleY;
            this.touchEnabled = true;
            this.touchChildren = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        };
        IconButton.prototype.removeFromStage = function (e) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
        };
        IconButton.prototype.touchHandler = function (e) {
            egret.Tween.removeTweens(this);
            switch (e.type) {
                case egret.TouchEvent.TOUCH_BEGIN:
                    // this.scaleX = this._scaleX;
                    // this.scaleY = this._scaleY;
                    egret.Tween.removeTweens(this);
                    egret.Tween.get(this).to({ scaleX: this._scaleX * this._minscale, scaleY: this._scaleY * this._minscale }, 300, egret.Ease.cubicOut);
                    this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
                    // if(this._sound) mg.soundManager.playSound(this._sound,1,this._soundOvedrride);
                    break;
                case egret.TouchEvent.TOUCH_END:
                    egret.Tween.get(this).to({ scaleX: this._scaleX, scaleY: this._scaleY }, 300, egret.Ease.circOut);
                    if (this.stage)
                        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
                    break;
            }
        };
        Object.defineProperty(IconButton.prototype, "sound", {
            get: function () {
                return this._sound;
            },
            set: function (v) {
                this._sound = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IconButton.prototype, "soundOvedrride", {
            get: function () {
                return this._soundOvedrride;
            },
            set: function (v) {
                this._soundOvedrride = v;
            },
            enumerable: true,
            configurable: true
        });
        return IconButton;
    }(ui.Image));
    ui.IconButton = IconButton;
    __reflect(IconButton.prototype, "ui.IconButton");
})(ui || (ui = {}));
var ui;
(function (ui) {
    var ListRenderer = (function (_super) {
        __extends(ListRenderer, _super);
        function ListRenderer() {
            return _super.call(this) || this;
        }
        Object.defineProperty(ListRenderer.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (v) {
                this._width = v;
                egret.callLater(this.invalidateSize, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListRenderer.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (v) {
                this._height = v;
                egret.callLater(this.invalidateSize, this);
            },
            enumerable: true,
            configurable: true
        });
        ListRenderer.prototype.add = function () {
        };
        ListRenderer.prototype.remove = function () {
            this._data = null;
        };
        Object.defineProperty(ListRenderer.prototype, "data", {
            get: function () { return this._data; },
            set: function (v) {
                if (this._data != v) {
                    this.preDataChange();
                    this._data = v;
                    this.dataChange();
                }
            },
            enumerable: true,
            configurable: true
        });
        ListRenderer.prototype.preDataChange = function () { };
        ListRenderer.prototype.dataChange = function () { };
        return ListRenderer;
    }(ui.Component));
    ui.ListRenderer = ListRenderer;
    __reflect(ListRenderer.prototype, "ui.ListRenderer");
})(ui || (ui = {}));
var openctx;
(function (openctx) {
    var Event = (function () {
        function Event() {
        }
        Event.OPEN = 'OPEN';
        Event.CLOSE = 'CLOSE';
        return Event;
    }());
    openctx.Event = Event;
    __reflect(Event.prototype, "openctx.Event");
    var UIName = (function () {
        function UIName() {
        }
        UIName.Example = 'Example';
        return UIName;
    }());
    openctx.UIName = UIName;
    __reflect(UIName.prototype, "openctx.UIName");
})(openctx || (openctx = {}));
var ui;
(function (ui) {
    var ImageLoader = (function () {
        function ImageLoader() {
        }
        ImageLoader.load = function (url, scale9grid, caller, method) {
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
            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                var obj = handlers_1[_i];
                if (obj.caller == caller && obj.method == method)
                    return;
            }
            handlers.push({ caller: caller, method: method });
            if (!this._map[url].isloading) {
                ImageLoader.loadImage(url, scale9grid, this, function (texture, object) {
                    object.texture = texture;
                    var list = object.handlers;
                    if (list && list.length) {
                        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                            var handler = list_2[_i];
                            handler.method.call(handler.caller, texture);
                        }
                        list.length = 0;
                    }
                }, this._map[url]);
            }
        };
        ImageLoader.remove = function (url, caller, method) {
            if (!this._map)
                return;
            if (!this._map[url])
                return;
            var handlers = this._map[url].handlers;
            var i = 0;
            for (var _i = 0, handlers_2 = handlers; _i < handlers_2.length; _i++) {
                var obj = handlers_2[_i];
                if (obj.caller == caller && obj.method == method) {
                    handlers.splice(i, 1);
                    break;
                }
                i++;
            }
        };
        ImageLoader.loadImage = function (url, scale9grid, caller, method, param) {
            if (!!window.wx) {
                var image_1 = wx.createImage();
                image_1.onload = function () {
                    var bitmapdata = new egret.BitmapData(image_1);
                    var texture = new egret.Texture();
                    texture._setBitmapData(bitmapdata);
                    if (scale9grid) {
                        texture["scale9Grid"] = scale9grid;
                    }
                    setTimeout(function () {
                        method.call(caller, texture, param);
                    }, 0);
                };
                image_1.onerror = function (e) {
                    console.error(e, url);
                };
                image_1.src = url;
            }
            else {
                var loader = new egret.ImageLoader();
                loader.once(egret.Event.COMPLETE, function (e) {
                    var texture = new egret.Texture();
                    texture._setBitmapData(e.target.data);
                    if (scale9grid) {
                        texture["scale9Grid"] = scale9grid;
                    }
                    setTimeout(function () {
                        method.call(caller, texture, param);
                    }, 0);
                }, this);
                loader.load(url);
            }
        };
        ImageLoader.getRes = function (url) {
            return this._map && this._map[url].texture;
        };
        return ImageLoader;
    }());
    ui.ImageLoader = ImageLoader;
    __reflect(ImageLoader.prototype, "ui.ImageLoader");
})(ui || (ui = {}));
var ui;
(function (ui) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label() {
            return _super.call(this) || this;
        }
        Label.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this._align = 'left';
            this._wordWrap = false;
            this._multiline = false;
            this._fontSize = 30;
            this._fontColor = 0xFFFFFF;
            this._fontName = '';
            this._textfiled = new egret.TextField();
            this._textfiled.touchEnabled = false;
            this.addChild(this._textfiled);
            this.size(100, 50);
            this.invalidateStyle();
        };
        Label.prototype.invalidateNow = function () {
            this.invalidateStyle();
            _super.prototype.invalidateNow.call(this);
        };
        Label.prototype.autoHeight = function () {
            this.height = this._textfiled.textHeight;
        };
        Object.defineProperty(Label.prototype, "text", {
            get: function () { return this._textfiled.text; },
            set: function (v) {
                this._textfiled.text = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "fontSize", {
            get: function () { return this._fontSize; },
            set: function (v) {
                if (this._fontSize != v) {
                    this._fontSize = v;
                    this.invalidateStyle();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "fontColor", {
            get: function () { return this._fontColor; },
            set: function (v) {
                if (this._fontColor != v) {
                    this._fontColor = v;
                    this.invalidateStyle();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "fontName", {
            get: function () { return this._fontName; },
            set: function (v) {
                if (this._fontName != v) {
                    this._fontName = v;
                    this.invalidateStyle();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "align", {
            get: function () { return this._align; },
            set: function (v) {
                if (this._align != v) {
                    this._align = v;
                    this.invalidateStyle();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "wordWrap", {
            get: function () { return this._wordWrap; },
            set: function (v) {
                if (this._wordWrap != v) {
                    this._wordWrap = v;
                    this.invalidateStyle();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "multiline", {
            get: function () { return this._multiline; },
            set: function (v) {
                if (this._multiline != v) {
                    this._multiline = v;
                    this.invalidateStyle();
                }
            },
            enumerable: true,
            configurable: true
        });
        Label.prototype.invalidateStyle = function () {
            this._textfiled.wordWrap = this._wordWrap;
            this._textfiled.multiline = this._multiline;
            this._textfiled.size = this._fontSize;
            this._textfiled.fontFamily = this._fontName;
            this._textfiled.textColor = this._fontColor;
            this._textfiled.textAlign = this._align;
        };
        Label.prototype.invalidateSize = function () {
            _super.prototype.invalidateSize.call(this);
            this._textfiled.width = this.width;
            this._textfiled.height = this.height;
        };
        return Label;
    }(ui.Component));
    ui.Label = Label;
    __reflect(Label.prototype, "ui.Label");
})(ui || (ui = {}));
var ui;
(function (ui) {
    var ListRenderPool = (function () {
        function ListRenderPool() {
        }
        ListRenderPool.fromPool = function (rendererClass, rendererDefineName) {
            if (!this._pool)
                this._pool = {};
            if (!rendererDefineName)
                rendererDefineName = egret.getQualifiedClassName(rendererClass);
            var list = this._pool[rendererDefineName];
            if (list && list.length) {
                return list.pop();
            }
            return new rendererClass();
        };
        ListRenderPool.toPool = function (item, rendererDefineName) {
            if (!this._pool)
                this._pool = {};
            if (!rendererDefineName)
                rendererDefineName = egret.getQualifiedClassName(item);
            if (!this._pool[rendererDefineName]) {
                this._pool[rendererDefineName] = [];
            }
            var list = this._pool[rendererDefineName];
            if (list.indexOf(item) < 0) {
                list.push(item);
            }
        };
        return ListRenderPool;
    }());
    ui.ListRenderPool = ListRenderPool;
    __reflect(ListRenderPool.prototype, "ui.ListRenderPool");
    var List = (function (_super) {
        __extends(List, _super);
        function List() {
            return _super.call(this) || this;
        }
        List.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this._space = 0;
            this._container = new egret.DisplayObjectContainer();
            this._scroll = new egret.ScrollView(this._container);
            this._scroll.verticalScrollPolicy = 'on';
            this._scroll.horizontalScrollPolicy = 'off';
            this.addChild(this._scroll);
            this._items = [];
        };
        Object.defineProperty(List.prototype, "listRenderer", {
            set: function (rendererClass) {
                this._listRenderer = rendererClass;
                if (this._listRenderer)
                    this._listRendererName = egret.getQualifiedClassName(this._listRenderer);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "dataSource", {
            set: function (v) {
                this._dataSource = v;
                egret.callLater(this.invalidateData, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "space", {
            set: function (v) {
                if (this._space != v) {
                    this._space = v;
                    egret.callLater(this.invalidateData, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        List.prototype.invalidateSize = function () {
            this._scroll.width = this.width;
            this._scroll.height = this.height;
        };
        List.prototype.invalidateData = function () {
            if (this._items && this._items.length) {
                for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    item.remove();
                    ListRenderPool.toPool(item, this._listRendererName);
                }
            }
            if (this._dataSource) {
                var sy = 0;
                for (var _b = 0, _c = this._dataSource; _b < _c.length; _b++) {
                    var dataItem = _c[_b];
                    var item = ListRenderPool.fromPool(this._listRenderer, this._listRendererName);
                    this._container.addChild(item);
                    this._items.push(item);
                    item.add();
                    item.data = dataItem;
                    item.y = sy;
                    sy += item.height + this._space;
                }
            }
        };
        return List;
    }(ui.Component));
    ui.List = List;
    __reflect(List.prototype, "ui.List");
})(ui || (ui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        openctx.registerView(openctx.UIName.Example, ExampleContent);
        openctx.initialize(egret.lifecycle.stage, _this);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.createChildren, _this);
        return _this;
    }
    Main.prototype.createChildren = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.createChildren, this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var ExampleContent = (function (_super) {
    __extends(ExampleContent, _super);
    function ExampleContent() {
        return _super.call(this) || this;
    }
    ExampleContent.prototype.createChildren = function () {
        this._list = new ui.List();
        this.addChild(this._list);
        this._list.listRenderer = Renderer;
        this._list.dataSource = ['1111', '2222', '3333', '444', '555', '6t666', '67777', '1111', '2222', '3333', '444', '555', '6t666', '67777'];
        this.size(428, 588);
    };
    ExampleContent.prototype.invalidateSize = function () {
        this._list.width = this.width;
        this._list.height = this.height;
    };
    ExampleContent.prototype.add = function () {
        _super.prototype.add.call(this);
    };
    return ExampleContent;
}(openctx.UIOpenContext));
__reflect(ExampleContent.prototype, "ExampleContent");
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        return _super.call(this) || this;
    }
    Renderer.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        var image = new ui.Image();
        image.scale9grid = new egret.Rectangle(20, 20, 20, 20);
        image.url = 'resource-opencontext/back_gold.png';
        image.width = 428;
        image.height = 200;
        this.addChild(image);
        var iconButton = new ui.IconButton();
        iconButton.scale9grid = new egret.Rectangle(20, 20, 20, 20);
        iconButton.url = 'resource-opencontext/back_gold.png';
        iconButton.pivot(0.5, 0.5);
        iconButton.width = 130;
        iconButton.height = 80;
        iconButton.x = 428 - 130 / 2 - 20;
        iconButton.y = 200 / 2;
        this.addChild(iconButton);
        this.size(400, 200);
    };
    return Renderer;
}(ui.ListRenderer));
__reflect(Renderer.prototype, "Renderer");
var ui;
(function (ui) {
    var SnapButton = (function (_super) {
        __extends(SnapButton, _super);
        function SnapButton() {
            return _super.call(this) || this;
        }
        SnapButton.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this._offsetLabel = { x: 0, y: 0.2 };
            this._label = new ui.Label();
            this._label.align = 'center';
            this.addChild(this._label);
        };
        Object.defineProperty(SnapButton.prototype, "label", {
            get: function () {
                return this._label.text;
            },
            set: function (v) {
                this._label.text = v;
                egret.callLater(this.invalidateSize, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapButton.prototype, "labelOffsetX", {
            set: function (v) {
                this._offsetLabel.x = v;
                egret.callLater(this.invalidateSize, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapButton.prototype, "labelOffsetY", {
            set: function (v) {
                this._offsetLabel.y = v;
                egret.callLater(this.invalidateSize, this);
            },
            enumerable: true,
            configurable: true
        });
        // protected updateAnchorOffset() {
        //     this._bitmap.x = -this._anchorOffset.x;
        //     this._bitmap.y = -this._anchorOffset.y;
        //     this._label.x = -this._anchorOffset.x;
        //     this._label.y = this.height/2-this._label.height/2-this._anchorOffset.y+this.height*this._offsetLabel.y;
        // }
        SnapButton.prototype.invalidateSize = function () {
            _super.prototype.invalidateSize.call(this);
            this._label.width = this.width;
            this._label.autoHeight();
            // this._label.y=this.height/2-this._label.height/2-this._anchorOffset.y+this.height*this._offsetLabel.y;
        };
        return SnapButton;
    }(ui.IconButton));
    ui.SnapButton = SnapButton;
    __reflect(SnapButton.prototype, "ui.SnapButton");
})(ui || (ui = {}));

;window.Main = Main;