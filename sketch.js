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
const PLAYER_W = GRID_SIZE*2;
const PLAYER_X = CANVAS_W/2;
const PLAYER_Y = GRID_SIZE*15;
const PLAYER_SPEED = 1;
const BALL_SIZE = GRID_SIZE/2;
const BALL_NUM = 100;
const BALL_MIN_X = GRID_SIZE*2;
const BALL_MIN_Y = GRID_SIZE*2;
const BALL_MAX_X = GRID_SIZE*12;
const BALL_MAX_Y = GRID_SIZE*11;
const BALL_SPEED_AT = 0.9;
const JOYSTICK_Y = PLAYER_Y;
const VACUUM_RANGE = GRID_SIZE*2;

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
	player = {};
	player.pos = {};
	player.pos.x = PLAYER_X;
	player.pos.y = PLAYER_Y;
	player.angle = PI*3/2;
	ballInit();
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
function hitDetect(tx, ty, tw, th, bx, by) {
	if (bx<tx-tw/2 || bx>tx+tw/2){
		return false;
	}
	if (by<ty-th/2 || by>ty+tw/2){
		return false;
	}
	return true;
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
	let tBalls = [];
	for (let i=0; i<balls.length; i++){
		balls[i].pos.x += balls[i].speed.x;
		balls[i].pos.y += balls[i].speed.y;
		balls[i].speed.x *= BALL_SPEED_AT;
		balls[i].speed.y *= BALL_SPEED_AT;
		const d = dist(balls[i].pos.x, balls[i].pos.y, player.pos.x, player.pos.y);
		if (d<=(PLAYER_W+BALL_SIZE)/2){

		}else{
			if (d<=VACUUM_RANGE){
//				balls[i].speed.x = 
			}
			circle(balls[i].pos.x, balls[i].pos.y, BALL_SIZE);
			tBalls.push(balls[i]);
		}
	}
	balls = tBalls;
	player.angle += joystick.valX/10;
/*
	push();
	translate(player.pos.x, player.pos.y);
	rotate(player.angle);
	rect(0, 0, PLAYER_W, PLAYER_H);
	pop();
*/
	player.pos.x += cos(player.angle)*PLAYER_SPEED;
	player.pos.y += sin(player.angle)*PLAYER_SPEED;
	noFill();
	strokeWeight(3);
	stroke(255);
	circle(player.pos.x, player.pos.y, PLAYER_W);
	strokeWeight(1);
	stroke(255);
	fill(255);
	textSize(64);
	if (startFlag==false){
		textAlign(CENTER);
		text(getCount, CANVAS_W/2, GRID_SIZE*2);
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
