window.addEventListener('load', event => {
    "use strict";

    const ImageManager = function() {

        this.tile_set_image = undefined;
    
      };
    
      ImageManager.prototype = {
    
        constructor: Game.ImageManager,
    
        loadTileSetImage:function(url, callback) {
    
          this.tile_set_image = new Image();
    
          this.tile_set_image.addEventListener("load", function(event) {
    
            callback();
    
          }, { once : true});
    
          this.tile_set_image.src = url;
        }
    
      };

    let render = function(){
        display.fill(game.world.background_color);

        let margin = game.world.width / 2 - game.world.water_width / 2;
        let frame = {
          x: Math.floor(game.world.player.frame_value / 4) * 24,
          y: (game.world.player.frame_value % 4) * 25,
          width: 24,
          height: 25
        }
        
        let sandImg = new Image();
        sandImg.src = "img/sand.png";
        display.drawObject(sandImg, 0, 0, 0, 0, 225, 150);

        let riverImg = new Image();
        riverImg.src = "img/river.png"
        display.drawObject(riverImg,
           Math.floor(game.world.frame_value % 10) * 110, 0, margin, 0, 110, 180);

        //console.log(game.world.player.velocity_x);
        display.drawObject(image_manager.tile_set_image,
        frame.x, frame.y,
        game.world.player.x + margin, game.world.player.y, frame.width, frame.height);

        let health = game.world.player.health;
        let healthImg = new Image();
        healthImg.src = "img/health.png";
        for(let i = 0; i < 3; i++){
            if(health >= 1) display.drawObject(healthImg, 0, 0, i*19, 0, 19, 22);
            else if(health == 0.5) display.drawObject(healthImg, 19, 0, i*19, 0, 19, 22);
            else display.drawObject(healthImg, 38, 0, i*19, 0, 19, 22);
            health -= 1;
        }
        
        let logImg = new Image();
        logImg.src = "img/log.png";
        game.world.logs.forEach(log => {
          if(log.visible) display.drawObject(logImg,0,0,log.x + margin,log.y, 18, 15);
        });
        let fishImg = new Image();
        fishImg.src = "img/fish.png";
        game.world.fishes.forEach(fish => {
          if(fish.visible) display.drawObject(fishImg,0,0,fish.x + margin,fish.y, 12, 12);
        });

        display.render();
    }

    let resize = function(event) {
        display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
        display.render();
    };

    let image_manager = new ImageManager();
    let controlls = new Controlls();
    let display = new Display(document.querySelector('canvas'));
    let engine = new Engine(render);
    let game = new Game();

    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;
    display.buffer.imageSmoothingEnabled = false;

    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    window.addEventListener("keydown", controlls.keyDownUp);
    window.addEventListener("keyup", controlls.keyDownUp);

    image_manager.loadTileSetImage("img/swimmer.png", () => {

        resize();

        function start(){
          return new Promise(resolve => {
            engine.run(() => {
              if(controlls.left.active) {game.world.player.moveLeft();}
              if(controlls.right.active) { game.world.player.moveRight(); }
              if(controlls.up.active) {game.world.player.moveUp();}
              if(controlls.down.active) {game.world.player.moveDown();}

              let play = game.update();
              
              if(play == false){
                resolve(game.world.status);
                return false;
              }else{
                return true;
              }
            });
          })
        }
        //engine.run();

        async function runGame(){
          let stillPlaying = true;
          while(stillPlaying){
            game = new Game();
            let status = await start();
            if(status == "lost") console.log("Przegrales!");
            await new Promise(r => setTimeout(r, 2000));
          }
        }

        runGame();
    });
})