define(function () {
    var toColorRgb = function (sColor) {
        if (sColor) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return sColorChange;
        } else {
            return sColor;
        }
    };
    var extend = function (a, b) {
        for (var tem in b) {
            a[tem] = b[tem];
        }
    }
    var Listener;
    var setListener = function (context) {
        Listener = context;
    };

    addEventListener("keydown", function (e) {
        if (e.keyCode == 38) {
            Listener("up");
        } //上
        if (e.keyCode == 40) {
            Listener("down");
        } //下
        if(e.keyCode==37){
            Listener("left");
        }
        if(e.keyCode==39){
            Listener("right");
        }
        if (e.keyCode == 13 || e.keyCode == 32) {
            Listener("enter");
        }//回车 or 空格
        if (e.keyCode ==87) {
            Listener("w");
        } //上
        if (e.keyCode == 65) {
            Listener("a");
        } //下
        if(e.keyCode==83){
            Listener("s");
        }
        if(e.keyCode==68){
            Listener("d");
        }
        if(e.keyCode==80){
            Listener("p");
        }
    }, false);
    addEventListener("keyup", function (e) {
        if(Listener){
            Listener("keyup");
        }
    }, false);
    /**
     * 渐变文字
     */
    var shadowText = function () {
        var _self = this;
        this.conf = {
            stage: getStage(),//主舞台节点
            text: '默认文字',//显示文字
            fontSize: 30, //默认字体大小
            color: '#fffff',//默认文字颜色
            x: 0,//x坐标
            y: 0
        },
        this.init = function (data) {
                extend(_self.conf, data);
                console.log(_self.conf);
                _self.conf.stage.font = _self.conf.fontSize + 'px 微软雅黑';
                _self.conf.stage.fillStyle = _self.conf.color;
                _self.globalAlpha = 0.5;
                _self.conf.stage.fillText(_self.conf.text, _self.conf.x, _self.conf.y);
        },
        this.animation = function () {
        }
    };

    var R = {
        RCache:{},
        loading:[],
        readyCallbacks:[],
        // Load an image url or an array of image urls
        load:function(urlOrArr){
            if (urlOrArr instanceof Array) {
                urlOrArr.forEach(function (url) {
                    R._load(url);
                });
            }
            else {
                R._load(urlOrArr);
            }
            },
        _load:function (url) {
            if (this.RCache[url]) {
                return this.RCache[url];
            }
            else {
                var img = new Image();
                img.onload = function () {
                    R.RCache[url] = img;
                    if (R.isReady()) {
                        R.readyCallbacks.forEach(function (func) {
                            func();
                        });
                    }
                };
                this.RCache[url] = false;
                img.src = url;
            }
            },
        get:function (url) {
            return R.RCache[url];
            },
        isReady:function () {
            var ready = true;
            for (var k in this.RCache) {
                if (R.RCache.hasOwnProperty(k) && !R.RCache[k]) {
                    ready = false;
                }
            }
            return ready;
            },
        onReady:function (func) {
            R.readyCallbacks.push(func);
        }
    };
    var Sprite = function (ctx, url, pos, size, speed, frames, dir, once) {
        var pos = pos;
        var size = size;
        var speed = typeof speed === 'number' ? speed : 0;
        var frames = frames;
        var _index = 0;
        var url = url;
        var dir = dir || 'horizontal';
        var once = once;
        var ctx = ctx;
        var update = function (dt) {
            _index += speed * dt;
        };
        var reset=function(){
            _index=0;
        };
        var render = function () {
            var frame;
            if (speed > 0) {
                var max = frames.length;
                var idx = Math.floor(_index);
                frame = frames[idx % max];
                if (once && idx >= max) {
                    done = true;
                    return;
                }
            }else {
                frame = 0;
            }
            var x = pos[0];
            var y = pos[1];
            if (dir == 'vertical') {
                y += frame * size[1];
            }
            else {
                x += frame * size[0];
            }
            ctx.drawImage(R.get(url),
                x, y,
                size[0], size[1],
                0,0,
                size[0], size[1]);
        }
        return {
            reset:reset,
            render: render,
            update: update
        }
    };
    var CTX=function(width,height){
        var canvasBuffer=document.createElement("canvas");
        canvasBuffer.width=width||600;
        canvasBuffer.height=height||600;
        var contextBuffer=canvasBuffer.getContext("2d");
        contextBuffer.clearRect(0,0,canvasBuffer.width,canvasBuffer.height);
        return {canvas:canvasBuffer,
                context:contextBuffer};
    }
    var loadXML = function(xmlFile){
        var xmlDoc=null;
        //判断浏览器的类型
        //支持IE浏览器
        if(!window.DOMParser && window.ActiveXObject){
            var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
            for(var i=0;i<xmlDomVersions.length;i++){
                try{
                    xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                    break;
                }catch(e){
                }
            }
        }//支持Mozilla浏览器
        else if(document.implementation && document.implementation.createDocument){
            try{
                /* document.implementation.createDocument('','',null); 方法的三个参数说明
                 * 第一个参数是包含文档所使用的命名空间URI的字符串；
                 * 第二个参数是包含文档根元素名称的字符串；
                 * 第三个参数是要创建的文档类型（也称为doctype）
                 */

                xmlDoc = document.implementation.createDocument('','',null);
                console.log(xmlDoc);
            }catch(e){
            }
        }
        else{
            return null;
        }


        if(xmlDoc!=null){
            xmlDoc.async = false;
            xmlDoc.load(xmlFile);
        }
        return xmlDoc;
    }
    return {
        // KeyBoard: KeyBoard,
        Sprite: Sprite,
        Map: Map,
        R:R,
        CTX:CTX,
        setListener: setListener,
        shadowText: shadowText,
        extend: extend,
        toColorRgb: toColorRgb,
        loadXML:loadXML
    };
});