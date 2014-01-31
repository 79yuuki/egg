var socket = io.connect('http://bapa-egg.herokuapp.com');
//var socket = io.connect('http://localhost:3000/');
var s = socket.of('/socket');
s.on('connect', function(msg) {
  console.log('connected');
});

var canvas = document.getElementById("main");
var c = canvas.getContext("2d");
var eggcanvas = document.getElementById("egg");
var eggc = eggcanvas.getContext("2d");
var w = window.innerWidth;
var h = window.innerHeight;

var drawMe = {
	geza1: function(){
		var img = new Image();
		img.src = "../img/geza1.png";
		img.onload = function(){
			c.drawImage(img, w/2-70, h/2-280, 140, 450);
		};
	},
	geza2: function(){
		var img = new Image();
		img.src = "../img/geza2.png";
		img.onload = function(){
			c.drawImage(img, w/2-65, h/2-150, 131, 320);
		};
	},
	geza3: function(){
		var img = new Image();
		img.src = "../img/geza3.png";
		img.onload = function(){
			c.drawImage(img, w/2-64, h/2-80, 129, 270);
		};
	},
	geza4: function(){
		var img = new Image();
		img.src = "../img/geza4.png";
		img.onload = function(){
			c.drawImage(img, w/2-60, h/2-77, 119, 270);
		};
	},
	geza5: function(){
		var img = new Image();
		img.src = "../img/geza5.png";
		img.onload = function(){
			c.drawImage(img, w/2-100, h/2-30, 201, 230);
		};
	},
	geza6: function(){
		var img = new Image();
		img.src = "../img/geza6.png";
		img.onload = function(){
			c.drawImage(img, w/2-130, h/2+20, 260, 190);
		};
	}
};

function loadImages(eggPosiImg, eggNegaImg, arcImg, clashEggImg, callback){
	eggPosiImg.onload = function(){
console.log('posi');
	  eggNegaImg.onload = function(){
console.log('nega');
	    clashEggImg.onload = function(){
console.log('clash');
	      return callback(eggPosiImg, eggNegaImg, arcImg, clashEggImg);
	    }
	  };
	};
}
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

loadImages(eggPosiImg, eggNegaImg, arcImg, clashEggImg, function(){
  s.on('throw', function(egg){
    throwEgg(egg);
  });
});


  canvas.width = w;
  canvas.height = h;
  eggcanvas.width = w;
  eggcanvas.height = h;

  // TODO set target. hit and change
  drawMe.geza1();
  // drawMe.geza2();
  // drawMe.geza3();
  // drawMe.geza4();
  // drawMe.geza5();
  // drawMe.geza6();

  var images;

  function throwEgg(egg){
    // loadImages(eggPosiImg, eggNegaImg, arcImg, clashEggImg, function(){
      images = [eggPosiImg, arcImg, eggNegaImg, arcImg];
      // var posiSize = eggPosiImg.width();
      var i = 0;
      var tick = 0;
      var hitWidth;
      var hitHeight;
      var hitTick;
      eggc.globalAlpha = 1.0;
      if (egg.x < 0) { egg.x * -1; }
      var rad;

console.log(egg);
      var animation = function(){
        if (i === images.length) {
          i = 0;
        }
        var time1;
        var time2;
        eggc.clearRect(0, 0, w, h);

        rad = tick * (Math.PI / 180) * 10 + egg.x;
        if (0.9 - (tick * 0.05) > 0) {

          if (images[i] === arcImg) {
            eggc.drawImage(images[i], w/2.5 + (6 * tick), h/2.5 * 1.1 - (200 * Math.sin(rad)), images[i].width * (0.9 - (tick * 0.05)), images[i].height * (0.9 - (tick * 0.05)));
          } else {
            eggc.drawImage(images[i], w/2.5 + (6 * tick), h/2.5 - (200 * Math.sin(rad)), images[i].width * (0.9 - (tick * 0.05)), images[i].height * (0.9 - (tick * 0.05)));

          }
        } else if (0.9 - (tick * 0.05) === 0){
          hitHeight = h/2.5 - (200 * Math.sin(rad));
          hitWidth = w/2.5 + (6 * tick);
          hitTick = tick;
          eggc.globalAlpha = (hitTick / (tick - hitTick) * 1.2) - 0.5;
          eggc.drawImage(clashEggImg, hitWidth - clashEggImg.width* 0.2 / 2, h/2.5 - (200 * Math.sin(rad)), clashEggImg.width * 0.2, clashEggImg.height * 0.2);
        } else {
          eggc.globalAlpha = (hitTick / (tick - hitTick) * 1.2) - 0.5;
          eggc.drawImage(clashEggImg, hitWidth - clashEggImg.width* 0.2 / 2, hitHeight + (tick - hitTick), clashEggImg.width * 0.2, clashEggImg.height * 0.2);
           if ((hitTick / (tick - hitTick) * 1.2) - 0.5 <= 0) {
             clearTimeout(time2);
             clearTimeout(time1);
           }
        }
        i++;
        tick++;
      };
      time1 = setTimeout(function(){
        time2 = setTimeout("clearInterval('"+setInterval(animation,40)+"')",3000);
      },0);
    // });
  }





