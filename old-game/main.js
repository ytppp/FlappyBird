let birdObj = document.getElementById("bird");
let gameMain = document.querySelector("#game-main");
console.log(gameMain.offsetHeight)
let timer = null;
let bigTimer = null;
let lastTimer = null;
let birdSpeedY = 0;
var die = false;
// 产生随机整数
function random(min, max){
	return parseInt(Math.random()*(max - min + 1) + min)
}
// 碰撞检测
function setBoom(objA,objB){
	var objBl = objB.offsetLeft;
	var objBt = objB.offsetTop;
	var objBr = objBl+ objB.offsetWidth;
	var objBb = objBt+ objB.offsetHeight;

	var objAt = objA.offsetTop + objA.offsetHeight;
	var objAl = objA.offsetWidth + objA.offsetLeft;
	var objAr = objA.offsetLeft;
	var objAb = objA.offsetTop;

	if(objAt>objBt && objAl>objBl && objBr>objAr && objAb < objBb){
		return true
	}
	else{
		return false;
	}
}
// 增加柱子
function addZz() {
	let oDiv = document.createElement("div");
	oDiv.className = "topG";
	oDiv.leftData = 105;
	let oDiv2 = document.createElement("div");
	oDiv2.className = "bottomG";

	var h = random(30, 400);
	oDiv.style.height = h + "px";
	oDiv2.style.height = gameMain.offsetHeight - h- 150 +"px";
	oDiv2.style.top = h + 150 +"px";
	gameMain.appendChild(oDiv);
	gameMain.appendChild(oDiv2);
}
clearInterval(lastTimer);
lastTimer = setInterval(addZz, 1500);
clearInterval(bigTimer);
bigTimer = setInterval(() => {
	let oDivs = document.querySelectorAll(".topG");
	let oDiv2s = document.querySelectorAll(".bottomG");
	for(let i = 0; i < oDivs.length; i++){
		if(setBoom(bird, oDivs[i]) || setBoom(bird, oDiv2s[i])){
			die = true;
			clearInterval(bigTimer);
			clearInterval(lastTimer);
		}
		if(oDivs[i].leftData <= -20){
			gameMain.removeChild(oDivs[i]);
			gameMain.removeChild(oDiv2s[i]);
			continue;
		}
		oDivs[i].style.left = oDiv2s[i].style.left = oDivs[i].leftData - 1 + "%";
		oDivs[i].leftData = oDivs[i].leftData - 1;
	}
}, 30);
clearInterval(timer);
timer = setInterval(() => {
	birdSpeedY += 0.5;
	let t = birdObj.offsetTop + birdSpeedY;
	if(t < 0){
		die = true;
		t = 0;
		birdSpeedY = 0;
		clearInterval(bigTimer);
		clearInterval(timer);
	}
	if(t > gameMain.offsetHeight - birdObj.offsetHeight){
		die = true;
		birdSpeedY = 0;
		clearInterval(bigTimer);
		clearInterval(timer);
	}
	birdObj.style.top = t + "px";
}, 30)
window.onkeydown = event => {
	if(die){
		return;
	}
	birdSpeedY -= 20;
}