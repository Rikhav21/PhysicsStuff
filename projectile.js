const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");
let x = 0;
let y = 0;
let vx = 0;
let vy = 0;
let cameraX = 0;
let cameraY = 0;
let targetCameraX = 0;
let running = false;
let hasScale = true;

const Spacing = 50;
const rulerX = 100;
const Limit = canvas.width - 70;

document.addEventListener("DOMContentLoaded", ()=>{
    let startBtn = document.getElementById("Start");
    let scaleBtn = document.getElementById("Scale");
    let massSlider = document.getElementById("massSlider");
    let elasticSlider = document.getElementById("elasticSlider");
    let stretchedSlider = document.getElementById("stretchedSlider");
    let angleSlider = document.getElementById("angleSlider");

    if(startBtn){
        startBtn.addEventListener("click", ()=> {
            running = !running;
            startBtn.style.backgroundColor = running? "#1d5a1f": "#4adb4c"; 
            const mass = parseFloat(massSlider.value);
            const k = parseFloat(elasticSlider.value);
            const stretch = parseFloat(stretchedSlider.value);
            const angle = parseFloat(angleSlider.value) * Math.PI / 180; // Convert to radians
            const v = Math.sqrt(k*stretch*stretch/mass);
            vx = Math.cos(angle)*v;
            vy = Math.sin(angle)*v;
            document.getElementById("massValue").textContent = mass.toFixed(2);
            document.getElementById("elasticValue").textContent = k.toFixed(2);
            document.getElementById("stretchedValue").textContent = stretch.toFixed(2);
            document.getElementById("angleValue").textContent = (angle * 180 / Math.PI).toFixed(2); // Display in degrees

        })
    }

    if(scaleBtn){
        scaleBtn.addEventListener("click", () =>{
            hasScale = !hasScale;
            scaleBtn.style.backgroundColor = hasScale ? "#1d5a1f": "#4adb4c";
        })
    }
    requestAnimationFrame(loop);
    
});

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#5e3d00";
    ctx.fillRect(0,500,canvas.width,canvas.height-500);
    if(hasScale)
        drawScale();
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x * Spacing + rulerX - cameraX * Spacing, 500 - y * Spacing, 5, 0, 2 * Math.PI);
    ctx.fill();
    updateTable();
}

function drawScale(){
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if(cameraX > 0)
        ctx.moveTo(0,520);
    else
        ctx.moveTo(rulerX, 520);
    ctx.lineTo(canvas.width, 520);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    for(let i = 0; i<15; i++){
        const screenX = rulerX+i*Spacing;
        const worldValue =cameraX+i;
        ctx.beginPath();
        ctx.moveTo(screenX, 520);
        ctx.lineTo(screenX, 530);
        ctx.stroke();
        ctx.fillText(worldValue.toFixed(1), screenX, 545);
    }
}

function updateTable(){
    const v = Math.sqrt(vx*vx+vy*vy);
    document.getElementById("positionXValue").textContent = x.toFixed(2);
    document.getElementById("positionYValue").textContent = y.toFixed(2);
    document.getElementById("velocityValue").textContent = v.toFixed(2);
}

function updatePhysics(dt){
    const g = 9.81
    vy -= g*dt;
    x+= vx*dt;
    y+=vy*dt;
    let blockScreenX = rulerX+(x-cameraX)*Spacing;
    if(blockScreenX>Limit)
        cameraX = x- (Limit-rulerX)/Spacing;
    if(blockScreenX<rulerX)
        cameraX = x;
    if(y<=0){
        y = 0;
        vy = 0;
        vx = 0;
        running = false;
        targetCameraX = x; // Set target to center the ball at rulerX
    }
}
let lastTime = 0;
function loop(timestamp){
    if(!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime)/1000;
    lastTime = timestamp;
    if(running)
        updatePhysics(dt);
    
    const cameraSpeed = 2; 
    if(Math.abs(cameraX - targetCameraX) > 0.01) {
        cameraX += (targetCameraX - cameraX) * cameraSpeed * dt;
    }
    
    draw();
    requestAnimationFrame(loop);
}