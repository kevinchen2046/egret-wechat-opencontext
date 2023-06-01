# egret-wechat-opencontext

    利用白鹭引擎渲染小游戏开放域,总大小大约500K

## 项目环境
+ 安装nodejs
  ```
  官网下载安装 http://nodejs.cn/download/
  ```
+ 安装uglify-js
    ```
    npm install uglify-js -g
    ```
## 项目命名规范
+ 定义主项目名称为 ${name}
+ 开放域项目名称需要为 ${name}_openContext

## 特点
+ 开放域包含了 egret game tween库。
+ 未使用eui库，已自行封装了一些UI控件
  > Tip:    
  > 已经实现的控件有 Image IconButton SnapButton Label List

### 优点
+ 简单的API，方便调用
+ 一键命令行发布
+ 开放域项目可单独预览UI,方便调试UI布局
+ 实现了常用的UI控件，如有需要可自行扩展

### 缺点
- 需要占用额外500-600K（资源除外）的包体容量
- UI需要通过代码布局 没有可视化布局
> Tip:  
> 关于Ui布局，可以利用白鹭的Ui编辑器先确定坐标位置，在通过代码校准，这样可以提高代码布局Ui的效率

## 主要代码调用示例

### 主域
主域显示UI
```javascript
openctx.initialize(this.stage, this);
openctx.registerView(openctx.UIName.Example, ExampleDialog);
openctx.show(openctx.UIName.Example);
```
### 开放域
开放域注册UI内容
```javascript
openctx.registerView(openctx.UIName.Example,ExampleContent);
openctx.initialize(this.stage,this);
```

### 注意
+ 主域的UI需要额外添加一个group以辅助开放域的UI的定位
+ 主域的UI需要提供关闭功能
  