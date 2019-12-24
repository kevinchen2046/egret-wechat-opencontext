//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createChildren, this);
    }

    protected createChildren(): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.createChildren, this);

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        // var button:MainUI=new MainUI();
        // this.addChild(button);

        // var shape = new egret.Shape();
        // shape.graphics.beginFill(0xFFFFFF, 0.5);
        // shape.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        // this.addChild(shape);

        // var sprite = new egret.Sprite();
        // sprite.graphics.beginFill(0xFFFF00, 0.5);
        // sprite.graphics.drawRect(0, 0, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
        // this.stage.addChild(sprite);

        // // this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
        // //   console.log('click');
        // // }, this)
        // sprite.touchEnabled = true;
        // sprite.touchChildren = true;

        // sprite.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
        //     console.log('click11');
        // }, this)

        // var image: ui.Image = new ui.Image();
        // image.scale9grid = new egret.Rectangle(20, 20, 20, 20);
        // image.url = 'resource/openContext/back_gold.png';
        // image.width = 300;
        // image.height = 200;
        // this.addChild(image);

        // var iconButton: ui.IconButton = new ui.IconButton();
        // iconButton.scale9grid = new egret.Rectangle(20, 20, 20, 20);
        // iconButton.url = 'resource/openContext/back_gold.png';
        // iconButton.setAnchorOffset(150, 100);
        // iconButton.width = 300;
        // iconButton.height = 100;
        // iconButton.x = 300;
        // this.addChild(iconButton);

        // var snapButton: ui.SnapButton = new ui.SnapButton();
        // snapButton.scale9grid = new egret.Rectangle(20, 20, 20, 20);
        // snapButton.url = 'resource/openContext/back_gold.png';
        // snapButton.label = 'XXXXXXX';
        // snapButton.setAnchorOffset(150, 100);
        // snapButton.width = 300;
        // snapButton.height = 100;
        // snapButton.x = 300;
        // snapButton.y = 200;
        // this.addChild(snapButton);
        opencontext.OpenContextManager.instance.initialize(this.stage,this);
        opencontext.OpenContextManager.instance.registerView(opencontext.OpenContextViewName.Example,ExampleContent)
    }
}

class ExampleContent extends opencontext.ContentOpenContext {
    private _list: ui.List
    constructor() {
        super();
    }

    protected createChildren() {
        this._list = new ui.List();
        this.addChild(this._list);
        this._list.listRenderer = Renderer;
        this._list.dataSource = ['1111', '2222', '3333', '444', '555', '6t666', '67777','1111', '2222', '3333', '444', '555', '6t666', '67777'];
        this._list.width = 428;
        this._list.height = 588;
    }

    public add(){
        super.add();
        this._list.width = 428;
        this._list.height = 588;
    }
}

class Renderer extends ui.ListRenderer {
    constructor() {
        super();
    }

    protected createChildren() {
        super.createChildren();

        var image: ui.Image = new ui.Image();
        image.scale9grid = new egret.Rectangle(20, 20, 20, 20);
        image.url = 'resource-opencontext/back_gold.png';
        image.width = 428;
        image.height = 200;
        this.addChild(image);

        var iconButton: ui.IconButton = new ui.IconButton();
        iconButton.scale9grid = new egret.Rectangle(20, 20, 20, 20);
        iconButton.url = 'resource-opencontext/back_gold.png';
        iconButton.setAnchorOffset(75, 40);
        iconButton.width = 130;
        iconButton.height = 80;
        iconButton.x = 300+75;
        iconButton.y = 75+40;
        this.addChild(iconButton);

        this.size(400, 200);
    }
}
