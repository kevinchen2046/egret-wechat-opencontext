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

        openctx.registerView(openctx.UIName.Example, ExampleContent)

        openctx.initialize(egret.lifecycle.stage, this);

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
    }
}

class ExampleContent extends openctx.UIOpenContext {
    private _list: ui.List
    constructor() {
        super();
    }

    protected createChildren() {
        this._list = new ui.List();
        this.addChild(this._list);
        this._list.listRenderer = Renderer;
        this._list.dataSource = ['1111', '2222', '3333', '444', '555', '6t666', '67777', '1111', '2222', '3333', '444', '555', '6t666', '67777'];
        this.size(428, 588);
    }

    protected invalidateSize() {
        this._list.width = this.width;
        this._list.height = this.height;
    }

    public add() {
        super.add();
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
        iconButton.pivot(0.5,0.5);
        iconButton.width = 130;
        iconButton.height = 80;
        iconButton.x = 428 - 130/2 - 20;
        iconButton.y = 200 / 2 ;
        this.addChild(iconButton);

        this.size(400, 200);
    }
}
