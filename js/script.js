class Player{
    constructor(position, velosity){
        this.x = position.x;
        this.y = position.y;
        this.velosity = velosity;
    }
}

class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    plus = (vec) => {return new Vector(vec.x + this.x, vec.y + this.y)}
}

Player.prototype.update = function(){
    this.x += this.velosity.x;
    this.y += this.velosity.y;

    if(this.x < 0) this.x = 0;
    if(this.x > 100 - this.size.x) this.x = 100 - this.size.x;
    document.querySelector("#player").style.left = this.x + "%";
}

Player.prototype.size = new Vector(33, 20);

let player= new Player(new Vector(0, 0), new Vector(0,0));

window.addEventListener("keydown", event => {
    if(event.key == "ArrowLeft"){
        player.velosity = player.velosity.plus(new Vector(-2, 0));
        event.preventDefault();
    } else if(event.key == "ArrowRight") {
        player.velosity = player.velosity.plus(new Vector(2, 0));
        event.preventDefault();
    }
    player.update();
});

window.addEventListener("keyup", event => {
    
})
