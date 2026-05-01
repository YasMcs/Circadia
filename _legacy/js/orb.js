let timeVar = 0;
let particles = [];
let orbReaction = 0; 
let reactionType = 'click'; 

window.triggerOrbReaction = function(type = 'click') {
  orbReaction = 1.0;
  reactionType = type;
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5-container');
  for(let i=0; i<200; i++) particles.push(new BioParticle());
}

function draw() {
  clear(); 
  
  if (orbReaction > 0) orbReaction -= 0.05;
  if (orbReaction < 0) orbReaction = 0;

  let targetColor, targetStroke, amp, noiseScale, speed, pSpeed, jaggedness;
  jaggedness = 2; 

  if (app.orbState === 'login' || app.orbState === 'neutral') {
    let cycle = (sin(frameCount * 0.015) + 1) / 2; 
    let cValle = color(255, 30, 0, 10); let sValle = color(255, 40, 0, 100); 
    let cMid = color(188, 19, 254, 25); let sMid = color(188, 19, 254, 180);
    let cPico = color(0, 240, 255, 30); let sPico = color(0, 242, 255, 230); 

    if (cycle < 0.5) {
      let amt = map(cycle, 0, 0.5, 0, 1);
      targetColor = lerpColor(cValle, cMid, amt); targetStroke = lerpColor(sValle, sMid, amt);
      amp = lerp(15, 40, amt); noiseScale = lerp(0.8, 1.5, amt); jaggedness = lerp(1.2, 2, amt);
    } else {
      let amt = map(cycle, 0.5, 1.0, 0, 1);
      targetColor = lerpColor(cMid, cPico, amt); targetStroke = lerpColor(sMid, sPico, amt);
      amp = lerp(40, 120, amt); noiseScale = lerp(1.5, 3.5, amt); jaggedness = lerp(2, 3.5, amt);
    }
    speed = lerp(0.002, 0.025, cycle); pSpeed = lerp(0.001, 0.035, cycle);
  } 
  else if (app.orbState === 'study') {
    targetColor = color(0, 240, 255, 15); targetStroke = color(0, 240, 255, 120); 
    amp = 15; noiseScale = 0.5; speed = 0.01; pSpeed = 0.005; jaggedness = 1.0;
  }
  else {
    let cValle = color(255, 30, 0, 10); let sValle = color(255, 40, 0, 100); 
    let cPico = color(0, 240, 255, 40); let sPico = color(0, 242, 255, 230); 
    targetColor = lerpColor(cValle, cPico, app.energyLevel);
    targetStroke = lerpColor(sValle, sPico, app.energyLevel);
    amp = lerp(15, 120, app.energyLevel); noiseScale = lerp(0.8, 3.5, app.energyLevel);
    speed = lerp(0.002, 0.025, app.energyLevel); pSpeed = lerp(0.001, 0.035, app.energyLevel);
    jaggedness = lerp(1.2, 3.5, app.energyLevel);
  }

  let baseRadiusOffset = 0;
  if (orbReaction > 0) {
    if (reactionType === 'click') {
      let rFlash = color(255, 255, 255, 180);
      targetStroke = lerpColor(targetStroke, rFlash, orbReaction * 0.6);
      baseRadiusOffset = orbReaction * 25; amp += orbReaction * 5; speed += orbReaction * 0.01;
    }
    else if (reactionType === 'transition') {
      let rFlash = color(200, 240, 255, 200);
      targetStroke = lerpColor(targetStroke, rFlash, orbReaction * 0.7);
      baseRadiusOffset = orbReaction * 50; amp -= orbReaction * 10; speed += orbReaction * 0.02;
    }
  }

  if (typeof window.currentCenterX === 'undefined') window.currentCenterX = width / 2;
  
  // LOGICA COCKPIT: EN DASHBOARD VA AL CENTRO!
  let targetX = width / 2; // Default is center for dashboard/cockpit
  
  if (app.state === 'auth') {
    if (app.authSubState === 'aboutus') targetX = width * 0.3;
    else if (app.authSubState !== 'welcome') targetX = width * 0.7; // login/register push it to the right
  }
  
  window.currentCenterX = lerp(window.currentCenterX, targetX, 0.05);

  let centerX = window.currentCenterX;
  let centerY = height / 2;

  push();
  translate(centerX, centerY);

  let particleSpd = pSpeed;
  let particleROffset = 0;
  if (orbReaction > 0) {
    if (reactionType === 'click') { particleSpd += orbReaction * 0.02; particleROffset = orbReaction * 20; }
    else if (reactionType === 'transition') { particleSpd += orbReaction * 0.04; particleROffset = orbReaction * 40; }
  }

  for(let p of particles) {
    p.update(particleSpd, particleROffset);
    p.draw(targetStroke);
  }

  for (let layer = 0; layer < 2; layer++) {
    let rMult = 1 - (layer * 0.2);
    fill(targetColor); stroke(targetStroke); strokeWeight(layer===0 ? 2 : 1);
    if(layer === 0) {
      drawingContext.shadowBlur = 35 + (orbReaction * 35);
      drawingContext.shadowColor = targetStroke.toString();
    } else { drawingContext.shadowBlur = 0; }

    beginShape();
    for (let i = 0; i < 150; i++) {
      let angle = map(i, 0, 150, 0, TWO_PI);
      let xoff = map(cos(angle), -1, 1, 0, 2) * noiseScale;
      let yoff = map(sin(angle), -1, 1, 0, 2) * noiseScale;
      let n = noise(xoff, yoff, timeVar);
      let r = (200 * rMult) + baseRadiusOffset + map(pow(n, jaggedness), 0, 1, -amp, amp);
      vertex(r * cos(angle), r * sin(angle));
    }
    endShape(CLOSE);
  }
  pop();

  timeVar += speed;
}

class BioParticle {
  constructor() {
    this.angle = random(TWO_PI);
    let maxDist = max(windowWidth, windowHeight) * 1.2;
    this.baseR = random(200, maxDist);
    this.noiseOffset = random(1000);
    this.size = random(1.5, 3.5);
  }
  update(spd, rOffset) {
    this.angle += spd * map(this.baseR, 200, windowWidth, 1.0, 0.2); 
    let jitter = map(noise(this.noiseOffset, timeVar), 0, 1, -50, 50);
    this.r = this.baseR + jitter + rOffset; 
    this.noiseOffset += spd * 2;
  }
  draw(col) {
    noStroke(); drawingContext.shadowBlur = 0;
    let maxDist = max(windowWidth, windowHeight) * 1.2;
    let pAlpha = map(this.r, 200, maxDist, 180, 0);
    if (pAlpha < 0) pAlpha = 0;
    fill(red(col), green(col), blue(col), pAlpha);
    ellipse(this.r * cos(this.angle), this.r * sin(this.angle), this.size);
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
