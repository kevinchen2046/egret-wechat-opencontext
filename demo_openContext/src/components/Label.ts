module ui {
    export class Label extends Component {
        protected _textfiled: egret.TextField;
        protected _fontSize: number;
        protected _fontColor: number;
        protected _fontName: string;
        protected _wordWrap: boolean;
        protected _multiline: boolean;
        protected _align:string; 
        constructor() {
            super();
        }

        protected createChildren(): void {
            super.createChildren();
            this._align='left';
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
        }

        public invalidateNow() {
            this.invalidateStyle();
            super.invalidateNow();
        }

        public autoHeight(){
            this.height=this._textfiled.textHeight;
        }

        public set text(v: string) {
            this._textfiled.text=v;
        }
        public get text(){return this._textfiled.text;}

        public set fontSize(v: number) {
            if (this._fontSize != v) {
                this._fontSize = v;
                this.invalidateStyle();
            }
        }
        public get fontSize(){return this._fontSize;}

        public set fontColor(v: number) {
            if (this._fontColor != v) {
                this._fontColor = v;
                this.invalidateStyle();
            }
        }

        public get fontColor(){return this._fontColor;}

        public set fontName(v: string) {
            if (this._fontName != v) {
                this._fontName = v;
                this.invalidateStyle();
            }
        }
        public get fontName(){return this._fontName;}

        public set align(v: string) {
            if (this._align != v) {
                this._align = v;
                this.invalidateStyle();
            }
        }
        public get align(){return this._align;}

        public set wordWrap(v: boolean) {
            if (this._wordWrap != v) {
                this._wordWrap = v;
                this.invalidateStyle();
            }
        }
        public get wordWrap(){return this._wordWrap;}

        public set multiline(v: boolean) {
            if (this._multiline != v) {
                this._multiline = v;
                this.invalidateStyle();
            }
        }
        public get multiline(){return this._multiline;}

        protected invalidateStyle() {
            this._textfiled.wordWrap = this._wordWrap;
            this._textfiled.multiline = this._multiline;
            this._textfiled.size = this._fontSize;
            this._textfiled.fontFamily = this._fontName;
            this._textfiled.textColor = this._fontColor;
            this._textfiled.textAlign = this._align
        }

        protected invalidateSize(){
            super.invalidateSize();
            this._textfiled.width=this.width;
            this._textfiled.height=this.height;
        }   
    }
}