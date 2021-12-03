var canvas 	= document.getElementById( 'game' ); 
var context = canvas.getContext( '2d' );


var i, survivor, Timer;
var zombie=[];
var fire=[];
var expl=[];
let counter = 0;
var username = "";

//загрузка ресурсов
zombieimg 	= new Image();
zombieimg.src = 'img/zombi1.png';

shieldimg 	= new Image();
shieldimg.src = 'img/shield.png';

fireimg 	= new Image();
fireimg.src = 'img/fire.png';

survivorimg 	= new Image();
survivorimg.src = 'img/survivor.png';

explimg 	= new Image();
explimg.src = 'img/expl222.png';

fon 	= new Image();
fon.src = 'img/fon.png';

username = prompt("Insert your name...");

document.getElementById('username').innerHTML = username;


//старт игры
fon.onload = function () {
	init();
	game();
}

//совместимость с браузерами
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame	||
        window.mozRequestAnimationFrame    ||
        window.requestAnimationFrame      ||
        window.requestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 20);
        };
})();




//начальные установки
function init() {
	canvas.addEventListener("mousemove",  function(event) {	

		var rect = canvas.getBoundingClientRect(), root = document.documentElement;

		var mouseX = event.clientX - rect.left - root.scrollLeft;
		var mouseY = event.clientY - rect.top - root.scrollTop;
					
		var width_canvas = document.getElementById("game").offsetWidth;
		var height_canvas = document.getElementById("game").offsetHeight;

		survivor.x=mouseX * 600/width_canvas-25;
		survivor.y=mouseY * 600/height_canvas-13;
});

	Timer=0;
	survivor={x:300,y:300,animx:0,animy:0};	
}

//основной игровой цикл
function game() {
	update();
	render();
	requestAnimFrame(game);
}

//функция обновления состояния игры
function update() {
	Timer++;

//спавн зомбаков
if (Timer%15==0) {
	zombie.push({
		x:Math.random()*500,
		y:-50,
		dx:0,
		dy:Math.random()*2+1
		});
}
//выстрел
if (Timer%10==0) {
	fire.push({x:survivor.x+10,y:survivor.y,dx:0.5,dy:-5});
}

//движение зомбаков
for (i in zombie) {
	zombie[i].x = zombie[i].x+zombie[i].dx;
	zombie[i].y = zombie[i].y+zombie[i].dy;
	
	
	//граничные условия
	if (zombie[i].x<=0 || zombie[i].x>=550) zombie[i].dx=-zombie[i].dx;
	if (zombie[i].y>=550) zombie.splice(i,1);

	
	//проверим каждого зомбака на столкновение с каждой пулей
	for (j in fire) {
		if (Math.abs(zombie[i].x+25-fire[j].x-15)<50 && Math.abs(zombie[i].y-fire[j].y)<25) {
			counter++;
			document.getElementById('score').innerHTML = counter;
			//стрельба
			expl.push({x:zombie[i].x-25,y:zombie[i].y-25,animx:0,animy:0});
			
			//помечаем зомби на удаление
			zombie[i].del=1;
			fire.splice(j,1);break;
		}
	}
	//удаление зомбаков с памяти
	if (zombie[i].del==1) zombie.splice(i,1);
}

//двигаем пули
for (i in fire) {
	fire[i].x=fire[i].x+fire[i].dx;
	fire[i].y=fire[i].y+fire[i].dy;
	
	if (fire[i].y<-30) fire.splice(i,1);
}

//Анимация взрывов
for (i in expl) {
	expl[i].animx=expl[i].animx+0.5;
	if (expl[i].animx>7) {expl[i].animy++; expl[i].animx=0}
	if (expl[i].animy>7) 
	expl.splice(i,1);
}

//анимация щита
survivor.animx=survivor.animx+1;
	if (survivor.animx>4) {survivor.animy++; survivor.animx=0}
	if (survivor.animy>3) {
		survivor.animx=0; survivor.animy=0;
	}
}

function render() {
	//очистка холста (не обязательно)
	context.clearRect(0, 0, 600, 600);
	
	//рисуем фон
	context.drawImage(fon, 0, 0, 600, 600);
	
	//рисуем пули
	for (i in fire) 
		context.drawImage(fireimg, fire[i].x, fire[i].y, 30, 30);
	
	//рисуем главного героя
	context.drawImage(survivorimg, survivor.x, survivor.y);
	
	//рисуем щит
	//context.drawImage(shieldimg, 192*Math.floor(survivor.animx),192*Math.floor(survivor.animy),192,192, survivor.x-25, survivor.y-25, 100, 100);
	
	
	//рисуем зомбаков
	for (i in zombie) {
		context.drawImage(zombieimg, zombie[i].x, zombie[i].y, 50, 50);
		context.save();
		context.translate(zombie[i].x+25, zombie[i].y+25);
		context.rotate(zombie[i].angle);
		context.drawImage(zombieimg, -25, -25, 50, 50);
		context.restore();
	}
	//рисуем взрывы
	for (i in expl)
		context.drawImage(explimg, 128*Math.floor(expl[i].animx),128*Math.floor(expl[i].animy),128,128, expl[i].x, expl[i].y, 100, 100);
	
}

