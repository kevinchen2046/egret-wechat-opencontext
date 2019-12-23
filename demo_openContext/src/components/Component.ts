module ui {
    export class Component extends egret.DisplayObjectContainer {
        protected _enabled: boolean;
        protected _anchorOffset:{x:number,y:number};

        constructor() {
            super();
            this._enabled = true;
            this._anchorOffset={x:0,y:0};
            this.createChildren();
            //this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createChildren, this);
        }

        protected createChildren(): void {
            //this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.createChildren, this);
        }

        public invalidateNow(){
            this.invalidateSize();
        }

        public set enabled(value: boolean) {
            this._enabled = value;
            this.touchEnabled = this.touchChildren = value;
        }

        public get enabled(): boolean {
            return this._enabled;
        }

        public size(w:number,h:number){
            this.width=w;
            this.height=h;
        }

        public set width(v:number){
            egret.superSetter(ui.Component,this,'width',v);
            egret.callLater(this.invalidateSize,this);
        }

        public get width(){
            return egret.superGetter(ui.Component,this,'width');;
        }
        
        public set height(v:number){
            egret.superSetter(ui.Component,this,'height',v);
            egret.callLater(this.invalidateSize,this);
        }

        public get height(){
            return egret.superGetter(ui.Component,this,'height');;
        }

        protected invalidateSize(){}   

        public setAnchorOffset(x:number,y:number){
            this._anchorOffset.x=x;
            this._anchorOffset.y=y;
            this.updateAnchorOffset();
        }

        protected updateAnchorOffset(){}
    }
}