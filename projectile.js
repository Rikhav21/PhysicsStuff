//I defined a lot of the variables that I use later.
const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");
let x = 0;
let y = 2; 
let vx = 0;
let vy = 0;
let cameraX = 0;
let cameraY = 0;
let targetCameraX = 0;
let running = false;
let hasScale = true;
let currentStretch = 0;
let currentAngle = 0;
let rad = 10;

//These are the constants, just so that I don't have to rewrite the same thing a ton
const Spacing = 50;
const rulerX = 100;
const Limit = canvas.width - 70;

//This is checking for button presses and also setting values to all of the sliders.
document.addEventListener("DOMContentLoaded", ()=>{

    //This defines all of the buttons and sliders
    let startBtn = document.getElementById("Start");
    let scaleBtn = document.getElementById("Scale");
    let massSlider = document.getElementById("massSlider");
    let elasticSlider = document.getElementById("elasticSlider");
    let stretchedSlider = document.getElementById("stretchedSlider");
    let angleSlider = document.getElementById("angleSlider");

    //This checks weather the start button was pressed, and if it was, it flips the state and also initializes some of the physics stuff
    if(startBtn){
        startBtn.addEventListener("click", ()=> {
            running = !running;
            startBtn.style.backgroundColor = running? "#1d5a1f": "#4adb4c"; 
            const mass = parseFloat(massSlider.value);
            const k = parseFloat(elasticSlider.value);
            const stretch = parseFloat(stretchedSlider.value);
            const angle = parseFloat(angleSlider.value) * Math.PI / 180; 
            const v = Math.sqrt(k*stretch*stretch/mass);
            vx = Math.sin(angle)*v;
            vy = Math.cos(angle)*v;
            document.getElementById("massValue").textContent = mass.toFixed(2);
            document.getElementById("elasticValue").textContent = k.toFixed(2);
            document.getElementById("stretchedValue").textContent = stretch.toFixed(2);
            document.getElementById("angleValue").textContent = (angle * 180 / Math.PI).toFixed(2); 
            rad = mass;

        })
    }
    if(scaleBtn){
        scaleBtn.addEventListener("click", () =>{
            hasScale = !hasScale;
            scaleBtn.style.backgroundColor = hasScale ? "#1d5a1f": "#4adb4c";
        })
    }
    stretchedSlider.addEventListener('input', updateFromSliders);
    angleSlider.addEventListener('input', updateFromSliders);
    massSlider.addEventListener('input',updateFromSliders);
    updateFromSliders(); 
    requestAnimationFrame(loop);
});


//This updates the table with the nwe values, most are already set through
function updateTable(){
    const v = Math.sqrt(vx*vx+vy*vy);
    document.getElementById("positionXValue").textContent = x.toFixed(2);
    document.getElementById("positionYValue").textContent = y.toFixed(2);
    document.getElementById("velocityValue").textContent = v.toFixed(2);
}

//This basically just changes where the ball is in the slingshot, before it actually starts moving
function updateFromSliders() {
    if (!running) {
        const stretch = parseFloat(document.getElementById("stretchedSlider").value);
        const angle = parseFloat(document.getElementById("angleSlider").value) * Math.PI / 180;
        const mass = parseFloat(document.getElementById("massSlider").value);
        x = -(stretch*Math.sin(angle));
        y = 2-(stretch*Math.cos(angle));
        document.getElementById("stretchedValue").textContent = stretch.toFixed(2);
        document.getElementById("angleValue").textContent = (angle * 180 / Math.PI).toFixed(2);
        rad = mass;
    }
}

//This is the drawing function, Bassically makes the scene with javascript
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //This draws the ground
    ctx.fillStyle = "#5e3d00";
    ctx.fillRect(0,500,canvas.width,canvas.height-500);
    ctx.lineWidth = 8;//This draws the slingshot as long as it is in frame
    if (cameraX <= 0) {
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(rulerX,400);
        ctx.lineTo(rulerX,500);
        ctx.stroke();
    }
    updateTable();
    const v = vx*vx+vy*vy;
    if(v>3){//This draws the air around the moving ball
        ctx.lineWidth = rad;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(x * Spacing + rulerX - cameraX * Spacing, 500 - y * Spacing);
        ctx.lineTo(x * Spacing + rulerX - cameraX * Spacing-vx, 500 - y * Spacing-(vx));
        ctx.stroke();
    }
    if(!running && y > 1){//This draws the elastic if it is in the right pace
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rulerX, 400);
        ctx.lineTo(x * Spacing + rulerX - cameraX * Spacing, 500 - y * Spacing);
        ctx.stroke();
    }
    if(hasScale)//Draws the scale if the button is pressed
        drawScale();

    ctx.fillStyle = "blue";//This draws the blue ball
    ctx.beginPath();
    ctx.arc(x * Spacing + rulerX - cameraX * Spacing, 500 - y * Spacing, rad, 0, 2 * Math.PI);
    ctx.fill();
    

}

//This makes the scale on the ground if the button is pressed
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


//This basically 
function updatePhysics(dt){
    const g = 9.81
    vy -= g*dt;
    x+= vx*dt;
    y+=vy*dt;
    let blockScreenX = rulerX+(x-cameraX)*Spacing;
    if(blockScreenX>Limit)
        cameraX = x- (Limit-rulerX)/Spacing;
    if(running && blockScreenX<rulerX)
        cameraX = x;
    if(y<=0){
        y = 0;
        vy = 0;
        vx = 0;
        running = false;
        targetCameraX = x - (100 - rulerX) / Spacing;
    }
}
let lastTime = 0;

//This is basically all the actions that it is going to take after every loop
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