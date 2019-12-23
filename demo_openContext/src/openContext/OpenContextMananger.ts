module opencontext {


	export class OpenContextManager {
		private _stage: egret.Stage;
		private _mainContainer: egret.DisplayObjectContainer;
		private _views: { [key: string]: {clazz:any,view:ContentOpenContext} }
		private _curView:ContentOpenContext;
		private _messageHandlers:{[key:string]:{caller:any,method:Function}[]}
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

		public get mainContainer() { return this._mainContainer; }

		public initialize(stage: egret.Stage, mainContainer: egret.DisplayObjectContainer) {
			this._stage = stage;
			this._mainContainer = mainContainer;
			this._views = {};
			wx.onMessage(this.messageHandler.bind(this));
		}

		private messageHandler(res: any) {
			switch(res.event){
				case OpenContextEvent.OPEN:
					this.show(res.viewName,res.x,res.y);
				break;
				case OpenContextEvent.CLOSE:
					this.close();
				break;
				default:
				if(this._messageHandlers[res.event]){
					var list=this._messageHandlers[res.event];
					for(var obj of list){
						obj.method.call(obj.caller,res);
					}
				}
				break;
			}
		}

		public registerMessage(event:string,caller:any,method:Function){
			if(!this._messageHandlers[event]){
				this._messageHandlers[event]=[];
			}
			this._messageHandlers[event].push({caller:caller,method:method});
		}

		public registerView(viewName: string, contentClass: any) {
			this._views[viewName]={clazz:contentClass,view:null};
		}

		public show(viewName: string,x:number,y:number) {
			//((window as any).player as Player);
			if(this._views[viewName]){
				if(!this._views[viewName].view){
					this._views[viewName].view=new (this._views[viewName].clazz)();
				}
				if(this._views[viewName].view){
					this._mainContainer.addChild(this._views[viewName].view);
					this._curView=this._views[viewName].view;
					this._curView.x=x;
					this._curView.y=y;
					this._curView.add();
				}
			}
		}

		public close() {
			if(this._curView.parent){
				this._curView.remove();
				this._curView.parent.removeChild(this._curView);
			}
		}
	}
}