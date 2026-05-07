// Defining the variables and the canvas stuff, most of the things for the buttons go here
const canvas = document.getElementById("simCanvas");
const ctx= canvas.getContext("2d");
let x = 0;
let v = 0;
let a = 0;
let cameraX = 0;
let running = false;
let frictionEnabled = false;
let forceEnabled = false;
let impulseTimer = 0;
let hasScale = true;


// These are a few of the constants, just to adjust stuff like the spacing
const Spacing = 50;
const rulerX = 50;
const Limit = canvas.width - 70;


// Here is where I was listening to all of the buttons
document.addEventListener("DOMContentLoaded", ()=>{
    let forceBtn = document.getElementById('ConstantForce');
    let frictBtn = document.getElementById('frict');
    let scaleBtn = document.getElementById('Scale');
    let startBtn = document.getElementById('Start');
    let massSlider = document.getElementById("massSlider");
    let forceSlider = document.getElementById("forceSlider");
    let frictionSlider = document.getElementById("frictionSlider");

    if(startBtn) {
        startBtn.addEventListener("click", ()=>{
            running = !running;
            impulseTimer = 0;
            startBtn.style.backgroundColor = running? "#1d5a1f": "#4adb4c";
        });
    }

    if(forceBtn) {
        forceBtn.addEventListener('click', ()=>{
            forceEnabled = !forceEnabled;
            forceBtn.style.backgroundColor = forceEnabled ? "#1d5a1f":"#4adb4c";
        });
    }

    if(frictBtn) {
        frictBtn.addEventListener('click', ()=>{
            frictionEnabled = !frictionEnabled;
            frictBtn.style.backgroundColor = frictionEnabled ? "#1d5a1f":"#4adb4c";
        });
    }

    if(scaleBtn) {
        scaleBtn.addEventListener("click", ()=>{
            hasScale = !hasScale;
            scaleBtn.style.backgroundColor = hasScale ? "#1d5a1f":"#4adb4c";
        });
    }

    requestAnimationFrame(loop);
});

// draw function for the block and the.
function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "#5e3d00";
    ctx.fillRect(0,500,canvas.width,canvas.height-500);
    if(hasScale)
        drawScale();
    let blockScreenX = 50 + (x - cameraX) * Spacing;
    ctx.fillStyle = "blue";
    ctx.fillRect(blockScreenX, 475, 50, 30);

    //added some air current stuff if the block was going fast enough
    if(v>1){
        ctx.fillStyle="white";
        ctx.fillRect(blockScreenX-10,490,(-v*3),5);
        ctx.fillRect(blockScreenX-15,475,-(v)*3,5);
    }
    updateTable();
}

//Draws the scale if the button is pressed
function drawScale(){
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
        ctx.lineTo(screenX, 530);
        ctx.stroke();
        ctx.fillText(worldValue.toFixed(1), screenX, 545);
    }
}

//Here is where I change all of the values for the table over options
function updateTable(){

    const mass = parseFloat(massSlider.value);
    const forceValue = parseFloat(forceSlider.value);
    const mu = parseFloat(frictionSlider.value) / 100;
    
    document.getElementById("massValue").textContent = mass.toFixed(2);
    document.getElementById("forceValue").textContent = forceValue.toFixed(2);
    document.getElementById("frictionValue").textContent = mu.toFixed(2);
    document.getElementById("positionValue").textContent = x.toFixed(2);
    document.getElementById("velocityValue").textContent = v.toFixed(2);
    document.getElementById("accelerationValue").textContent = a.toFixed(2);
}

//This has all of the calculations,and I guess the only part I actually should have revised
function updatePhysics(dt){

    const mass = parseFloat(massSlider.value);
    const mu = parseFloat(frictionSlider.value) / 100;
    let forceValue = 0;

    if(forceEnabled){
        forceValue = parseFloat(forceSlider.value);
    } else {
        if(impulseTimer < 1.0){ // Apply force for 1 second( impulse :D )
            forceValue = parseFloat(forceSlider.value);
            impulseTimer += dt;
        } else {
            forceValue = 0;
        }
    }

    const g = 9.81;
    const friction = frictionEnabled ? (mu * mass * g) : 0;
    let netForce = forceValue - friction;
    a = netForce / mass;
    v += a * dt;
    if(v < 0){
        a = 0;
        v = 0;
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
            cameraX += .5;
        }
    }
    if(cameraX < 0) cameraX = 0;
}
let lastTime = 0;
//This is what I want to do every time , and this will keep looping
function loop(timestamp){
    if(!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime)/1000;
    lastTime = timestamp;
    if(running) 
        updatePhysics(dt);
    draw();
    requestAnimationFrame(loop);
}