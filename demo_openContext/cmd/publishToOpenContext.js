var fs = require('fs');
var path = require('path');


class PublishOpenContextPlugin {

    constructor(publishType) {
        var parentPath = path.dirname(__dirname);
        var projectName = path.basename(parentPath);
        var mainProjectName = projectName.split('_')[0];
        var mainOutDir = `../${mainProjectName}_wxgame`;
        this.build(publishType,mainOutDir);
    }

    async build(publishType, mainOutDir) {
        await this.runCmd('egret publish -target wxgame');

        this.clearFolder(`${mainOutDir}/resource-opencontext`);
        this.copyFolder(`./resource-opencontext`, `${mainOutDir}/resource-opencontext`, true);

        this.clearFolder(`${mainOutDir}/openDataContext`);
        if (publishType == '-release') {
            await this.runCmd('uglifyjs ./bin_wxgame/js/main.js -o ./bin_wxgame/js/main.min.js');
        }

        if (publishType == '-release') {
            this.copyFile(`./scripts-opencontext/egret.min.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./scripts-opencontext/egret.wxgame.min.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./scripts-opencontext/game.min.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./scripts-opencontext/tween.min.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./scripts-opencontext/weapp-adapter.min.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./bin_wxgame/js/main.min.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./scripts-opencontext/index.min.js`, `${mainOutDir}/openDataContext`,'index.js');
        } else {
            this.copyFile(`./scripts-opencontext/egret.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./scripts-opencontext/egret.wxgame.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./scripts-opencontext/game.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./scripts-opencontext/tween.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./scripts-opencontext/weapp-adapter.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./bin_wxgame/js/main.js`, `${mainOutDir}/openDataContext`);
            this.copyFile(`./scripts-opencontext/index.js`, `${mainOutDir}/openDataContext`);
        }
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
}

new PublishOpenContextPlugin(process.argv[2]);