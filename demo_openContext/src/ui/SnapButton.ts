module ui {
    export class SnapButton extends IconButton {

        private _label: Label;
        private _offsetLabel:{x:number,y:number};
        public constructor() {
            super();
        }
        protected createChildren(): void {
            super.createChildren();
            this._offsetLabel={x:0,y:0.2}
            this._label = new Label();
            this._label.align='center';
            this.addChild(this._label);
        }

        public set label(v: string) {
            this._label.text = v;
            egret.callLater(this.invalidateSize,this);
        }

        public get label(): string {
            return this._label.text;
        }
        
        public set labelOffsetX(v:number){
            this._offsetLabel.x=v;
            egret.callLater(this.invalidateSize,this);
        }
        
        public set labelOffsetY(v:number){
            this._offsetLabel.y=v;
            egret.callLater(this.invalidateSize,this);
        }

        // protected updateAnchorOffset() {
        //     this._bitmap.x = -this._anchorOffset.x;
        //     this._bitmap.y = -this._anchorOffset.y;
        //     this._label.x = -this._anchorOffset.x;
        //     this._label.y = this.height/2-this._label.height/2-this._anchorOffset.y+this.height*this._offsetLabel.y;
        // }

        protected invalidateSize() {
            super.invalidateSize();
            this._label.width = this.width;
            this._label.autoHeight();
            this._label.y=this.height/2-this._label.height/2-this._anchorOffset.y+this.height*this._offsetLabel.y;
        }
    }
}
