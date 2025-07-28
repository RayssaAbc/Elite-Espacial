class Particle {
    constructor(position, velocity, radius, color){
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.alpha = 1; 
    }
    draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

update() {
    this.velocity.x *= 0.98;
    this.velocity.y *= 0.98;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.alpha -= 0.02;

}

}
export default Particle;
