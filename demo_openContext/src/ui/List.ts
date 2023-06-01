module ui {

    export class ListRenderPool{
        private static _pool:{[key:string]:ListRenderer[]}
        public static fromPool(rendererClass:any,rendererDefineName?:string){
            if(!this._pool)  this._pool={};
            if(!rendererDefineName) rendererDefineName=egret.getQualifiedClassName(rendererClass);
            var list=this._pool[rendererDefineName];
            if(list&&list.length){
                return list.pop();
            }
            return new rendererClass();
        }

        public static toPool(item:ListRenderer,rendererDefineName?:string){
            if(!this._pool) this._pool={};
            if(!rendererDefineName) rendererDefineName=egret.getQualifiedClassName(item);
            if(!this._pool[rendererDefineName]){
                this._pool[rendererDefineName]=[];
            }
            var list=this._pool[rendererDefineName];
            if(list.indexOf(item)<0){
                list.push(item);
            }
        }
    }

    export class List extends Component {
        private _container:egret.DisplayObjectContainer;
        private _scroll:egret.ScrollView;
        private _listRenderer:any;
        private _listRendererName:string;
        private _dataSource:any[];
        private _items:ListRenderer[];
        private _space:number;
        constructor() {
            super();
        }

        protected createChildren(): void {
            super.createChildren();
            this._space=0;
            this._container=new egret.DisplayObjectContainer();
            this._scroll = new egret.ScrollView(this._container);
            this._scroll.verticalScrollPolicy='on';
            this._scroll.horizontalScrollPolicy='off';
            this.addChild(this._scroll);
            this._items=[];
        }

        public set listRenderer(rendererClass:any){
            this._listRenderer=rendererClass;
            if(this._listRenderer) this._listRendererName=egret.getQualifiedClassName(this._listRenderer);
        }

        public set dataSource(v:any[]){
            this._dataSource=v;
            egret.callLater(this.invalidateData,this);
        }

        public set space(v:number){
            if(this._space!=v){
                this._space=v;
                egret.callLater(this.invalidateData,this);
            }
        }
        
        protected invalidateSize(){
            this._scroll.width=this.width;
            this._scroll.height=this.height;
        }  

        protected invalidateData(){
            if(this._items&&this._items.length){
                for(var item of this._items){
                    item.remove();
                    ListRenderPool.toPool(item,this._listRendererName);
                }
            }
            if(this._dataSource){
                var sy:number=0;
                for(var dataItem of this._dataSource){
                    var item:ListRenderer=ListRenderPool.fromPool(this._listRenderer,this._listRendererName);
                    this._container.addChild(item);
                    this._items.push(item);
                    item.add();
                    item.data=dataItem;
                    item.y=sy;
                    sy+=item.height+this._space;
                }
            }
        }
    }
}