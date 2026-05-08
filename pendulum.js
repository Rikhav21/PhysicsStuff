//Declaring all of the variables that will be used through all of the functions
const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");
let x =0;
let y = 0;
let vx = 0;
let vy = 0;
let running = false;
let currentAngle = 0;
let theta = 0;
let omega = 0;
let rad = 10;

//Just some stuff so I don't have to remember exact numbers
const startingX = 400;
const startingY = 100;
const scale = 250;

//This is basically checking for any inputs
document.addEventListener("DOMContentLoaded", ()=>{

    //These are all of the buttons and sliders
    let startBtn = document.getElementById("Start");
    let massSlider = document.getElementById("massSlider");//I know that mass doen't really change anything :)
    let angleSlider = document.getElementById("angleSlider");
    let gravitySlider = document.getElementById("gravitySlider");
    let lengthSlider = document.getElementById("lengthSlider");

    //If the start button is pressed initialize everything
    if(startBtn){
        startBtn.addEventListener("click", ()=>{
            running = !running;
            startBtn.style.backgroundColor = running? "#1d5a1f": "#4adb4c";
            const mass =parseFloat(massSlider.value);
            const angle = parseFloat(angleSlider.value);
            const gravity = parseFloat(gravitySlider.value);
            const length = parseFloat(lengthSlider.value);
            rad = mass*2;
            theta = angle * Math.PI / 180;
            omega = 0;
            document.getElementById("massValue").textContent = mass.toFixed(2);
            document.getElementById("gravityValue").textContent = gravity.toFixed(2);
            document.getElementById("angleValue").textContent = angle.toFixed(2);
            document.getElementById("lengthValue").textContent = length.toFixed(2);
        });
    }

    massSlider.addEventListener('input',updateFromSliders);
    angleSlider.addEventListener('input', updateFromSliders);
    lengthSlider.addEventListener('input', updateFromSliders);
    updateFromSliders();
    requestAnimationFrame(loop);
});

function updateFromSliders(){
    if(!running){
        const length = parseFloat(document.getElementById("lengthSlider").value);
        const angle = parseFloat(document.getElementById("angleSlider").value)*Math.PI/180;
        const mass =  parseFloat(document.getElementById("massSlider").value);
        theta = angle;
        x = startingX + length * Math.sin(theta) * scale;
        y = startingY + length * Math.cos(theta) * scale;
        rad = 2*mass;
        document.getElementById("lengthValue").textContent = length.toFixed(2);
        document.getElementById("massValue").textContent = mass.toFixed(2);
        document.getElementById("angleValue").textContent = (angle*180/Math.PI).toFixed(2);
    }
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = rad;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x-(vx/6),y-(vy/6));
    ctx.stroke();
    ctx.strokeStyle = "brown";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(startingX,0);
    ctx.lineTo(startingX,startingY);
    ctx.stroke();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startingX, startingY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2 * Math.PI);
    ctx.fill();
    updateTable();
}

function updateTable(){
    const length = parseFloat(document.getElementById("lengthSlider").value);
    const gravity = parseFloat(document.getElementById("gravitySlider").value);
    const velocity = length * Math.abs(omega);
    const period = 2 * Math.PI * Math.sqrt(length / gravity);
    document.getElementById("velocityValue").textContent = velocity.toFixed(2);
    document.getElementById("periodValue").textContent = period.toFixed(2);
}

function updatePhysics(dt){
    const g = parseFloat(document.getElementById("gravitySlider").value);
    const length = parseFloat(document.getElementById("lengthSlider").value);
    omega += - (g / length) * Math.sin(theta) * dt;
    theta += omega * dt;

    x = startingX + length * Math.sin(theta) * scale;
    y = startingY + length * Math.cos(theta) * scale;
    
    vx = length * Math.cos(theta) * omega * scale;
    vy = -length * Math.sin(theta) * omega * scale;
}

let lastTime=0;
function loop(timestamp){
    if(!lastTime) lastTime = timestamp;
    const dt = (timestamp -lastTime)/1000;
    lastTime = timestamp;
    if(running)
        updatePhysics(dt);
    draw();
    requestAnimationFrame(loop);    
}