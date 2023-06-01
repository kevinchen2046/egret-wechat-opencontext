module ui {
    export class Component extends egret.DisplayObjectContainer {
        protected _enabled: boolean;

        private _pivot: egret.Point;
        constructor() {
            super();
            this._enabled = true;
            this._pivot = new egret.Point();
            this.createChildren();
            //this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createChildren, this);
        }

        protected createChildren(): void {
            //this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.createChildren, this);
        }

        public invalidateNow() {
            this.invalidateSize();
        }

        public set enabled(value: boolean) {
            this._enabled = value;
            this.touchEnabled = this.touchChildren = value;
        }

        public get enabled(): boolean {
            return this._enabled;
        }

        public size(w: number, h: number) {
            this.width = w;
            this.height = h;
        }
        //@ts-ignore
        public set width(v: number) {
            egret.superSetter(ui.Component, this, 'width', v);
            egret.callLater(this.invalidateSize, this);
        }

        public get width() {
            return egret.superGetter(ui.Component, this, 'width');;
        }
        //@ts-ignore
        public set height(v: number) {
            egret.superSetter(ui.Component, this, 'height', v);
            egret.callLater(this.invalidateSize, this);
        }

        public get height() {
            return egret.superGetter(ui.Component, this, 'height');;
        }

        protected invalidateSize() {
            if (this._pivot.x != 0 || this._pivot.y != 0) {
                if (this.width && this.height) {
                    this.anchor(this.width * this._pivot.x, this.height * this._pivot.y);
                }
            }
        }

        anchor(x: number, y?: number) {
            this.anchorOffsetX = x;
            this.anchorOffsetY = y != undefined ? y : x;
            this.updateAnchorOffset()
        }

        pivot(x: number, y?: number) {
            if (!this._pivot) this._pivot = new egret.Point();
            this._pivot.setTo(x, y != undefined ? y : x);
            this.invalidateSize();
        }

        pos(x: number, y?: number) {
            this.x = x;
            this.y = y != undefined ? y : x;
        }

        scale(x: number, y?: number) {
            this.scaleX = x;
            this.scaleY = y != undefined ? y : x;
        }

        protected updateAnchorOffset() { }
    }
}