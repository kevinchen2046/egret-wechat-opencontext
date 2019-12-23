module ui {
    export class ListRenderer extends Component {
        private _data:any;
        private _width:number;
        private _height:number;
        constructor() {
            super();
        }

        public set width(v:number){
            this._width=v;
            egret.callLater(this.invalidateSize,this);
        }

        public get width(){
            return this._width;
        }
        
        public set height(v:number){
            this._height=v;
            egret.callLater(this.invalidateSize,this);
        }

        public get height(){
            return this._height;
        }

        public add(){

        }

        public remove(){
            this._data=null;
        }

        public set data(v:any){
            if(this._data!=v){
                this.preDataChange();
                this._data=v;
                this.dataChange();
            }
        }

        public get data(){return this._data;}

        protected preDataChange(){}

        protected dataChange(){}
    }
}