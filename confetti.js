// confetti.js

// Configuration Variables
const maxParticleCount = 200; // Maximum number of confetti particles
const particleSpeed = 5; // Speed at which particles move
const colors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson",
];

// State Variables
let streamingConfetti = false; // Indicates if confetti is currently animating
let animationTimer = null; // Holds the reference to the animation frame
let particles = []; // Array to store all active confetti particles
let waveAngle = 0; // Angle used to create wave-like motion in particles

/**
 * Initializes or resets a confetti particle with random properties.
 * @param {Object} particle - The particle object to reset.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @returns {Object} - The updated particle object.
 */
function resetParticle(particle, width, height) {
    particle.color = colors[Math.floor(Math.random() * colors.length)];
    particle.x = Math.random() * width;
    particle.y = Math.random() * height - height;
    particle.diameter = Math.random() * 10 + 5;
    particle.tilt = Math.random() * 10 - 10;
    particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
    particle.tiltAngle = 0;
    return particle;
}

/**
 * Starts the confetti animation by setting up the canvas and initializing particles.
 */
function startConfetti() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Polyfill for requestAnimationFrame
    window.requestAnimFrame = (function () {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 16.6666667);
            }
        );
    })();

    let canvas = document.getElementById("confetti-canvas");
    if (canvas === null) {
        canvas = document.createElement("canvas");
        canvas.setAttribute("id", "confetti-canvas");
        canvas.setAttribute(
            "style",
            "display:block;z-index:999999;pointer-events:none;position:fixed;top:0;left:0;"
        );
        document.body.appendChild(canvas);
        canvas.width = width;
        canvas.height = height;

        // Adjust canvas size on window resize
        window.addEventListener(
            "resize",
            function () {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            },
            true
        );
    }

    const context = canvas.getContext("2d");

    // Initialize particles up to the maximum count
    while (particles.length < maxParticleCount) {
        particles.push(resetParticle({}, width, height));
    }

    streamingConfetti = true;

    if (animationTimer === null) {
        (function runAnimation() {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            if (particles.length === 0) {
                animationTimer = null;
            } else {
                updateParticles();
                drawParticles(context);
                animationTimer = requestAnimFrame(runAnimation);
            }
        })();
    }
}

/**
 * Stops the addition of new confetti particles.
 */
function stopConfetti() {
    streamingConfetti = false;
}

/**
 * Immediately stops the confetti animation and removes all confetti particles.
 */
function removeConfetti() {
    stopConfetti();
    particles = [];
    const canvas = document.getElementById("confetti-canvas");
    if (canvas) {
        canvas.parentNode.removeChild(canvas);
    }
}

/**
 * Draws all confetti particles onto the canvas.
 * @param {CanvasRenderingContext2D} context - The 2D rendering context for the canvas.
 */
function drawParticles(context) {
    let particle;
    let x;
    for (let i = 0; i < particles.length; i++) {
        particle = particles[i];
        context.beginPath();
        context.lineWidth = particle.diameter;
        context.strokeStyle = particle.color;
        x = particle.x + particle.tilt;
        context.moveTo(x + particle.diameter / 2, particle.y);
        context.lineTo(
            x,
            particle.y + particle.tilt + particle.diameter / 2
        );
        context.stroke();
    }
}

/**
 * Updates the position and state of each confetti particle to create the animation effect.
 */
function updateParticles() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    waveAngle += 0.01;

    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        if (!streamingConfetti && particle.y < -15) {
            particle.y = height + 100;
        } else {
            particle.tiltAngle += particle.tiltAngleIncrement;
            particle.x += Math.sin(waveAngle);
            particle.y +=
                (Math.cos(waveAngle) + particle.diameter + particleSpeed) *
                0.5;
            particle.tilt = Math.sin(particle.tiltAngle) * 15;
        }

        // Remove particles that are out of bounds
        if (
            particle.x > width + 20 ||
            particle.x < -20 ||
            particle.y > height
        ) {
            if (streamingConfetti && particles.length <= maxParticleCount) {
                resetParticle(particle, width, height);
            } else {
                particles.splice(i, 1);
                i--;
            }
        }
    }
}

// Exporting the functions for use in other modules
export { startConfetti, stopConfetti, removeConfetti };
