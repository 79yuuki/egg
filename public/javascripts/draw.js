/* global $ */
var socket = io.connect('http://bapa-egg.herokuapp.com');
//var socket = io.connect('http://192.168.10.6:3000/');
var s = socket.of('/socket');
s.on('connect', function() {
    console.log("conneted!!");
});

window.addEventListener("load", function () {

  // 必要な変数を宣言しておく
  var canvas = document.getElementById("main");
  var c = canvas.getContext("2d");
  var w = $('body').width();
  var h = $('body').height();
  var drawing = false;
  var lineLocus = [];
  var locusNum = 0;
  var oldPos;
  var throwFlag = false;

  // CanvasとContextを初期化する
  canvas.width = w;
  canvas.height = h;
  c.strokeStyle = "#000000";
  c.lineWidth = 10;
  c.lineJoin = "round";
  c.lineCap = "round";

  // タップ開始時に、絵を描く準備をする
  canvas.addEventListener("touchstart", function (event) {
    drawing = true;
    lineLocus[locusNum] = getPosT(event);
  }, false);

  // タップ終了時に、絵を描く後処理を行う
  canvas.addEventListener("touchend", function () {
    drawing = false;
  }, false);

  // gestureイベント（２本指以上で触ると発生するやつ）の
  // 終了時にも絵を描く後処理を行う
  canvas.addEventListener("gestureend", function () {
    console.log("mouseout");
    drawing = false;
  }, false);

  // 実際に絵を描く処理
  // 前回に保存した位置から現在の位置迄線を引く
  canvas.addEventListener("touchmove", function (event) {
    var pos = getPosT(event);
    if (drawing) {
      oldPos = lineLocus[locusNum];
// console.log(oldPos);
      c.beginPath();
      c.moveTo(oldPos.x, oldPos.y);
      c.lineTo(pos.x, pos.y);
      c.stroke();
      c.closePath();
      if (crossCheck(oldPos, pos)) {
        c.clearRect(0, 0, $(canvas).width(), $(canvas).height());
        getCircleData(function(err, top, height){
           // drawEgg({ x: top.y, y: -top.x }, height);
           vibe(top, height);
$('canvas').animate({ 'margin-top': '-999px'});
        });
        throwFlag = true;
      }
      locusNum++;
      lineLocus[locusNum] = pos;

//console.log(lineLocus[locusNum]);
    }
  }, false);

  function vibe(top, height){//a:したいこと,s:開始時間,e:終了時間,f:更新間隔時間
    var maxH = height + 6;
    var rate = 1.0;
    var animation = function(){
      c.clearRect(0, 0, $(canvas).width(), $(canvas).height());
      drawEgg({x: top.y, y: -top.x }, height);

      if (maxH > (height + rate)) {
        rate += 0.8;
      } else {
        rate -= 0.8;
      }
      height += rate;
    };

    setTimeout(function(){
      setTimeout("clearInterval('"+setInterval(animation,1)+"')",1500);
    },0);
  }

  var once = true;
  window.addEventListener('devicemotion', function(event) {
    if (throwFlag) {
      var gv = event.accelerationIncludingGravity;
      if ( gv.x > 30 && once) {
        once = false;
        s.emit('throw', {x: gv.x, y: gv.y});
        throwEgg();
        $('canvas').animate({ 'margin-top': '-999px'});
      }
    }
  });

  // function throwEgg(){
  //   if (throwFlag) {
  //     $('#canvas').
  //   }
  // }

  function crossCheck(oldPos, newPos) {
    for (var i = 0; i < lineLocus.length; i++) {
      if (lineLocus[i+1]) {
        var p1 = lineLocus[i];
        var p2 = oldPos;
        var p3 = lineLocus[i+1];
        var p4 = newPos;
        var s1 =  (((p4.x - p2.x) * (p1.y - p2.y)) - ((p4.y - p2.y) * (p1.x - p2.x))) / 2;
        var s2 = (((p4.x - p2.x) * (p2.y - p3.y)) - ((p4.y - p2.y) * (p2.x - p3.x))) / 2;
        var c = {};
        c.x = p1.x + (((p3.x - p1.x) * s1) / (s1 + s2));
        c.y = p1.y + (((p3.y - p1.y) * s1) / (s1 + s2));

        if ((c.x >= p1.x && c.x < p3.x) || (c.x >= p3.x && c.x < p1.x)){
          if ((c.y >= p1.y && c.y < p3.y) || (c.y >= p3.y && c.y < p1.y)) {
            if ((c.x >= p2.x && c.x < p4.x) || (c.x >= p4.x && c.x < p2.x)) {
              if ((c.y >= p2.y && c.y < p4.y) || (c.y >= p4.y && c.y < p2.y)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  function getCircleData(callback){
    var minX = lineLocus[0].x;
    var maxX = lineLocus[0].x;
    var minY = lineLocus[0].y;
    var maxY = lineLocus[0].y;

    for (var i = 0; i < lineLocus.length; i++) {
      if (minX > lineLocus[i].x) {
        minX = lineLocus[i].x;
      }
      if (minY > lineLocus[i].y) {
        minY = lineLocus[i].y;
      }
      if (maxX < lineLocus[i].x) {
        maxX = lineLocus[i].x;
      }
      if (maxY < lineLocus[i].y) {
        maxY = lineLocus[i].y;
      }
    }

    var top = { x: (maxX - minX) / 2 + minX, y: minY };
    var height = maxY - minY;
    return callback(null, top, height);
  }


  /**
   * draw egg
   */
  function drawEgg(startPoint, height) {
    var x;
    var y;
    var a;
    var b;

    var i;
    var imax;
    var j;
    var m;

    var xmax;
    var dx;

    var xx = [];
    var yy = [];

    a = height;
    // b = 2.8;
    // b = 0.7 * a;
    b = 0.7 * a;

    xmax = a; // x の最大値
    dx = xmax / 350; // x のプロット間隔

    i=0;

    for (x = 0; x <= xmax; x = x + dx) {
      i++;

      xx[i] = x;
      y = Math.sqrt(((a - b - 2 * x) + Math.sqrt(4 * b * x + (a - b) * (a - b))) * x / 2);
      yy[i] = y;

      // console.log("i = "+i+", x = "+x+", y = "+ y);
    }

    imax = i;
    j = 0;

    for (i = imax + 1; i <= 2 * imax; i++) {
      j++;
      m = imax - j;

      xx[i] = xx[m];
      yy[i] = -yy[m];
    }

    c.rotate(90 * Math.PI / 180);
    for (i = 1; i <= 2 * imax; i++) {
      c.beginPath();
      c.moveTo(xx[i]+startPoint.x, yy[i]+startPoint.y);
      c.lineTo(xx[i+1]+startPoint.x, yy[i+1]+startPoint.y);
      c.stroke();
      c.closePath();

      // console.log(i, xx[i], yy[i]);
    }

  }





  // タップ位置を取得する為の関数群
  function scrollX(){return document.documentElement.scrollLeft || document.body.scrollLeft;}
  function scrollY(){return document.documentElement.scrollTop || document.body.scrollTop;}

  function getPosT (event) {
    var mouseX = event.touches[0].clientX - $(canvas).position().left + scrollX();
    var mouseY = event.touches[0].clientY - $(canvas).position().top + scrollY();
    return {x:mouseX, y:mouseY};
  }

  // 削除ボタンの動作
  $("delete_button").click(function () {
    c.clearRect(0, 0, $(canvas).width(), $(canvas).height());
  });

}, false);
