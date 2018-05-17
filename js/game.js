// 获取背景音乐
let bgm = document.querySelector(".bgm");
let gameover_bgm = document.querySelector(".gameover_bgm");
let up_bgm = document.querySelector(".up_bgm");
// 音乐默认关闭
bgm.pause();
gameover_bgm.pause();
up_bgm.pause();

// 获取元素
let canvas = document.querySelector(".canvas"); // 获取最外层div
let conduit_group = canvas.querySelector(".conduit_group");
let thisScore = canvas.querySelector(".thisScore"); // 获取本次分数div
// 获取历史最高分数div,历史最高分用localstorage存储
let historyScore = canvas.querySelector(".historyScore");
let scroing = canvas.querySelector("#scroing"); // 获取积分div
let bird = canvas.querySelector('#flybird');
// 创建定时器
let conduitTimer = null; // 管道的定时器
let downTimer = null; // 下降定时器
let upTimer = null; // 上升定时器
let crashTimer = null; // 碰撞检测计时器
let moveTimer = null; // 管子移动定时器

let isGameOver = true; // 游戏结束标志
let score = 0; // 临时存储每次游戏的分数
let speed = 0; // 下降速度
let speedMax = 8; // 最大下降速度

// 清除所有定时器
function clearTimer(){
	let timer = setInterval(function(){}, 30)
	for(let i = 0; i < timer; i++){
		clearInterval(i);
	}
}

// 鸟下降的函数,当速度达到一定值时，速度保持不变
function birdDown(){
	speed += 1;
	bird.id = "flybird_down";
	up_bgm.pause();
	if(speed >= speedMax){
		speed = speedMax;
	}
	bird.style.top = bird.offsetTop + speed + "px";
	borderCheck();
}

// 鸟上升
function birdUp(){
	speed -= 0.8;
	bird.id = 'flybird_up';
	up_bgm.play();
	if(speed <= 0){
		speed = 0;
		clearInterval(upTimer);
		downTimer = setInterval(birdDown, 30);
	}
	bird.style.top = bird.offsetTop - speed + "px";
	borderCheck();
}
// 鸟跳动
function birdJump(){
	speed = speedMax;
	if(isGameOver){
		// 每次向上跳时，先将向上，向下定时器清除，防止叠加
		clearInterval(upTimer); // 清除向上的定时器
		clearInterval(downTimer); // 清除向下的定时器
		upTimer = setInterval(birdUp, 30);
	}
}
// 检测鸟是否落地或者跳出上边界
function borderCheck(){
	let t = bird.offsetTop;
	if(t > 396){
		gameover();
	}
	if(t < 0){
		gameover();
	}
}
// 随机函数 用来产生随机高度
function rand(min, max){
	return parseInt(Math.random()*(max - min + 1) + min);
}
// 创建管道。在点击开始按钮后，通过计时器来创造
function create_pipe(){
	let maxWidth = canvas.offsetWidth;
	let topHeight = rand(60, 233);
	let bottomHeight = 423 - topHeight - 100;

	let topConduit = document.createElement("div");
	topConduit.className = "top_conduit";
	topConduit.style.left = maxWidth + "px";
	topConduit.leftData = 105;
	topConduit.innerHTML = `<div style="height:${topHeight+'px'}"></div>`;
	conduit_group.appendChild(topConduit);

	let bottom_Conduit = document.createElement("div");
	bottom_Conduit.className = "bottom_conduit";
	bottom_Conduit.style.left = maxWidth + "px";
	bottom_Conduit.style.top = topHeight + 100 + "px";
	bottom_Conduit.innerHTML = `<div style="height:${bottomHeight+'px'}"></div>`;
	conduit_group.appendChild(bottom_Conduit);
}
// 碰撞检测
function crashTest(obj1, obj2){
	// 小鸟相关量
	let l1 = obj1.offsetLeft;
	let r1 = l1 + obj1.offsetWidth;
	let t1 = obj1.offsetTop;
	let b1 = t1 + obj1.offsetHeight;
	// 管道相关量
	let l2 = obj2.offsetLeft;
	let r2 = l2 + obj2.offsetWidth;
	let t2 = obj2.offsetTop;
	let b2 = t2 + obj2.offsetHeight;
	if(r1 > l2 && r2 > l1 && b1 > t2 && b2 > t1){
		return true;
	}else{
		return false;
	}
}
// 判断鸟是否撞上柱子
function judge(){
	let topConduits = conduit_group.querySelectorAll(".top_conduit");
	let bottomConduits = conduit_group.querySelectorAll(".bottom_conduit");
	let maxWidth = canvas.offsetWidth;
	// 遍历管道
	for (let i = 0; i < topConduits.length; i++) {
		if(crashTest(bird, topConduits[i]) || crashTest(bird, bottomConduits[i])){
			gameover();
		}else{
			score += 1;
		}
		if(topConduits[i].offsetLeft <= -70){
			conduit_group.removeChild(topConduits[i]);
			conduit_group.removeChild(bottomConduits[i]);
			continue;
		}
		topConduits[i].style.left = bottomConduits[i].style.left = topConduits[i].leftData - 1 + "%";
		topConduits[i].leftData -= 1;
	}
}
// 游戏结束
function gameover(){
	isGameOver = false;
	bgm.pause();
	gameover_bgm.play();
	clearTimer();
	// 换回小鸟原来的样式
	bird.id = 'flybird';
	bird.className = 'birddown';
	bird.style.top = '392px';
	// 从本地存储中获取最高纪录
	let highScore = localStorage.getItem('maxScore');
	// 当历史记录不存在或者历史记录小于当前分数时，创建maxScore
	if(highScore == null || highScore < score){
		localStorage.setItem('maxScore', score);
	}
	// 当前分数
	thisScore.innerHTML = score;
	// 历史最高分数
	historyScore.innerHTML = score;
	// 显示游戏结束
	document.querySelector('.gameover').style.display = 'block';
}
// 游戏初始化
function init(){
	let game_start = canvas.querySelector('.game_start');
	let start_btn = game_start.querySelector('.start_btn');
	start_btn.onclick = () => {
		game_start.style.display = 'none';
		bird.style.display = 'block';
		bird.style.top = '200px';
		bgm.play();
		conduitTimer = setInterval(create_pipe, 2000);
		crashTimer = setInterval(judge, 30);
		document.addEventListener('click', birdJump, false);
	}
}
function restart(){
	bird.className = 'bird';
	clearTimer();
	scroing.innerHTML = null;
	isGameOver = true;
	speed = 0;
	score = 0;
	speedMax = 8;
	document.querySelector('.gameover').style.display = 'none';
	game_start.style.display = 'block';
	bird.style.display = 'none';
	conduit_group.innerHTML = '';
}
init();
let game_restart = document.querySelector('.game_restart');
game_restart.onclick = restart;