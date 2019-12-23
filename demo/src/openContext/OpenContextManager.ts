module opencontext {
	export class OpenContextManager {
		private _stage: egret.Stage;
		private _shareDisplayObject: egret.DisplayObject;
		private _mainContainer: egret.DisplayObjectContainer;
		private _views: { [key: string]: { clazz: any, view: DialogOpenContext } }
		private _curView: DialogOpenContext;
		public constructor() {
			if (OpenContextManager._instance) throw ("");
		}

		private static _instance: OpenContextManager;
		public static get instance(): OpenContextManager {
			if (!OpenContextManager._instance) {
				OpenContextManager._instance = new OpenContextManager();
			}
			return OpenContextManager._instance;
		}

		public get shareDisplayObject() { return this._shareDisplayObject; }

		public initialize(stage: egret.Stage, container: egret.DisplayObjectContainer) {
			this._stage = stage;
			this._mainContainer = container;
			this._views={};
			this._shareDisplayObject = this.createDisplayObject(stage.stageWidth, stage.stageHeight);
		}

		public registerView(viewName: string, contentClass: any) {
			this._views[viewName] = { clazz: contentClass, view: null };
		}

		public show(viewName: string) {
			if (this._views[viewName]) {
				if (!this._views[viewName].view) {
					this._views[viewName].view = new (this._views[viewName].clazz)();
				}
				if (this._views[viewName].view) {
					if(!this._views[viewName].view.group){
						console.error('窗口打开失败,当前窗口缺少为开放域窗体定义的变量group:eui.Group!');
						return;
					}
					this._mainContainer.addChild(this._views[viewName].view);
					this._curView = this._views[viewName].view;
					this._curView.x = this._stage.stageWidth / 2 - this._curView.width / 2;
					this._curView.y = this._stage.$stageHeight / 2 - this._curView.height / 2;
					this._curView.add();
					var p:egret.Point=this._curView.group.localToGlobal();
					this.postMessage(OpenContextEvent.OPEN, { viewName: viewName ,x:p?p.x:0,y:p?p.y:0});

					var sx = this._curView.x;
					var sy = this._curView.y;
					this._curView.scaleX = this._curView.scaleY = 0.1;
					this._curView.x = this._stage.stageWidth / 2 - this._curView.width*this._curView.scaleX / 2;
					this._curView.y = this._stage.$stageHeight / 2 - this._curView.height*this._curView.scaleY / 2;
					egret.Tween.get(this._curView).to({ x: sx, y: sy, scaleX: 1, scaleY: 1 }, 300, egret.Ease.backOut).call(this.showOver,this);
				}
			}
		}
		
		private showOver(){
			this._stage.addChild(this._shareDisplayObject);
		}

		public close() {
			if(!this._curView) return;
			egret.Tween.removeTweens(this._curView);
			if (this._curView.parent) {
				this._curView.remove();
				this._curView.parent.removeChild(this._curView);
				this.postMessage(OpenContextEvent.CLOSE);
			}
			if(this._shareDisplayObject.parent){
				this._shareDisplayObject.parent.removeChild(this._shareDisplayObject);
			}
		}
		private createDisplayObject(width: number, height: number) {
			(window as any).sharedCanvas.width = width;
			(window as any).sharedCanvas.height = height;
			const bitmapdata = new egret.BitmapData((window as any).sharedCanvas);
			bitmapdata.$deleteSource = false;
			const texture = new egret.Texture();
			texture._setBitmapData(bitmapdata);
			const bitmap = new egret.Bitmap(texture);
			bitmap.width = width;
			bitmap.height = height;
			if (egret.Capabilities.renderMode == "webgl") {
				const renderContext = (egret as any).wxgame.WebGLRenderContext.getInstance();
				const context = renderContext.context;
				////需要用到最新的微信版本
				////调用其接口WebGLRenderingContext.wxBindCanvasTexture(number texture, Canvas canvas)
				////如果没有该接口，会进行如下处理，保证画面渲染正确，但会占用内存。
				if (!context.wxBindCanvasTexture) {
					egret.startTick((timeStarmp) => {
						egret.WebGLUtils.deleteWebGLTexture(bitmapdata.webGLTexture);
						bitmapdata.webGLTexture = null;
						return false;
					}, this);
				}
			}
			return bitmap;
		}
		/**
		 * 发送自定义消息
		 * 开放域可以使用 OpenContextManager.instance.registerMessage(event:string,caller:any,method:Function) 注册监听
		 */
		public postMessage(event: string, data?: any) {
			if (!data) data = {};
			data.event = event;
			(wx as any).getOpenDataContext().postMessage(data);
		}
	}
}