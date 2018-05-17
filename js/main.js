"use strict";
(function(){
	// 获取div
	const gameCanvas = document.querySelector("#game-canvas");
	const gameStartBtn = gameCanvas.querySelector("#game-start-btn"); // 开始按钮
	const gameSubmitBtn = gameCanvas.querySelector("#game-submit-btn"); // 游戏结束按钮
	const bird = document.querySelector("#bird"); // 鸟
	const conduitGroup = document.querySelector("#conduit-group"); // 管道组
	const thisScore = document.querySelector("#this-score"); // 当前分数
	const historyScore = document.querySelector("#history-score"); // 历史分数
	const gameRestartBtn = document.querySelector("#game-restart"); // 重新开始
	const gameScore = document.querySelector("#game-scroe"); // 游戏分数
	const bgm = document.querySelector("#bgm"); // 背景音乐
	const gameoverBgm = document.querySelector("#gameover-bgm"); // 游戏结束的背景音乐
	const birdUpBgm = document.querySelector("#up-bgm"); // 游戏结束的背景音乐

	// 创建定时器
	let conduitCreateTimer = null; // 管道创建的定时器
	let conduitMoveTimer = null; // 管道移动的定时器
	let birdDownTimer = null; // 下降定时器
	let birdUpTimer = null;

	let isGameOver = false; // 游戏结束标志,为true表示游戏未结束,false表示游戏未结束
	let score = 0; // 游戏的分数
	let speed = 0; // 下降速度
	let speedMax = 8; // 下降最大速度

	let maxWidth = gameCanvas.offsetWidth; // 游戏界面的宽度
	// 游戏初始化时，先让所有音乐进入暂停状态
	bgm.play();
	gameoverBgm.pause();
	birdUpBgm.pause();

	// 边界检测,检测鸟是否落地或者跳出上边界
	function borderCheck(){
		let t = bird.offsetTop;
		if(t > 396){
			gameover();
		}
		if(t < 0){
			gameover();
		}
	}
	// 鸟下降，当鸟的速度达到8时，匀速下降
	function birdDown() {
		speed += 1;
		bird.id = "bird-down";
		birdUpBgm.pause();
		if(speed >= speedMax){
			speed = speedMax;
		}
		bird.style.top = bird.offsetTop + speed + "px";
		borderCheck();
	}
	// 鸟上升
	function birdUp(){
		speed -= 0.8;
		bird.id = 'bird-up';
		birdUpBgm.play();
		if(speed <= 0){
			speed = 0;
			clearInterval(birdUpTimer);
			birdDownTimer = setInterval(birdDown, 30);
		}
		bird.style.top = bird.offsetTop - speed + "px";
		borderCheck();
	}
	// 鸟跳动
	function birdJump(){
		speed = speedMax;
		if(isGameOver === false){
			// 每次向上跳时，先将向上，向下定时器清除，防止叠加
			clearInterval(birdUpTimer); // 清除向上的定时器
			clearInterval(birdDownTimer); // 清除向下的定时器
			birdUpTimer = setInterval(birdUp, 30);
		}
	}
	// 随机函数 用来产生随机高度
	function rand(min, max){
		return parseInt(Math.random()*(max - min + 1) + min);
	}
	// 创建管道。在点击开始按钮后，通过计时器来创造
	function create_pipe(){
		let topHeight = rand(60, 233);
		let bottomHeight = 423 - topHeight - 100;

		let topConduit = document.createElement("div");
		topConduit.className = "top-conduit";
		topConduit.style.left = maxWidth + "px";
		topConduit.leftData = 100;
		//加分开关，每通过一个管道分数才能加1
		topConduit.AddScore = true;
		topConduit.innerHTML = `<div style="height:${topHeight+'px'}"></div>`;
		conduitGroup.appendChild(topConduit);

		let bottomConduit = document.createElement("div");
		bottomConduit.className = "bottom-conduit";
		bottomConduit.style.left = maxWidth + "px";
		bottomConduit.style.top = topHeight + 100 + "px";
		bottomConduit.innerHTML = `<div style="height:${bottomHeight+'px'}"></div>`;
		conduitGroup.appendChild(bottomConduit);
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
		let topConduits = conduitGroup.querySelectorAll(".top-conduit");
		let bottomConduits = conduitGroup.querySelectorAll(".bottom-conduit");
		// 遍历管道
		for (let i = 0; i < topConduits.length; i++) {
			// 鸟已经撞上了
			if(crashTest(bird, topConduits[i]) || crashTest(bird, bottomConduits[i])){
				gameover();
			}
			// 增加分数
			if(topConduits[i].offsetLeft + topConduits[i].offsetWidth <= 50 && topConduits[i].AddScore === true){
				score += 1;
				gameScore.innerHTML = score;
				topConduits[i].AddScore = false;
			}
			// 删除柱子
			if(topConduits[i].offsetLeft <= -70){
				conduitGroup.removeChild(topConduits[i]);
				conduitGroup.removeChild(bottomConduits[i]);
				continue;
			}
			topConduits[i].style.left = bottomConduits[i].style.left = topConduits[i].leftData - 1 + "%";
			topConduits[i].leftData -= 1;
		}
	}
	// 游戏结束
	function gameover(){
		speed = 0;
		speedMax = 8;
		isGameOver = true;
		gameoverBgm.play();
		clearInterval(conduitCreateTimer);
		clearInterval(conduitMoveTimer);
		clearInterval(birdUpTimer);
		clearInterval(birdDownTimer);
		// 换回小鸟原来的样式
		bird.id = 'bird';
		bird.style.top = '392px';
		// 当前分数
		thisScore.innerHTML = score;
		// 从本地存储中获取最高分数
		let highScore = localStorage.getItem('maxScore');
		// 当历史记录不存在或者历史记录小于当前分数时，创建maxScore
		if(highScore == null || highScore < score){
			historyScore.innerHTML = score;
			localStorage.setItem('maxScore', score);
		}else{
			historyScore.innerHTML = highScore;
		}
		// 显示游戏结束
		document.querySelector(".game-over").style.display = "block";
	}
	// 游戏初始化
	function init(){
		document.querySelector(".game-start").style.display = 'none';
		isGameOver = false;
		bird.style.display = 'block';
		bird.style.top = '100px';
		gameScore.innerHTML = 0;
		bgm.play();
		conduitCreateTimer = setInterval(create_pipe, 2000);
		conduitMoveTimer = setInterval(judge, 30);
		document.addEventListener('click', birdJump, false);
	}

	function restart(){
		gameoverBgm.pause();
		score = 0;
		document.querySelector('.game-over').style.display = 'none';
		document.querySelector(".game-start").style.display = 'block';
		bird.style.top = '200px';
		bird.style.display = 'none';
		bird.id = bird;
		conduitGroup.innerHTML = '';
	}
	// 开始游戏
	gameStartBtn.onclick = init;
	// 重新开始游戏
	gameRestartBtn.onclick = restart;
})();