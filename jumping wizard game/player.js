export default class Player {

    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    wizPics = [];

    jumpPressed = false;
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED = 0.6;
    GRAVITY = 0.4;

    constructor(context, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
        this.context = context;
        this.canvas = context.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 10 * scaleRatio;
        this.y = this.canvas.height - this.height - (1.5 * scaleRatio);
        this.yStandingPosition = this.y;

        this.standingStillImage = new Image();
        this.standingStillImage.src = "images/wizard_still.PNG";
        this.image = this.standingStillImage;

        const wizImg1 = new Image();
        wizImg1.src = "images/wizard_run_1.png";

        const wizImg2 = new Image();
        wizImg2.src = "images/wizard_run_2.png";

        this.wizPics.push(wizImg1);
        this.wizPics.push(wizImg2);

        // keyboard event listeners
        window.removeEventListener("keydown", this.keydown)
        window.removeEventListener("keyup", this.keyup)

        window.addEventListener("keydown", this.keydown)
        window.addEventListener("keyup", this.keyup)

        // touch events
        window.removeEventListener("touchstart", this.touchstart);
        window.removeEventListener("touchend", this.touchend);

        window.addEventListener("touchstart", this.touchstart);
        window.addEventListener("touchend", this.touchend);
    }

    touchstart = ()=>{
        this.jumpPressed = true;
    }

    touchend = ()=>{
        this.jumpPressed = false;
    }

    keydown = (event)=>{
        if (event.code === "Space"){
            this.jumpPressed = true;
        }
    }

    keyup = (event)=>{
        if (event.code === "Space"){
            this.jumpPressed = false;
        }
    }

    update(gameSpeed, frameTimeDelta) {
        this.run(gameSpeed, frameTimeDelta);
        if (this.jumpInProgress){
            this.image = this.standingStillImage;
        }
        this.jump(frameTimeDelta);
    }

    jump(frameTimeDelta) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;
        }

        if (this.jumpInProgress && !this.falling ) {
            if (this.y > this.canvas.height - this.minJumpHeight || this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed) {
                this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
            } else {
                this.falling = true;
            }
        } else {
            if (this.y < this.yStandingPosition) {
                this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPosition;
                }
            } else {
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }

    run(gameSpeed, frameTimeDelta) {
        if (this.walkAnimationTimer <= 0) {
            if (this.image === this.wizPics[0]) {
                this.image = this.wizPics[1];
            } else {
                this.image = this.wizPics[0];
            }
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }
        this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
    }

    draw() {
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}