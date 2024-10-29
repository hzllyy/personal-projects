import Monster from "./monster.js";

export default class monstersController {
    MONSTER_INTERVAL_MIN = 500;
    MONSTER_INTERVAL_MAX = 2000;

    nextMonsterInterval = null;
    monsters = [];

    constructor(context, monstersImages, scaleRatio, speed) {
        this.context = context;
        this.canvas = context.canvas;
        this.monstersImages = monstersImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextMonsterTime;
    }

    setNextMonsterTime(){
        const num = this.getRandomNumber(this.MONSTER_INTERVAL_MIN, this.MONSTER_INTERVAL_MAX);

        this.nextMonsterInterval = num;
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createMonster() {
        const index = this.getRandomNumber(0,this.monstersImages.length - 1);
        const monsterImage = this.monstersImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.canvas.height - monsterImage.height;
        const monster = new Monster(this.context, x,y, monsterImage.width, monsterImage.height, monsterImage.image);

        this.monsters.push(monster);
    }

    update(gameSpeed, frameTimeDelta){
        if (this.nextMonsterInterval <= 0) {
            this.createMonster();
            this.setNextMonsterTime();
        }
        this.nextMonsterInterval -= frameTimeDelta;

        this.monsters.forEach((monster)=>{
            monster.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        });

        this.monsters = this.monsters.filter(monster => monster.x > -monster.width);
    }

    draw() {
        this.monsters.forEach((monster) => monster.draw());
    }

    collideWith(sprite) {
        return this.monsters.some(monster => monster.collideWith(sprite));
    }

    reset() {
        this.monsters = [];
    }
}