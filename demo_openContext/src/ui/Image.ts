module ui {
    export class Image extends Component {
        protected _bitmap: egret.Bitmap;
        protected _url: string;
        protected _scale9grid: egret.Rectangle;
        constructor() {
            super();
        }

        protected createChildren(): void {
            super.createChildren();
            this._bitmap = new egret.Bitmap();
            this.addChild(this._bitmap);
        }

        public set scale9grid(v: egret.Rectangle) {
            this._scale9grid = v;
            this._bitmap.fillMode = egret.BitmapFillMode.SCALE;
            this._bitmap.scale9Grid = v;
        }

        public set url(v: string) {
            if (this._url != v) {
                if (this._url) {
                    ImageLoader.remove(this._url, this, this.loadedHandler);
                }
                this._url = v;
                if (this._url) {
                    ImageLoader.load(this._url, !!this._scale9grid, this, this.loadedHandler);
                }
            }
        }

        private loadedHandler(texture: egret.Texture) {
            if (!texture) return;
            this._bitmap.texture = texture;
            if (!this.width || !this.height) {
                this.size(texture.textureWidth, texture.textureHeight);
            }
            this.updateAnchorOffset();
        }

        protected invalidateSize() {
            super.invalidateSize();
            this._bitmap.width = this.width;
            this._bitmap.height = this.height;
        }

        // protected updateAnchorOffset() {
        //     this._bitmap.x = -this.anchorOffsetX.x;
        //     this._bitmap.y = -this._anchorOffset.y;
        // }
    }
}