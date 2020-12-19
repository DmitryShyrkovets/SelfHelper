let usePen = true;
let draw = false;

let thicknessValue = $('#size').attr('value');
let color = $('#pen-color').attr('value');
let bgColor = '#e7e5f5';

let mouse = { x: 0, y: 0 };

let penBtn = document.querySelector('.board-pen');
let eraserBtn = document.querySelector('.board-eraser');
let canvas =  document.getElementById("myCanvas"),
    context = canvas.getContext("2d");

canvas.width = document.documentElement.clientWidth * 0.6;
canvas.height = document.documentElement.clientHeight * 0.8;

canvas.addEventListener("mousedown", function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    draw = true;
    context.beginPath();
    context.moveTo(mouse.x, mouse.y);
});
canvas.addEventListener("mousemove", function (e) {

    if (draw == true) {

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        context.lineTo(mouse.x, mouse.y);
        if(usePen){
            context.strokeStyle = color;
        }
        else {
            context.strokeStyle = bgColor;
        }
        context.lineWidth = thicknessValue;
        context.stroke();
    }
});
canvas.addEventListener("mouseup", function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
    context.closePath();
    draw = false;
});

$('.board-pen').click(function(){
    usePen = true;
    penBtn.style.backgroundColor = '#ccc1fd';
    eraserBtn.style.backgroundColor = '#d6e5e3';
});

$('.board-eraser').click(function(){
    usePen = false;
    penBtn.style.backgroundColor = '#d6e5e3';
    eraserBtn.style.backgroundColor = '#ccc1fd';
});

$('#pen-color').change(function(event){
    color = event.target.value;
});

$('#size').change(function(event){
    thicknessValue = event.target.value;
});

$('.clear').click(function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
});