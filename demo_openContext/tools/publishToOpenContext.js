var fs = require('fs');
var path = require('path');


class PublishOpenContextPlugin {

    constructor(publishType) {
        var parentPath = path.dirname(__dirname);
        var projectName = path.basename(parentPath);
        var mainProjectName = projectName.substring(0, projectName.lastIndexOf('_'));
        var mainOutDir = `../${mainProjectName}_wxgame`;
        this.build(mainProjectName, publishType, mainOutDir);
    }

    async build(mainProjectName, publishType, mainOutDir) {
        await this.runCmd('egret publish -target wxgame');

        if (!fs.existsSync(`${mainOutDir}/resource-opencontext`)) this.createFolder(`${mainOutDir}/resource-opencontext`);
        this.clearFolder(`${mainOutDir}/resource-opencontext`);
        this.copyFolder(`./resource-opencontext`, `${mainOutDir}/resource-opencontext`, true);

        var openContextFolderName = 'openDataContext';
        if (fs.existsSync(mainOutDir)) {
            var gameconfig = JSON.parse(fs.readFileSync(`${mainOutDir}/game.json`).toString());
            openContextFolderName = gameconfig.openDataContext;
        }
        var scriptOutDir = `${mainOutDir}/${openContextFolderName}`;
        this.clearFolder(scriptOutDir); 
        if (publishType == '-release') {
            await this.runCmd('uglifyjs ./bin_wxgame/js/main.js -o ./bin_wxgame/js/main.min.js');
        }
        if (publishType == '-release') {
            this.copyFile(`./scripts-opencontext/egret.min.js`, scriptOutDir);
            this.copyFile(`./scripts-opencontext/egret.wxgame.min.js`, scriptOutDir);
            this.copyFile(`./scripts-opencontext/game.min.js`, scriptOutDir);
            this.copyFile(`./scripts-opencontext/tween.min.js`, scriptOutDir);
            this.copyFile(`./scripts-opencontext/weapp-adapter.min.js`, scriptOutDir);
            this.copyFile(`./bin_wxgame/js/main.min.js`, scriptOutDir);
            this.copyFile(`./scripts-opencontext/index.min.js`, scriptOutDir, 'index.js');
        } else {
            this.copyFile(`./scripts-opencontext/egret.js`, scriptOutDir);
            this.copyFile(`./scripts-opencontext/egret.wxgame.js`, scriptOutDir);
            this.copyFile(`./scripts-opencontext/game.js`, scriptOutDir);
            this.copyFile(`./scripts-opencontext/tween.js`, scriptOutDir);
            this.copyFile(`./scripts-opencontext/weapp-adapter.js`, scriptOutDir);
            this.copyFile(`./bin_wxgame/js/main.js`, scriptOutDir);
            this.copyFile(`./scripts-opencontext/index.js`, scriptOutDir);
        }

        var htmlConfig = fs.readFileSync(`../${mainProjectName}/index.html`).toString();
        var values=this.getValues(`../${mainProjectName}/index.html`,['data-content-width','data-content-height']);
        var indexConfig = fs.readFileSync(`${scriptOutDir}/index.js`).toString();
        indexConfig = indexConfig.replace(/640/g, values[0]).replace(/1136/g, values[1]);
        fs.writeFileSync(`${scriptOutDir}/index.js`, indexConfig, 'utf-8');
    }

    async runCmd(cmd, method) {
        return new Promise((relove, reject) => {
            var childProcess = require('child_process');
            var handler = childProcess.exec(cmd, {
                encoding: 'buffer',
                timeout: 0, /*子进程最长执行时间 */
                maxBuffer: 1024 * 1024
            });
            function stdotHandler(data) {
                console.log(data.toString());
            }
            function stderrHandler(data) {
                console.log(data.toString());
            }
            function exitHandler(code) {
                handler.stdout.removeListener('data', stdotHandler);
                handler.stderr.removeListener('data', stderrHandler);
                handler.removeListener('exit', exitHandler);
                if (code == 0) {
                    relove();
                    if (method) method();
                } else {
                    reject();
                }
            }
            handler.stdout.on('data', stdotHandler);
            handler.stderr.on('data', stderrHandler);
            handler.on('exit', exitHandler);
        });
    }

    removeFolder(path) {
        if (!fs.existsSync(path)) return;
        this.clearFolder(path);
        fs.rmdirSync(path);
    }

    clearFolder(path) {
        if (!fs.existsSync(path)) return;
        var files = fs.readdirSync(path);
        for (var name of files) {
            var curPath = path + '/' + name;
            if (fs.statSync(curPath).isDirectory()) {
                this.removeFolder(curPath + '/');
            } else {
                //console.log("unlink", curPath)
                fs.unlinkSync(curPath);
            }
        }
    }

    copyFile(filePath, toPath, newName) {
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return;
        if (!fs.existsSync(toPath)) {
            fs.mkdirSync(toPath);
        }
        toPath = toPath.replace(/\\/, '/').replace(/\/\//, '/').replace(/\/\//, '/')
        filePath = filePath.replace(/\\/, '/').replace(/\/\//, '/').replace(/\/\//, '/')
        var index = filePath.lastIndexOf('.');
        if (index < 0 || index < (filePath.length - 6)) {
            return;
        }
        toPath = toPath.charAt(toPath.length - 1) != '/' ? (toPath + '/') : toPath;
        var name = newName ? newName : (filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length));
        fs.writeFileSync(toPath + name, fs.readFileSync(filePath));
    }

    copyFolder(fromPath, toPath, showlog = false) {
        if (!fs.existsSync(fromPath)) {
            if (showlog) {
                console.error('源文件夹不存在:', fromPath);
            }
            return;
        }
        if (!fs.existsSync(toPath)) {
            if (showlog) {
                console.error('目标文件夹不存在:', toPath, '开始创建.');
            }
            fs.mkdirSync(toPath);
        }
        var fromFiles = this.getFolderFiles(fromPath);
        var toFiles = [];
        fromFiles.map(function (filePath) {
            toFiles.push(filePath.replace(fromPath, toPath));
        })
        for (var i = 0; i < fromFiles.length; i++) {
            var fromPath = fromFiles[i].replace(/\\/, '/').replace(/\/\//, '/').replace(/\/\//, '/');
            var toPath = toFiles[i].replace(/\\/, '/').replace(/\/\//, '/').replace(/\/\//, '/');
            var folderPath = toPath.substring(0, toPath.lastIndexOf('/'));
            if (!fs.existsSync(folderPath)) {
                if (showlog) {
                    console.error('目标文件夹不存在:', folderPath, '开始创建.');
                }
                this.createFolder(folderPath);
            }
            if (showlog) console.log('复制文件:', fromPath, toPath);
            fs.writeFileSync(toPath, fs.readFileSync(fromPath));
        }
    }
    getFolderFiles(path) {
        if (!fs.existsSync(path)) return [];
        var results = [];
        var files = fs.readdirSync(path);
        for (var name of files) {
            var curPath = path + '/' + name;
            if (fs.statSync(curPath).isDirectory()) {
                results = results.concat(this.getFolderFiles(curPath + '/'));
            } else {
                results.push(curPath);
            }
        }
        return results;
    }

    createFolder(path) {
        if (!path) return;
        path = path.replace(/\\/, '/');
        path = path.replace(/\/\//, '/');
        if (path.indexOf(':')) {
            path = path.substring(path.indexOf(':') + 1, path.length);
        }
        var paths = path.split('/');
        while (true) {
            if (!paths[0]) {
                paths.shift();
                continue;
            }
            break;
        }
        var fullP = '';
        for (var p of paths) {
            fullP += p + '/';
            if (!fs.existsSync(fullP)) {
                //console.log('create:',fullP);
                fs.mkdirSync(fullP);
            }
        }
    }


    getIndexs(content, property) {
        var index = content.indexOf(property);
        var startIndex;
        var startChar;
        var i = index + property.length;
        
        while (true) {
            var char = content.charAt(i);
            if (char == ':' || char == ' ' || char == '    '|| char == '=') {
                i++;
                continue;
            }
            if (char == "'" || char == '"') {
                startIndex = i;
                startChar = char;
                break;
            }
            break;
        }
        if (!startIndex) {
            console.error(`A格式不合法,取值失败...`);
            return null;
        }
        var endIndex = content.indexOf(startChar, startIndex + 1);
        if (!endIndex) {
            console.error(`B格式不合法,取值失败...`);
            return null;
        }
        return {start:startIndex,end:endIndex};
    }

    /**对文件中变量填值*/
    fillValue(file, objectName, property, value) {
        var content = fs.readFileSync(file, 'utf-8').toString();
        var index = content.indexOf(objectName);
        if (index == -1) {
            console.error(`在文件${file}未找到名称${objectName},填值失败...`);
            return;
        }
        // if(content.indexOf(objectName,index+objectName.length)>0){
        //     console.error(`在文件${file}找到多个名称${objectName}!填值失败...`);
        //     return;
        // }
        index = content.indexOf(property, index + objectName.length);
        if (index == -1) {
            console.error(`在文件${file}未找到名称${property},填值失败...`);
            return;
        }
        var indexs = this.getIndexs(content, property);
        if (indexs.start==-1||indexs.end==-1){
            console.error(`在文件${file}属性${property}格式不合法,填值失败...`);
            return;
        }
        content = content.substring(0, indexs.start + 1) + value + content.substring(indexs.end, content.length);
        fs.writeFileSync(file, content, 'utf-8');
    }

    /**对文件中变量填值*/
    getValues(file, propertys) {
        var content = fs.readFileSync(file, 'utf-8').toString();
        var results = [];
        for (var property of propertys) {
            var index = content.indexOf(property);
            if (index == -1) {
                console.error(`在文件${file}未找到名称${property},取值失败...`);
                results.push(null);
                continue;
            }
            var indexs=this.getIndexs(content, property);
            results.push(content.substring(indexs.start+1,indexs.end));
        }
        return results;
    }

}

new PublishOpenContextPlugin(process.argv[2]);