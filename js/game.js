// 获取背景音乐
let bgm = document.querySelector(".bgm");
let gameover_bgm = document.querySelector(".gameover_bgm");
let up_bgm = document.querySelector(".up_bgm");
// 音乐默认关闭
bgm.pause();
gameover_bgm.pause();
up_bgm.pause();

let canvas = document.querySelector(".canvas"); // 获取最外层div
let thisScore = document.querySelector(".thisScore"); // 获取本次分数div
// 获取历史最高分数div,历史最高分用localstorage存储
let historyScore = document.querySelector(".historyScore");
let scroing = document.querySelector("#scroing"); // 获取分数div
let bird =document.querySelector('#bird');

// 创建定时器
let conduitTimer = null; // 管道的定时器
let downTimer = null; // 下降定时器
let upTimer = null; // 上升定时器
let crashTextTimer = null; // 碰撞检测计时器

let isGameOver = false; // 游戏结束标志
let score = 0; // 临时存储每次游戏的分数
let speed = 0; // 下降速度
let speedMax = 8; // 最大下降速度

// 鸟下降的函数,当速度达到一定值时，速度保持不变
function birdDown(){
	speed += 1;
	bird.id = "flybird_down";
	up_bgm.pause();
	if(speed >= speedMax){
		speed = speedMax;
	}
	bird.style.top = bird.offsetTop + speed + "px";
}

// 鸟上升
function birdUp(){
	speed -= 0.8;
	bird.id = 'flybird_up';
	up_bgm.play();
	if(speed <= 0){
		speed = 0;
		clearInterval(upTimer);
		downTimer = setInterval(down, 30);
	}
	bird.style.top = bird.offsetTop - speed + "px";
}
// 鸟跳动
function birdJump(){
	speed = speedMax;
	if(!isGameOver){
		// 每次向上跳时，先将向上，向下定时器清除，防止叠加
		clearInterval(upTimer); // 清除向上的定时器
		clearInterval(downTimer); // 清除向下的定时器
		upTimer = setInterval(up, 30);
	}
}
// 检测鸟是否落地或者跳出上边界
function borderCheck(){
	let t = bird.offsetTop;
	if(t > 396){// 396
		// gameover();
	}
	if(t < 0){
		// gameover();
	}
}

