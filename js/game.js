const Game = function(){

    this.world = {
        friction: 0.8,

        player: new Game.Object.Player(85 / 2, 125 / 2),
        logs: [],
        fishes:[],

        score: 0,
        score_growth: 0,
        frame_value: 0,
        count: 0,
        delay: 10,
        
        width: 225,
        height: 150,

        water_width: 110,

        background_color: "yellow",

        status: undefined,

        update: function(){
            this.player.velocity_x *= this.friction;
            this.player.velocity_y *= this.friction;
            this.player.velocity_y += 0.04;
            this.score_growth += 1;
            this.score += this.score_growth;
            
            this.count ++;
            while (this.count > this.delay) {
                this.count -= this.delay;

                this.frame_value =
                this.frame_value < 9 ? this.frame_value + 1 : 0;
            }

            if(this.score % 80 == 0) this.logs.push(new Game.Object.Log(Math.random()*(this.water_width - 20), -20, 1));
            if(this.score_growth % 325 == 0) this.fishes.push(new Game.Object.Fish(Math.random()*(this.water_width - 20), -20, 1));

            this.player.updatePosition();
            this.player.updateAnimation();
            if(this.player.x + 3.5 < 0) this.player.x = -3.5;
            if(this.player.x > this.water_width - this.player.width + 3.5) this.player.x = this.water_width - this.player.width + 3.5;
            if(this.player.y +3.5 < 0) this.player.y = -3.5;
            if(this.player.y > this.height - this.player.height + 20) this.player.health = 0;
        

            this.logs.forEach(log => {
                if(log.visible && this.player.overlap(log)){
                    log.visible = false;
                    this.player.velocity_y += 4;
                    this.player.health -= 1;
                }
                log.updatePosition();
            });
            if(this.logs.length > 0 && this.logs[0].y > this.height) this.logs.shift();
            if(this.logs.length > 5) this.logs.pop();

            this.fishes.forEach(fish => {
                if(fish.visible && this.player.overlap(fish)){
                    fish.visible = false;
                    if(this.player.health < 3) this.player.health += 0.5;
                }
                fish.updatePosition();
            });
            if(this.fishes.length > 0 && this.fishes[0].y > this.height) this.fishes.shift();
        }
    }

    this.update = function(){
        this.world.update();
        if(this.world.player.health <= 0) {
            this.world.status = "lost";
            return false;
        }
        else return true;
        //console.log(this.world.player.x);
    }
}

Game.prototype = {
    constructor: Game
}

Game.Object = function(x, y, width, height) {

    this.height = height;
    this.width  = width;
    this.x      = x;
    this.y      = y;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.visible = true;

   };
   
   Game.Object.prototype = {
   
     constructor:Game.Object,
   
   
   };
   
   Game.Object.Animator = function(frame_set, delay) {
   
     this.count       = 0;
     this.delay       = (delay >= 1) ? delay : 1;
     this.frame_set   = frame_set;
     this.frame_index = 0;
     this.frame_value = frame_set[0];
     this.mode        = "pause";
   
   };
   
   Game.Object.Animator.prototype = {
   
     constructor:Game.Object.Animator,
   
     changeFrameSet(frame_set, frame_index = 0) {
   
       if (this.frame_set === frame_set) { return; }
   
       this.count       = 0;
       this.delay       = 10;
       this.frame_set   = frame_set;
       this.frame_index = frame_index;
       this.frame_value = frame_set[frame_index];
   
     },
   
     animate:function() {
   
       this.count ++;
   
       while(this.count > this.delay) {
         this.count -= this.delay;
   
         this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;
       
         this.frame_value = this.frame_set[this.frame_index];
   
       }
   
     }
   
   };

Game.Object.Player = function(x, y){
    this.color = "#ff0000";
    this.height = 25;
    this.width = 24;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.idle = true;
    this.x = x;
    this.y = y;
    this.direction_y = 0;
    this.direction_x = 0;
    this.health = 3;
    Game.Object.Animator.call(this, Game.Object.Player.prototype.frame_sets["up"], 10);
}

Game.Object.Player.prototype = {
    constructor: Game.Player,

    frame_sets: {
        "left-top" : [0, 1, 2, 3],
        "left" : [4, 5, 6, 7],
        "left-bottom" : [8, 9, 10, 11],
        "down": [12, 13, 14, 15],
        "right-bottom": [16, 17, 18, 19],
        "right": [20, 21, 22, 23],
        "right-top": [24, 25, 26, 27],
        "up": [28, 29, 30, 31]
      },

    moveLeft: function() {
        this.direction_x = -1;
        this.velocity_x -= 0.3;
    },
    moveRight: function() {
        this.direction_x = 1;
        this.velocity_x += 0.3;
    },
    moveUp: function() {
        this.direction_y = -1;
        this.velocity_y -= 0.3;
    },
    moveDown: function() {
        this.direction_y = 1;
        this.velocity_y += 0.3;
    },

    updatePosition: function(){
        this.x += this.velocity_x;
        
        this.y += this.velocity_y;
        
    },

    updateAnimation:function() {

        if(this.velocity_x > 0 && this.velocity_x < 0.2 ||
            this.velocity_x < 0 && this.velocity_x > -0.2){
                this.direction_x = 0;
            }
        if(this.velocity_y > 0 && this.velocity_y < 0.2 ||
            this.velocity_y < 0 && this.velocity_y > -0.2){
                this.direction_y = 0;
            }

        if (this.velocity_y < 0 && this.direction_y != 0) {
          if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["left-top"]);
          else if(this.direction_x > 0) this.changeFrameSet(this.frame_sets["right-top"]);

        }else if(this.velocity_y > 0 && this.direction_y != 0){
            if(this.direction_x < 0) this.changeFrameSet(this.frame_sets["left-bottom"]);
            else if(this.direction_x > 0) this.changeFrameSet(this.frame_sets["right-bottom"]);
        }

        if(this.direction_x == 0){
            if(this.direction_y <= 0)this.changeFrameSet(this.frame_sets["up"]);
            else this.changeFrameSet(this.frame_sets["down"]);
        }
        if(this.direction_y == 0){
            if(this.direction_x > 0) this.changeFrameSet(this.frame_sets["right"]);
            else if(this.direction_x < 0) this.changeFrameSet(this.frame_sets["left"]);
        }
        

        this.animate();
    
      },

      overlap: function(actor){
          return this.x + this.width - 5 > actor.x  &&
                 this.x < actor.x + actor.width - 5&&
                 this.y + this.height - 5> actor.y &&
                 this.y < actor.y + actor.height -5;
      }
}

Object.assign(Game.Object.Player.prototype, Game.Object.prototype);
Object.assign(Game.Object.Player.prototype, Game.Object.Animator.prototype);

Game.Object.Player.prototype.constructor = Game.Object.Player;

Game.Object.Log = function(x, y, velocity){
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.width = 18;
    this.height = 15;
    this.visible = true;
}

Game.Object.Log.prototype = {
    constructor: Game.Object.Log,

    updatePosition: function(){this.y += this.velocity}
}


Game.Object.Fish = function(x, y, velocity){
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.width = 12;
    this.height = 12;
    this.visible = true;
}

Game.Object.Fish.prototype = {
    constructor: Game.Object.Car,

    updatePosition: function(){this.y += this.velocity}
}