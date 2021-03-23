const Engine = function(render){
    this.frame_length = 30 / 1000; // 10 frames per second, one frame equals 0.1 s
    this.animation_frame_request = undefined;

    this.render = render; // render function

    this.run = (update) => { 
        let last_time = null;
        let frame = (time_stamp) => {
            if(last_time != null){
                let time_step = Math.min(this.frame_length, (time_stamp - last_time) / 1000);
                
                let status = update(time_step);
                this.render();
                if(status === false) return; // exit game
            }
            last_time = time_stamp;
            window.requestAnimationFrame(frame);
        }
        window.requestAnimationFrame(frame);
    }
}

Engine.prototype = {
    constructor: Engine,

    stop: function() {window.cancelAnimationFrame(this.animation_frame_request)}
}