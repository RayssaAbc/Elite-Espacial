import { PATH_SPACESHIP_IMAGE, PATH_ENGINE_IMAGE, PATH_ENGINE_SPRITES, INITIAL_FRAMES } from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Player {
    constructor(canvasWidth, canvasHeight) {
        this.width = 48 * 3;
        this.height = 48 * 3;
        this.velocity = 8;
        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30,
        };

        this.image = this.getImage(PATH_SPACESHIP_IMAGE);
        this.engineImage = this.getImage(PATH_ENGINE_IMAGE);
        this.engineSprites = this.getImage(PATH_ENGINE_SPRITES);

        this.ps = 0;
        this.frameCount = 8;

        this.hitbox = {
            offsetX: 52,
            offsetY: 35,
            width: this.width - 104,
            height: this.height - 70
        };
    }

    pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
        const areaOrig = Math.abs((ax*(by-cy) + bx*(cy-ay) + cx*(ay-by)) / 2.0);
        const area1 = Math.abs((px*(by-cy) + bx*(cy-py) + cx*(py-by)) / 2.0);
        const area2 = Math.abs((ax*(py-cy) + px*(cy-ay) + cx*(ay-py)) / 2.0);
        const area3 = Math.abs((ax*(by-py) + bx*(py-ay) + px*(ay-by)) / 2.0);
        return (area1 + area2 + area3) <= areaOrig;
    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    moveLeft() {
        this.position.x -= this.velocity;
    }

    moveRight() {
        this.position.x += this.velocity;
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        ctx.drawImage(
            this.engineSprites,
            this.ps,
            0,
            48,
            44,
            this.position.x,
            this.position.y + 10,
            this.width,
            this.height
        );

        ctx.drawImage(
            this.engineImage,
            this.position.x,
            this.position.y + 15,
            this.width,
            this.height
        );

        this.update();
    }

    update() {
        if (this.frameCount === 0) {
            this.ps = this.ps === 96 ? 0 : this.ps + 48;
            this.frameCount = INITIAL_FRAMES;
        }
        this.frameCount--;
    }

    shoot(projectiles) {
        const p = new Projectile(
            {
                x: this.position.x + this.width / 2,
                y: this.position.y,
            },
            -12
        );
        projectiles.push(p);
    }

    hit(projectile) {
        const px = projectile.position.x + projectile.width / 2;
        const py = projectile.position.y + projectile.height / 2;

        const hb = {
            offsetX: 45,
            offsetY: 20,
            width: 36,
            height: 80
        };

        const bodyLeft = this.position.x + hb.offsetX;
        const bodyRight = bodyLeft + hb.width;
        const bodyTop = this.position.y + hb.offsetY;
        const bodyBottom = bodyTop + hb.height;

        const inBody =
            px > bodyLeft &&
            px < bodyRight &&
            py > bodyTop &&
            py < bodyBottom;

        const ax1 = this.position.x + 10;
        const ay1 = this.position.y + 40;
        const bx1 = this.position.x + 45;
        const by1 = this.position.y + 80;
        const cx1 = this.position.x + 45;
        const cy1 = this.position.y + 100;

        const inLeftWing = this.pointInTriangle(px, py, ax1, ay1, bx1, by1, cx1, cy1);

        const ax2 = this.position.x + this.width - 10;
        const ay2 = this.position.y + 40;
        const bx2 = this.position.x + this.width - 45;
        const by2 = this.position.y + 80;
        const cx2 = this.position.x + this.width - 45;
        const cy2 = this.position.y + 100;

        const inRightWing = this.pointInTriangle(px, py, ax2, ay2, bx2, by2, cx2, cy2);

        return inBody || inLeftWing || inRightWing;
    }
}

export default Player;
