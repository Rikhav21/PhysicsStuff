//This is where I am initialling all of the global variables, tu use throughout all of the functions
let starMassFactor = 1; // times 10^30 kg
let planetMassFactor = 1; // times 10^23 kg
let orbitRadiusAU = 2;
let orbitRadiusScreen = 120;
let theta = 0;
let omega = 0;
let running = false;
let starRadius = 20;
let planetRadius = 6;
let lastTime = 0;
let speedUp = 1000000;

//These are all of the constants that I will use for the physics calculations but also rendering 
const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const AU = 1.496e11;
const G = 6.674e-11;

//This generates the X and the Y positions for every star.
const starData = Array.from({length:50}, ()=>({
    x:Math.random()*800,
    y: Math.random()*600
}));


//This basically calculates how fast the planet is going around the star, but this is angular speed, so it is based on a proportion of a circle
function computeAngularSpeed(starMassFactor, radiusAU) {
    const starMass = starMassFactor * 1e30;
    const radius = radiusAU * AU;
    return Math.sqrt(G * starMass / (radius * radius * radius));
}


//This is calculating the velocity based off of the lienar version
function computeOrbitVelocity(starMassFactor, radiusAU) {
    const starMass = starMassFactor * 1e30;
    const radius = radiusAU * AU;
    return Math.sqrt(G * starMass / radius);
}

//This contains all of the 
document.addEventListener("DOMContentLoaded", ()=>{
    const startBtn = document.getElementById("Start");
    const massStarSlider = document.getElementById("massStarSlider");
    const massPlanetSlider = document.getElementById("massPlanetSlider");
    const radiusSlider = document.getElementById("radiusSlider");
    const speedSlider = document.getElementById("speedSlider");
    if(startBtn){
        startBtn.addEventListener("click", ()=>{
            running = !running;
            startBtn.style.backgroundColor = running ? "#1d5a1f" : "#4adb4c";
            if (running) {
                starMassFactor = parseFloat(massStarSlider.value);
                orbitRadiusAU = parseFloat(radiusSlider.value);
                omega = computeAngularSpeed(starMassFactor, orbitRadiusAU);
            }
             
            updateFromSliders();
        })
    }
    massStarSlider.addEventListener('input', updateFromSliders);
    massPlanetSlider.addEventListener('input', updateFromSliders);
    radiusSlider.addEventListener('input', updateFromSliders);
    speedSlider.addEventListener('input', updateFromSliders);


    updateFromSliders();
    requestAnimationFrame(loop);
});



function updateFromSliders() {
    if (!running) {
        starMassFactor = parseFloat(massStarSlider.value);
        planetMassFactor = parseFloat(massPlanetSlider.value);
        orbitRadiusAU = parseFloat(radiusSlider.value);
        starRadius = 18 + starMassFactor * 3;
        planetRadius = 4 + planetMassFactor * 2;
        orbitRadiusScreen = 80 + orbitRadiusAU * 25;
        theta = 0;
        omega = computeAngularSpeed(starMassFactor, orbitRadiusAU); 
        updateTable();
    }
    speedUp = 1000000*parseFloat(speedSlider.value);
}


//This basically renders the scene to the canvas.
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#000013";
    ctx.fillRect(0,0,canvas.width,canvas.height);//This draws the background


    ctx.fillStyle = "white";//This draws the stars based off of the data that was loaded at the start
    starData.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });


    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, orbitRadiusScreen, 0, Math.PI * 2);
    ctx.stroke();//This draws the orbital path

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(centerX, centerY, starRadius, 0, Math.PI * 2);
    ctx.fill(); //Just draws the star

    const planetX = centerX + orbitRadiusScreen * Math.cos(theta);
    const planetY = centerY + orbitRadiusScreen * Math.sin(theta);
    ctx.fillStyle = "cyan";
    ctx.beginPath();
    ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
    ctx.fill();// This draws the planet

    updateTable();
}

//This updates the velocity to the data table
function updateTable(){
    const massStar = parseFloat(document.getElementById("massStarSlider").value);
    const massPlanet = parseFloat(document.getElementById("massPlanetSlider").value);
    const radius = parseFloat(document.getElementById("radiusSlider").value);
    const velocity = computeOrbitVelocity(massStar, radius);
    const period = Math.sqrt(2 * Math.pow(radius, 3) / massStar);
    document.getElementById("massStarValue").textContent = massStar.toFixed(2);
    document.getElementById("massPlanetValue").textContent = massPlanet.toFixed(2);
    document.getElementById("radiusValue").textContent = radius.toFixed(2);
    document.getElementById("velocityValue").textContent = velocity.toExponential(2);
    document.getElementById("periodValue").textContent = period.toFixed(2);
    console.log(period);
}

//In this most of the calculation is in the initialization, so this just sees how far we moved based off angular velocity and time
function updatePhysics(dt){
    theta += omega * dt * speedUp;//I had to multpiply by a giant number to see movement
}

//This is the loop and has everything that the loop will do each time that it runs
function loop(timestamp){
    if(!lastTime) lastTime = timestamp;
    const dt = (timestamp-lastTime)/1000;
    lastTime = timestamp;
    if(running)
        updatePhysics(dt);
    draw();
    requestAnimationFrame(loop);
}