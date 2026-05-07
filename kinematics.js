
const canvas = document.getElementById("simCanvas");
const ctx= canvas.getContext("2d");
let x = 0;
let v = 0;
let a = 0;
let cameraX = 0;


const Spacing = 50;
const rulerX = 50;
const Limit = canvas.width - 70;


const massSlider = document.getElementById("massSlider");
const forceSlider = document.getElementById("forceSlider");
const frictionSlider = document.getElementById("frictionSlider");
function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "#5e3d00";
    ctx.fillRect(0,500,canvas.width,canvas.height-500);
    drawRuler();
    let blockScreenX = 50 + (x - cameraX) * Spacing;
    ctx.fillStyle = "blue";
    ctx.fillRect(blockScreenX, 475, 50, 30);

    if(v>3){
        ctx.fillStyle="white";
        ctx.fillRect(blockScreenX-10,490,(-v*2),5);
        ctx.fillRect(blockScreenX-15,475,-(v)*2,5);
    }
    updateTable();
}

function drawRuler(){
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if(cameraX>0)
        ctx.moveTo(0,520);
    else
        ctx.moveTo(rulerX, 520);
    ctx.lineTo(canvas.width, 520);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    for(let i = 0; i < 15; i++){
        const screenX = rulerX + i * Spacing;
        const worldValue = cameraX + i;
        ctx.beginPath();
        ctx.moveTo(screenX, 520);
        ctx.lineTo(screenX, 520 + 10);
        ctx.stroke();
        ctx.fillText(worldValue.toFixed(1), screenX, 545);
    }
}
function updateTable(){
    const mass = parseFloat(massSlider.value);
    const force = parseFloat(forceSlider.value);
    const mu = parseFloat(frictionSlider.value) / 100;
    const g = 9.81;
    
    document.getElementById("massValue").textContent = mass.toFixed(2);
    document.getElementById("forceValue").textContent = force.toFixed(2);
    document.getElementById("frictionValue").textContent = mu.toFixed(2);
    document.getElementById("positionValue").textContent = x.toFixed(2);
    document.getElementById("velocityValue").textContent = v.toFixed(2);
    document.getElementById("accelerationValue").textContent = a.toFixed(2);
}
let running = false;

document.addEventListener("DOMContentLoaded", ()=>{
    const startBtn = document.getElementById("Start");
    if(startBtn) {
        startBtn.addEventListener("click", ()=>{
            running = !running;
            console.log("Simulation " + (running ? "started" : "stopped"));
        });
    }
});

function updatePhysics(dt){
    const mass = parseFloat(massSlider.value);
    const force = parseFloat(forceSlider.value);
    const mu = parseFloat(frictionSlider.value) / 100;
    const g = 9.81;
    const friction = mu * mass * g;
    let netForce = force - friction;
    a = netForce / mass;
    v += a * dt;
    if(v<=0){
        a=0;
        v=0;
        forceNet = 0;
    }
    x += v * dt;
    
    let blockScreenX = rulerX + (x - cameraX) * Spacing;
    if(blockScreenX > Limit) {
        cameraX = x - (Limit - rulerX) / Spacing;
    }
    blockScreenX = rulerX + (x - cameraX) * Spacing;
    if(blockScreenX < rulerX) {
        cameraX = x;
    }
    if(v === 0){
        if(blockScreenX > rulerX){
            cameraX += 1;
        }
    }
    if(cameraX < 0) cameraX = 0;
}
let lastTime = 0;
function loop(timestamp){
    if(!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime)/1000;
    lastTime = timestamp;

    if(running) {
        updatePhysics(dt);
    }
    draw();

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);