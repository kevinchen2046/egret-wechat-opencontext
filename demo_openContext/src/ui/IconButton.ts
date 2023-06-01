module ui {
    export class IconButton extends Image {
        private _scaleX: number;
        private _scaleY: number;
        private _sound: string = 'ui_click_routine';
        private _soundOvedrride: boolean = false;
        private _minscale: number = 0.9;
        constructor() {
            super();
        }

        protected createChildren() {
            super.createChildren();
            this._scaleX = this.scaleX;
            this._scaleY = this.scaleY;
            this.touchEnabled=true;
            this.touchChildren=true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        }

        private removeFromStage(e: egret.Event) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
        }

        private touchHandler(e: egret.TouchEvent) {
            egret.Tween.removeTweens(this);
            switch (e.type) {
                case egret.TouchEvent.TOUCH_BEGIN:
                    // this.scaleX = this._scaleX;
                    // this.scaleY = this._scaleY;
                    egret.Tween.get(this).to({ scaleX: this._scaleX * this._minscale, scaleY: this._scaleY * this._minscale }, 300, egret.Ease.cubicOut);
                    this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
                    // if(this._sound) mg.soundManager.playSound(this._sound,1,this._soundOvedrride);
                    break;
                case egret.TouchEvent.TOUCH_END:
                    egret.Tween.get(this).to({ scaleX: this._scaleX, scaleY: this._scaleY }, 300, egret.Ease.circOut);
                    if (this.stage) this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
                    break;
            }
        }

        public set sound(v: string) {
            this._sound = v;
        }

        public get sound(): string {
            return this._sound;
        }

        public set soundOvedrride(v: boolean) {
            this._soundOvedrride = v;
        }

        public get soundOvedrride(): boolean {
            return this._soundOvedrride;
        }
    }
}