define(['menu'], function (menu) {
    var fps = 10;
    var now;
    var then = Date.now();
    var interval = 1000 / fps;
    var delta;
    var main = function () {
        menu.init([{
            text: '新的开始', click: function () {
                menu.fadeout(function () {
                    console.log("进入新的开始");
                });
            }
        }, {
            text: '旧的回忆', click: function () {
                console.log("旧的回忆");
            }
        }, {
            text: '我是什么鬼', click: function () {
                console.log("进入我是什么鬼");
            }
        }]);
        var main = function () {
            requestAnimationFrame(main);
            now = Date.now();
            delta = now - then;
            if (delta > interval) {
                // 这里不能简单then=now，否则还会出现上边简单做法的细微时间差问题。例如fps=10，每帧100ms，而现在每16ms（60fps）执行一次draw。16*7=112>100，需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
                then = now - (delta % interval);
                menu.render();// ... Code for Drawing the Frame ...
            }
        };
        main();
    }
    return {
        main: main
    };
});
//lead.js
//define(function(){
//    return {
//        lead:function () {
//
//            var bgReady = false;
//            var bgImage = new Image();
//            bgImage.onload = function () {
//                bgReady = true;
//            };
//            bgImage.src = 'images/main/bg.jpg';
//            var choseMenu = 1;
//            var over = 0; // 0 未选择 1.新的开始 2.旧的回忆
//            var alpha = 0;
//
//            // 渲染对象
//            var render = function () {
//                if (bgReady) {
//                    $().drawImage(bgImage, 0, 0, 600, 600);
//                    $().font = "30px 微软雅黑";
//                    $().fillStyle = "red";
//
//                    if(choseMenu % 2 == 0) {
//                        $().fillText("新的开始", 250, 300);
//                        $().fillText("旧的回忆←", 250, 400);
//                    } else {
//                        $().fillText("新的开始←", 250, 300);
//                        $().fillText("旧的回忆", 250, 400);
//                    }
//                }
//
//                if (over == 1) {
//                    $().fillStyle = 'rgba(181, 25, 25, ' + (alpha++) / 100 + ')';  //填充的颜色
//                    $().linewidth = 10;  //边框宽
//                    $().fillRect(0, 0, 600, 600);  //填充颜色 x y坐标 宽 高
//                }
//
//            }
//
//            // 主刷新进程
//            var main = function () {
//                render();
//                if (alpha <= 100) {
//                    requestAnimationFrame(main);
//                } else {
//
//                    createJS('day1');
//                }
//            };
//
//            KeyBoard.on("up",function(){
//                Controller.onUp();
//                choseMenu ++
//            });
//            KeyBoard.on("down",function(){
//                choseMenu --
//            });
//            KeyBoard.on("enter",function(){
//                choseMenu % 2 == 0 ? over = 2 : over = 1;
//            });
//            main();
//        }
//    }
//});


