const courseedCanvas = document.getElementById('canvasAnimation');
const ctx = courseedCanvas.getContext('2d');

//if you resize after the page has loaded, the dot will be offset from the mouse. Hence this function
function resizeCanvas() {
    courseedCanvas.width = window.innerWidth;
    courseedCanvas.height = window.innerHeight;
    courseedCanvas.style.overflowX = 'hidden'; //offset occurs if scrollbar is present (fixed by canvas using vw/vh). But this causes horizontal overflow. Hences this line.
    courseedCanvas.style.position = 'fixed'; //necessary for scrolling
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const trailArray = [];
const size = 10;
const dotLife = 20; //the number means the amount of frames

class trailDot {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.frames = 0;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        context.fillStyle = 'rgb(97, 72, 117)';
        context.fill();
        context.closePath();
    }
}

//Tracks mousemovement and whenever the mouse is moved, a new dot is inserted into the array
window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    console.log(x, y);
    const dot = new trailDot(x, y, size);
    trailArray.push(dot);
});

//the animating function. Uses draw function for every dot and 
function render() {
    ctx.clearRect(0, 0, courseedCanvas.width, courseedCanvas.height);

    for (let i = 0; i < trailArray.length; i++) {
        const dot = trailArray[i];
        dot.draw(ctx);
        dot.frames++;
        if (dot.frames > dotLife) {
            trailArray.splice(i, 1); //only seems to work with splice
        }
    }
}

function animateMouse() {
    render();
    requestAnimationFrame(animateMouse);
}

animateMouse();
