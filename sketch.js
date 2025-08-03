let time;
let frameCountBuffer = 0;
let fps = 0;

const CANVAS_W = 960;
const CANVAS_H = 1280;

const BUTTON_W = CANVAS_W/4;
const BUTTON_H = BUTTON_W/2;
const BUTTON_Y = CANVAS_H*2/3;
const BUTTON_M = 24;

const GRID_SIZE = 64;
const GRID_W = 64;
const GRID_BASE_X = GRID_SIZE*2;
const GRID_BASE_Y = GRID_SIZE*4;
const PLAYER_H = GRID_SIZE;
const PLAYER_W = GRID_SIZE;
const PLAYER_MAX_X = GRID_SIZE*12;
const PLAYER_MIN_X = GRID_SIZE*2;
const PLAYER_MAX_Y = GRID_SIZE*12;
const PLAYER_MIN_Y = GRID_SIZE*2;
const PLAYER_X = CANVAS_W/2;
const PLAYER_Y = PLAYER_MAX_Y;
const PLAYER_SPEED = 1;
const BALL_SIZE = GRID_SIZE/12;
const BALL_NUM = 300;
const BALL_MIN_X = GRID_SIZE*2;
const BALL_MIN_Y = GRID_SIZE*2;
const BALL_MAX_X = GRID_SIZE*12;
const BALL_MAX_Y = GRID_SIZE*11;
const BALL_SPEED_AT = 0.9;
const JOYSTICK_Y = PLAYER_Y;
const HOLE_SIZE = GRID_SIZE/2;
const VACUUM_RANGE = HOLE_SIZE*2;
const VACUUM_P = 0.01;
const ARM_LENGTH = PLAYER_W*1;

let gui;
let startButton;
let startFlag = false;
let startTime;
let endTime = 0;
let player;
let balls;
let joystick;
let ballCount = 0;
let getCount;

let timeCount;
const TEXT_VIEW_SIZE = 32;

const DEBUG = true;
const DEBUG_VIEW_X = 40;
const DEBUG_VIEW_Y = 20;
const DEBUG_VIEW_H = 20;

function preload() {
}

function startFn() {
	startFlag = true;
	startTime = millis();
	startButton.visible = false;
	getCount = 0;
	ballCount = 0;
	ballInit();
	playerInit();
}
function playerInit() {
	player = {};
	player.pos = {};
	player.pos.x = PLAYER_X;
	player.pos.y = PLAYER_Y;
	player.angle = -PI/2;
}
function ballInit() {
	balls = [];
	for (let i=0; i<BALL_NUM; i++){
		let ball;
		ball = {};
		ball.pos = {};
		ball.pos.x = random(BALL_MIN_X, BALL_MAX_X);
		ball.pos.y = random(BALL_MIN_Y, BALL_MAX_Y);
		ball.speed = {};
		ball.speed.x = 0;
		ball.speed.y = 0;
	//	ball.enable = false;
		balls.push(ball);
	}
}
function setup() {
	createCanvas(CANVAS_W, CANVAS_H);
	time = millis();
//	ballInit();
	playerInit();
	rectMode(CENTER);

	gui = createGui();
	gui.loadStyle("Seafoam");
	gui.setTextSize(48);
	startButton = buttonInit('START', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y-BUTTON_H*1.5);
	joystick = createJoystick("joystick", GRID_SIZE, JOYSTICK_Y, GRID_SIZE*13, GRID_SIZE*1.5);
	joystick.setStyle({
		handleRadius: GRID_SIZE
	});
	textAlign(CENTER,CENTER);
}
function buttonInit(text, w, h, x, y) {
	let button = createButton(text, x, y, w, h);
	return button;
}
function draw() {
	background(48);
	let current = millis();
	if ( (current-time)>=1000 ){
		time += 1000;
		fps = frameCount - frameCountBuffer;
		frameCountBuffer = frameCount;
	}
	if (startButton.isPressed) startFn();
	if (DEBUG){
		stroke(128);
		strokeWeight(1);
		for (let i=0; i<CANVAS_H/GRID_SIZE; i++){
			line(0, i*GRID_SIZE, CANVAS_W, i*GRID_SIZE);
		}
		for (let i=0; i<CANVAS_W/GRID_SIZE; i++){
			line(i*GRID_SIZE, 0, i*GRID_SIZE, CANVAS_H);
		}
	}
	if (startFlag){
		player.angle += joystick.valX/10;
		player.pos.x += cos(player.angle)*PLAYER_SPEED;
		player.pos.y += sin(player.angle)*PLAYER_SPEED;
		if ((player.pos.x>PLAYER_MAX_X) || (player.pos.x<PLAYER_MIN_X)){
			player.angle = PI-player.angle;
		}
		if ((player.pos.y>PLAYER_MAX_Y) || (player.pos.y<PLAYER_MIN_Y)){
			player.angle = -player.angle;
		}
		fill(255);
		strokeWeight(3);
		stroke(255);
		circle(player.pos.x, player.pos.y, PLAYER_W);
		const holeX = player.pos.x + cos(player.angle)*ARM_LENGTH;
		const holeY = player.pos.y + sin(player.angle)*ARM_LENGTH;
		noFill();
		circle(holeX, holeY, HOLE_SIZE);
		let tBalls = [];
		fill(255);
		noStroke();
		for (let i=0; i<balls.length; i++){
			balls[i].pos.x += balls[i].speed.x;
			balls[i].pos.y += balls[i].speed.y;
			balls[i].speed.x *= BALL_SPEED_AT;
			balls[i].speed.y *= BALL_SPEED_AT;
			const d = dist(balls[i].pos.x, balls[i].pos.y, holeX, holeY);
			if (d<=(HOLE_SIZE+BALL_SIZE)/2){

			}else{
				if (d<=VACUUM_RANGE){
					const sp = (VACUUM_RANGE-d)*VACUUM_P;
					balls[i].speed.x += sp*(holeX-balls[i].pos.x)/d;
					balls[i].speed.y += sp*(holeY-balls[i].pos.y)/d;
				}
				circle(balls[i].pos.x, balls[i].pos.y, BALL_SIZE);
				tBalls.push(balls[i]);
			}
		}
		balls = tBalls;
		if (balls.length==0){
			startFlag = false;
			startButton.visible = true;
			endTime = (millis() - startTime)/1000;
		}
	}else{
		strokeWeight(1);
		stroke(255);
		fill(255);
		textSize(64);
		textAlign(CENTER);
		text(endTime.toFixed(1)+' sec', CANVAS_W/2, GRID_SIZE*3);
	}
	drawGui();
	fill(255);
	stroke(255);
	textSize(16);
	strokeWeight(1);
	let debugY = DEBUG_VIEW_Y;
	text('fps:'+fps, DEBUG_VIEW_X, debugY);
	debugY += DEBUG_VIEW_H;
}
