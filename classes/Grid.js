import Invader from "./invader.js";

class Grid {
    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;

        this.direction = "right";
        this.moveBelow = false;

        this.invadersVelocity = 1;
        this.invaders = this.init();

    }

init(){
        const array = [];

       for(let row = 0; row < this.rows; row += 1){  


        for(let col = 0; col < this.cols; col += 1){
            const invader = new Invader({
                x: col * 50 + 25,
                y: row * 30
           

            },
        this.invadersVelocity
    );
    array.push(invader);
        }
         }
         return array
    }
    draw(ctx){
        this.invaders.forEach((invader) => invader.draw(ctx))
    }

   update() {
    if (this.reachedRightEdge()) {
        this.direction = "left";
        this.moveBelow = true; 
    } else if (this.reachedLeftEdge()) {
        this.direction = "right";
        this.moveBelow = true;
    }

    this.invaders.forEach((invader) => {
        if (this.moveBelow) {
            invader.moveBelow();
            invader.incrementVelocity(0.3);
            this.invadersVelocity = invader.velocity;
        }

        if (this.direction === "right") invader.moveRight();
        if (this.direction === "left") invader.moveLeft();
    });

    this.moveBelow = false;
}

reachedRightEdge() {
    return this.invaders.some((invader) => 
        invader.position.x + invader.width >= window.innerWidth
    );
}

reachedLeftEdge() {
    return this.invaders.some((invader) => 
        invader.position.x <= 0
    );
}

getRandomInvader(){
    const random = Math.floor(Math.random() * this.invaders.length);
    return this.invaders[random];

}

restart() {
    this.invadersVelocity = 1;
    this.direction = "right";
    this.moveBelow = false;
    this.invaders = this.init();
}
}
export default Grid;