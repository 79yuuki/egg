var socket = io.connect('http://bapa-egg.herokuapp.com');
//var socket = io.connect('http://localhost:3000/');
var s = socket.of('/socket');
// s.on('connect', function(msg) {
//   console.log('connected');
// });

var canvas = document.getElementById("main");
var c = canvas.getContext("2d");
var eggcanvas = document.getElementById("egg");
var eggc = eggcanvas.getContext("2d");
var w = 700;
var h = 500;

$("#canvas").css('margin', (window.innerHeight / 2 - 320) + 'px 0px 0px -350px');

var oldDrawMe = {
	geza1: function(){
		var img = new Image();
		img.src = "../img/geza1.png";
		img.onload = function(){
			c.drawImage(img, w/2-70, h/2-230, 140/1.3, 450/1.3);
		};
	},
	geza2: function(){
		var img = new Image();
		img.src = "../img/geza2.png";
		img.onload = function(){
			c.drawImage(img, w/2-65, h/2-150, 131/1.3, 320/1.3);
		};
	},
	geza3: function(){
		var img = new Image();
		img.src = "../img/geza3.png";
		img.onload = function(){
			c.drawImage(img, w/2-64, h/2-80, 129/1.3, 270/1.3);
		};
	},
	geza4: function(){
		var img = new Image();
		img.src = "../img/geza4.png";
		img.onload = function(){
			c.drawImage(img, w/2-60, h/2-77, 119/1.3, 270/1.3);
		};
	},
	geza5: function(){
		var img = new Image();
		img.src = "../img/geza5.png";
		img.onload = function(){
			c.drawImage(img, w/2-100, h/2-30, 201/1.3, 230/1.3);
		};
	},
	geza6: function(){
		var img = new Image();
		img.src = "../img/geza6.png";
		img.onload = function(){
			c.drawImage(img, w/2-130, h/2+20, 260/1.3, 190/1.3);
		};
	}
};

var drawMe = function(num){
  var img = new Image();
  img.src = "../img/geza"+num+".png";
  img.onload = function(){
    c.drawImage(img, w/2 - 120, h/2- 200, 240, 327);
  };
};

(function(){
  function loadImages(eggPosiImg, eggNegaImg, arcImg, clashEggImg, callback){
    eggPosiImg.onload = function(){
  // console.log(eggPosiImg);
      clashEggImg.onload = function(){console.log(clashEggImg);};
      eggNegaImg.onload = function(){
        // console.log(eggNegaImg);
        // console.log(arcImg);
        return callback(eggPosiImg, eggNegaImg, arcImg, clashEggImg);
      };
    };
  }
})();

  function createEggImage(positive){
    var img = new Image();
    if (positive) {
      img.src = "../img/posiEgg.png";
    } else {
      img.src = "../img/negaEgg.png";
    }
    return img;
  }


  function createClashEggImage(positive){
    var img = new Image();
    img.src = "../img/clashEgg.png";

    return img;
  }


  function createArcImage(){
    var canvas = document.createElement('canvas');
    canvas.width = 237;
    canvas.height = 237;

    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#AAA";
    ctx.lineWidth = 15;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(118, 119, 110, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.fillStyle = "#FFF";
    ctx.fill();

    var img = new Image();
    img.src = canvas.toDataURL('image/png');

    return img;
  }

  var eggPosiImg = createEggImage(true);
  var eggNegaImg = createEggImage(false);
  var arcImg = createArcImage();
  var clashEggImg = createClashEggImage();

//loadImages(eggPosiImg, eggNegaImg, arcImg, clashEggImg, function(){
  s.on('throw', function(egg){
    throwEgg(egg);
  });
//});

  canvas.width = w;
  canvas.height = h;
  eggcanvas.width = w;
  eggcanvas.height = h;

  drawMe(1);

  // debug
  var teggx = 20;
  setInterval(function(){throwEgg({x: teggx}); teggx += 5}, 3000);

  var images;

  var me = 1;
  function changeMe(){
    me++;
    if (me < 15) {
      c.clearRect(0, 0, w, h);
      drawMe(me);
    } else {
      drawYoroshiku();
    }
  }

  function drawYoroshiku(){
    c.font = "20px sans-serif";
    c.fillText('＼よろしくお願い致します！／', w/2-140, h/2 - 90);
  }

  function throwEgg(egg){
      images = [eggPosiImg, arcImg, eggNegaImg, arcImg];
      var i = 0;
      var tick = 0;
      var hitWidth;
      var hitHeight;
      var hitTick;
      eggc.globalAlpha = 1.0;
      var rad;
      var once = true;

console.log(egg);
      var animation = function(){
        if (i === images.length) {
          i = 0;
        }
        var time1;
        var time2;
        eggc.clearRect(0, 0, w, h);

        rad = tick * (Math.PI / 180) * 10;
        var gravity = (180 * Math.sin(rad));
        var eggHeight = h/1.6 - egg.x * 2;
        var eggWidth = w/3;
        if (0.9 - (tick * 0.05) > 0) {

          if (images[i] === arcImg) {
            eggc.drawImage(images[i], eggWidth + (6 * tick), eggHeight * 1.1 - gravity , images[i].width * (0.9 - (tick * 0.05)), images[i].height * (0.9 - (tick * 0.05)));
          } else {
            eggc.drawImage(images[i], eggWidth + (6 * tick), eggHeight - gravity, images[i].width * (0.9 - (tick * 0.05)), images[i].height * (0.9 - (tick * 0.05)));
          }
        } else if (0.9 - (tick * 0.05) === 0){
          hitHeight = eggHeight - (200 * Math.sin(rad));
          hitWidth = eggWidth + (6 * tick);
          hitTick = tick;
          eggc.globalAlpha = (hitTick / (tick - hitTick) * 1.2) - 0.5;
          eggc.drawImage(clashEggImg, hitWidth - clashEggImg.width* 0.2 / 2, eggHeight - gravity, clashEggImg.width * 0.2, clashEggImg.height * 0.2);
        } else {
          eggc.globalAlpha = (hitTick / (tick - hitTick) * 1.2) - 0.5;
          eggc.drawImage(clashEggImg, hitWidth - clashEggImg.width* 0.2 / 2, hitHeight + (tick - hitTick), clashEggImg.width * 0.2, clashEggImg.height * 0.2);
           if ((hitTick / (tick - hitTick) * 1.2) - 0.5 < 0 && once) {
             clearTimeout(time2);
             clearTimeout(time1);
             changeMe();
             once = false;
           }
        }
        i++;
        tick++;
      };
      time1 = setTimeout(function(){
        time2 = setTimeout("clearInterval('"+setInterval(animation,40)+"')",3000);
      },0);
  }





