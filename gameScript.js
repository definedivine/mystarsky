let stars = [];
let particles = [];
let shootingStars = [];
let clickCount = 0;
const totalStarsInGalaxy = 342039024932;  // Example number

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);

    // H2 styling
    const h2Elem = document.querySelector('h2');
    h2Elem.style.position = 'absolute';
    h2Elem.style.top = '50px';
    h2Elem.style.left = '50%';
    h2Elem.style.transform = 'translate(-50%, 0)';
    h2Elem.style.fontSize = '14px';
    h2Elem.style.color = '#00ffef';
    
}

function draw() {
    background(0);

    // Display stars
    for (let star of stars) {
        star.display();
    }

    // Handle particle explosion
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    // Handle shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        shootingStars[i].update();
        shootingStars[i].display();
        if (shootingStars[i].lifetime <= 0) {
            shootingStars.splice(i, 1);
        }
    }

    if (frameCount % (15 * 60) === 0) {
        shootingStars.push(new ShootingStar());
    }

    // Update H2
    let percentage = ((clickCount / totalStarsInGalaxy) * 100).toFixed(9);
    document.querySelector('h2').innerText = `You have created ${clickCount} stars, a whopping ${percentage} % of our galaxy.`;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}

function mouseClicked() {
    stars.push(new Star(mouseX, mouseY));
    clickCount++;

    if (clickCount % 10 === 0) {
        explodeRandomStar();
    }
}

function doubleClicked() {
    for (let star of stars) {
        let d = dist(mouseX, mouseY, star.x, star.y);
        if (d < star.size) {
            explodeStar(star);
            const index = stars.indexOf(star);
            if (index > -1) {
                stars.splice(index, 1);
            }
            break;
        }
    }
}

function explodeRandomStar() {
    if (stars.length > 0) {
        let randomStar = random(stars);
        explodeStar(randomStar);
        const index = stars.indexOf(randomStar);
        if (index > -1) {
            stars.splice(index, 1);
        }
    }
}

function explodeStar(star) {
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(star.x, star.y));
    }
}

class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(2, 9);
        this.spikes = 5;
    }

    display() {
        push();
        noStroke();
        fill(255, 255, random(150, 255));
        beginShape();
        let rotation = TWO_PI / this.spikes;
        for (let i = 0; i < TWO_PI; i += rotation) {
            let outer = this.size;
            let inner = outer / 2.25;
            vertex(this.x + cos(i) * outer, this.y + sin(i) * outer);
            vertex(this.x + cos(i + rotation / 2) * inner, this.y + sin(i + rotation / 2) * inner);
        }
        endShape(CLOSE);
        pop();
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speedX = random(-3, 3);
        this.speedY = random(-3, 3);
        this.alpha = 255;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 5;
    }

    display() {
        noStroke();
        fill(255, this.alpha);
        ellipse(this.x, this.y, 4);
    }
}

class ShootingStar {
    constructor() {
        this.startX = random([0, width]);
        this.endX = (this.startX === 0) ? width : 0;
        this.y = random(height);
        this.speed = random(6, 10);
        this.lifetime = 2 * 60;  // Last for 2 seconds (assuming 60 frames per second)
    }

    update() {
        if (this.startX === 0) {
            this.startX += this.speed;
        } else {
            this.startX -= this.speed;
        }
        this.lifetime -= 1;
    }

    display() {
        push();
        fill(255);
        ellipse(this.startX, this.y, 20);
        pop();
    }
}

document.getElementById('saveButton').addEventListener('click', function() {
    // Add the title to the canvas
    push();  // Save the current drawing settings
    fill(255);  // White text
    textSize(48);  // Set a font size for the title
    textAlign(CENTER, CENTER);  // Center align
    textFont('Nunito');  // Use the Nunito font
    text("My StarSky", width / 2, height / 10);  // Draw the title near the top of the canvas
    pop();  // Restore the saved drawing settings

    // Save the canvas with the title
    saveCanvas('MyStarrySky', 'png');

    // Redraw the game view to remove the title from the canvas
    draw();
});

