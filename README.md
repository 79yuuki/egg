# BaPA egg
http://bapa-egg.herokuapp.com

## controller (iPhone only)
http://bapa-egg.herokuapp.com/draw

# 本プロジェクトについて
本プロジェクトは BaPA の入試課題として作られたものです。

# やっていること

- サーバー： Node.js, heroku - websocketを利用してリアルタイムで卵を飛ばしています。
- クライアント： JavaScript, canvas, html5, sound再生 ( https://github.com/CyberAgent/boombox.js )

Node.jsをheroku上で動かして、websocketのやりとり等をさせています。
クライアント側は基本的にcanvas上に描画しており、JavaScriptを駆使して線の描画、交差判定、卵形曲線描画、加速度センサー利用、websocket通信連携、PC画面の描画を行っています。
