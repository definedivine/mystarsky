let stars = [];
let particles = [];
let shootingStars = [];
let clickCount = 0;
const totalStarsInGalaxy = 342039024932;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvasContainer');
    background(0);
    updateSubheading();
}

function draw() {
    background(0, 25); // Add a slight trail effect

    for (let star of stars) {
        star.display();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
        shootingStars[i].update();
        shootingStars[i].display();
        if (shootingStars[i].isOffScreen()) {
            shootingStars.splice(i, 1);
        }
    }

    if (frameCount % 180 === 0 && random() < 0.5) { // Adjust frequency of shooting stars
        shootingStars.push(new ShootingStar());
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}

function mouseClicked() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        stars.push(new Star(mouseX, mouseY));
        clickCount++;
        updateSubheading();

        if (clickCount % 10 === 0) {
            explodeRandomStar();
        }
    }
    return false; // Prevent default behavior
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
    return false; // Prevent default behavior
}

function updateSubheading() {
    let percentage = ((clickCount / totalStarsInGalaxy) * 100).toFixed(9);
    document.getElementById('subheading').innerText = `You have created ${clickCount} stars, a whopping ${percentage}% of our galaxy.`;
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
        this.reset();
    }

    reset() {
        // Start from beyond the screen edges
        if (random() < 0.5) {
            this.x = random(width * 1.5);
            this.y = -50;
        } else {
            this.x = width + 50;
            this.y = random(height);
        }
        this.prevX = this.x;
        this.prevY = this.y;
        this.speedX = random(-15, -5);
        this.speedY = random(1, 5);
        this.size = random(2, 4);
        this.tailLength = random(10, 20);
        this.color = color(255, 255, random(200, 255));
    }

    update() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x += this.speedX;
        this.y += this.speedY;
    }

    display() {
        push();
        stroke(this.color);
        strokeWeight(this.size);
        line(this.x, this.y, this.prevX, this.prevY);
        
        // Create a tail effect
        for (let i = 0; i < this.tailLength; i++) {
            let alpha = map(i, 0, this.tailLength, 255, 0);
            stroke(red(this.color), green(this.color), blue(this.color), alpha);
            let x = lerp(this.x, this.prevX, i / this.tailLength);
            let y = lerp(this.y, this.prevY, i / this.tailLength);
            point(x, y);
        }
        pop();
    }

    isOffScreen() {
        return (this.x < -50 && this.y > height + 50);
    }
}

document.getElementById('saveButton').addEventListener('click', function() {
    // Create a new canvas for saving
    let saveCanvas = createGraphics(width, height);
    
    // Copy the current canvas to the new one
    saveCanvas.image(get(), 0, 0);
    
    // Add the title to the canvas
    saveCanvas.push();
    saveCanvas.fill(255);
    saveCanvas.textSize(48);
    saveCanvas.textAlign(CENTER, CENTER);
    saveCanvas.textFont('Nunito');
    saveCanvas.text("My StarSky", width / 2, height / 10);
    saveCanvas.pop();

    // Save the new canvas
    saveCanvas.save('MyStarrySky.jpg');
});