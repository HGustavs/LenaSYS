const courseedCanvas = document.getElementById('canvasAnimation');
const ctx = courseedCanvas.getContext('2d');

function resizeCanvas() {
    
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const trailArray = [];
const size = 4;
const dotLife = 50; 
let red = 97;
let blue = 117;
let green = 72;
let redIncrease = true;
let blueIncrease = true;
let greenIncrease = true;

class trailDot {
    constructor(x, y, size) {
        
    }

    update() {
        
    }

    draw(context) {
        
    }
}

window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const dot = new trailDot(x, y, size);
    trailArray.push(dot);
});

function render() {
    
}

function animateMouse() {
    render();
    requestAnimationFrame(animateMouse);
}

animateMouse();