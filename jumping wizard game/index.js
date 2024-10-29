import Player from "./player.js"
import Ground from "./ground.js"
import monstersController from "./monsterRoar.js"
import Score from "./score.js"

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

const GAME_SPEED_START = 1;
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const PLAYER_WIDTH = 82;
const PLAYER_HEIGHT = 100;
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 200;
const GROUND_WIDTH = 2500;
const GROUND_HEIGHT = 24;
const GROUND_AND_MONSTER_SPEED = 0.5;

const MONSTERS_CONFIG = [
    {width:36, height:93, image:'images/monster_1.png'},
    {width:87, height:61, image:'images/monster_2.png'},
    {width:61, height:102, image:'images/monster_3.png'},
];

// game objects
let player = null;
let ground = null;
let monsterController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenerForRestart = false;
let waitingToStart = true;

function createSprites() {
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

    player = new Player(context, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio);

    ground = new Ground(context, groundWidthInGame, groundHeightInGame, GROUND_AND_MONSTER_SPEED, scaleRatio);

    const monstersImages = MONSTERS_CONFIG.map(monster => {
        const image = new Image();
        image.src = monster.image;
        return {
            image:image,
            width: monster.width * scaleRatio,
            height: monster.height * scaleRatio,
        };
    });

    monsterController = new monstersController(context, monstersImages, scaleRatio, GROUND_AND_MONSTER_SPEED);

    score = new Score(context, scaleRatio);

}

function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();
}

setScreen();

window.addEventListener("resize", () => setTimeout(setScreen, 500));

if (screen.orientation) {
    screen.orientation.addEventListener("change", setScreen);
}

function getScaleRatio() {
    const screenHeight = Math.min(
        window.innerHeight, document.documentElement.clientHeight
    );

    const screenWidth = Math.min(
        window.innerWidth, document.documentElement.clientWidth
    );

    // window is wider than game width
    if (screenWidth/screenHeight < GAME_WIDTH/GAME_HEIGHT) {
        return screenWidth/GAME_WIDTH;
    } else {
        return screenHeight/GAME_HEIGHT;
    }
}

function clearScreen(){
    context.fillStyle = "white";
    context.fillRect(0,0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
    if (previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;
    clearScreen();
    
    if (!gameOver && !waitingToStart) {
        // update game objects
    ground.update(gameSpeed, frameTimeDelta);
    monsterController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
    }
    
    if (!gameOver && monsterController.collideWith(player)) {
        gameOver = true;
        setupGameReset();
        score.setHighScore();
    }

    // draw game objects
    ground.draw();
    monsterController.draw();
    player.draw();
    score.draw();

    if (gameOver) {
        showGameOver();
    }

    if (waitingToStart) {
        showStartGameText();
    }

    requestAnimationFrame(gameLoop);
}

function showGameOver() {
    const fontSize = 70 * scaleRatio;
    context.font = `${fontSize}px Verdana`;
    context.fillStyle = "#321650";
    const x = canvas.width / 4.5;
    const y = canvas.height / 2;
    context.fillText("GAME OVER", x, y);
}

function setupGameReset() {
    if (!hasAddedEventListenerForRestart) {
        hasAddedEventListenerForRestart = true;

        setTimeout(()=>{
            window.addEventListener("keyup", reset,{once: true})
            window.addEventListener("touchstart", reset,{once: true})
        }, 1000);    
    }
}

function reset() {
    hasAddedEventListenerForRestart = false;
    gameOver = false;
    waitingToStart = false;
    ground.reset();
    monsterController.reset();
    gameSpeed = GAME_SPEED_START;
    score.reset();
}

function showStartGameText() {
    const fontSize = 40 * scaleRatio;
    context.font = `${fontSize}px Verdana`;
    context.fillStyle = "#321650";
    const x = canvas.width / 14;
    const y = canvas.height / 2;
    context.fillText("Tap Screen or Press Space to Start", x, y);
}

function updateGameSpeed(frameTimeDelta) {
    gameSpeed += frameTimeDelta  * GAME_SPEED_INCREMENT;
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset,{once: true})
window.addEventListener("touchstart", reset,{once: true})