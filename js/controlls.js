const Controlls = function(){
    this.left = new Controlls.ButtonInput();
    this.right = new Controlls.ButtonInput();
    this.up = new Controlls.ButtonInput();
    this.down = new Controlls.ButtonInput();

    this.keyDownUp = (event) => { 
        let down = (event.type == "keydown");

        switch(event.key){
            case "ArrowUp": this.up.getInput(down); break;
            case "ArrowDown": this.down.getInput(down); break;
            case "ArrowLeft": this.left.getInput(down); break;
            case "ArrowRight": this.right.getInput(down);
        }
    }
}


Controlls.prototype = {

    constructor : Controlls
  
};

Controlls.ButtonInput = function(){
    this.pressed = false;
    this.active = false;
}

Controlls.ButtonInput.prototype = {
    constructor: Controlls.ButtonInput,

    getInput: function(down){
        if(this.pressed != down) this.active = down;

        this.pressed = down;
    }
}