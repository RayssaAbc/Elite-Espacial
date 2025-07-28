class Projectile{
    constructor(position, velocity, color = "gold") {
        this.position = position;
        this.color = color;
        this.width = 2
        this.height = 20;
        this.velocity = velocity;
    }

    draw(ctx){
        ctx.fillStyle = this.color; 
        ctx.fillRect(this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        );    
    }
    update(){
    this.position.y += this.velocity;
}

}

export default Projectile;
