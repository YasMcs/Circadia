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
    let cycle = (sin(frameCount * 0.01) + 1) / 2; 
    let cValle = color(255, 40, 80, 10); let sValle = color(255, 45, 85, 120); // Luxury Deep Coral
    let cMid = color(157, 0, 255, 25); let sMid = color(160, 10, 255, 190);   // Electric Indigo
    let cPico = color(0, 255, 242, 30); let sPico = color(5, 255, 245, 240);  // Ultra Neon Cyan

    if (cycle < 0.5) {
      let amt = map(cycle, 0, 0.5, 0, 1);
      targetColor = lerpColor(cValle, cMid, amt); targetStroke = lerpColor(sValle, sMid, amt);
      amp = lerp(15, 50, amt); noiseScale = lerp(0.8, 1.8, amt); jaggedness = lerp(1.2, 2.2, amt);
    } else {
      let amt = map(cycle, 0.5, 1.0, 0, 1);
      targetColor = lerpColor(cMid, cPico, amt); targetStroke = lerpColor(sMid, sPico, amt);
      amp = lerp(50, 140, amt); noiseScale = lerp(1.8, 4.0, amt); jaggedness = lerp(2.2, 3.8, amt);
    }
    speed = lerp(0.003, 0.03, cycle); pSpeed = lerp(0.002, 0.04, cycle);
  } 
  else if (app.orbState === 'study') {
    // MAJESTIC BUT CONTROLLED STUDY MODE
    let pulse = (sin(frameCount * 0.01) + 1) / 2;
    let cCyan = color(0, 255, 242, 25); let sCyan = color(0, 255, 242, 220);
    let cIndigo = color(157, 0, 255, 30); let sIndigo = color(160, 10, 255, 180);
    
    targetColor = lerpColor(cCyan, cIndigo, pulse);
    targetStroke = lerpColor(sCyan, sIndigo, pulse);
    
    amp = lerp(40, 110, pulse); 
    noiseScale = lerp(1.2, 2.8, pulse); 
    speed = lerp(0.01, 0.03, pulse); 
    pSpeed = lerp(0.008, 0.035, pulse); 
    jaggedness = lerp(1.8, 3.0, pulse);
  }
  else {
    // BALANCED ENERGY TRANSITION
    let cValle = color(255, 40, 80, 10); let sValle = color(255, 45, 85, 120); 
    let cMid = color(157, 0, 255, 25); let sMid = color(160, 10, 255, 190);
    let cPico = color(0, 255, 242, 40); let sPico = color(5, 255, 245, 250); 
    
    if (app.energyLevel < 0.5) {
      let amt = map(app.energyLevel, 0, 0.5, 0, 1);
      targetColor = lerpColor(cValle, cMid, amt); targetStroke = lerpColor(sValle, sMid, amt);
    } else {
      let amt = map(app.energyLevel, 0.5, 1.0, 0, 1);
      targetColor = lerpColor(cMid, cPico, amt); targetStroke = lerpColor(sMid, sPico, amt);
    }
    
    amp = lerp(20, 110, app.energyLevel); noiseScale = lerp(0.8, 3.2, app.energyLevel);
    speed = lerp(0.003, 0.025, app.energyLevel); pSpeed = lerp(0.002, 0.035, app.energyLevel);
    jaggedness = lerp(1.2, 3.0, app.energyLevel);
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

  for (let layer = 0; layer < 3; layer++) {
    let rMult = 1 - (layer * 0.25);
    fill(targetColor); stroke(targetStroke); strokeWeight(layer===0 ? 2 : 1);
    if(layer === 0) {
      drawingContext.shadowBlur = 45 + (orbReaction * 40);
      drawingContext.shadowColor = targetStroke.toString();
    } else { drawingContext.shadowBlur = 0; }

    beginShape();
    let vertices = 300; 
    for (let i = 0; i < vertices; i++) {
      let angle = map(i, 0, vertices, 0, TWO_PI);
      let xoff = map(cos(angle), -1, 1, 0, 2) * noiseScale;
      let yoff = map(sin(angle), -1, 1, 0, 2) * noiseScale;
      let n = noise(xoff + (layer * 20), yoff + (layer * 20), timeVar);
      
      // SOPHISTICATED SPIKES (Controlled elegance)
      let spikeMod = pow(n, jaggedness);
      // Inner layers stay more circular, outer layers get the energy
      let currentAmp = amp * (1 - layer * 0.2); 
      let r = (200 * rMult) + baseRadiusOffset + map(spikeMod, 0, 1, -currentAmp * 0.5, currentAmp);
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
