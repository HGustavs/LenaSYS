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
const size = 4;
const dotLife = 50; //the number means the amount of frames
let red = 97;
let blue = 117;
let green = 72;
let redIncrease = true;
let blueIncrease = true;
let greenIncrease = true;

class trailDot {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.frames = 0;
        this.direction = Math.random() * 2 * Math.PI;
        this.speed = 1;
    }

    update() {
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        this.size = this.size + 0.4;


        if (redIncrease == true) {
            red = red + 0.003;
            if (red >= 130) {
                redIncrease = false;
            }
        }
        if (redIncrease == false) {
            red = red - 0.003;
            if (red <= 50) {
                redIncrease = true;
            }
        }

        if (blueIncrease == true) {
            blue = blue + 0.003;
            if (blue >= 130) {
                blueIncrease = false;
            }
        }
        if (blueIncrease == false) {
            blue = blue - 0.003;
            if (blue <= 50) {
                blueIncrease = true;
            }
        }

        if (greenIncrease == true) {
            green = green + 0.003;
            if (green >= 130) {
                greenIncrease = false;
            }
        }
        if (greenIncrease == false) {
            green = green - 0.003;
            if (green <= 50) {
                greenIncrease = true;
            }
        }
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        const opacity = 0.8 - this.frames / dotLife;
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
        context.fill();
        context.closePath();
    }
}

//Tracks mousemovement and whenever the mouse is moved, a new dot is inserted into the array
window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const dot = new trailDot(x, y, size);
    trailArray.push(dot);
});

//the animating function. Uses draw function for every dot and 
function render() {
    ctx.clearRect(0, 0, courseedCanvas.width, courseedCanvas.height);

    for (let i = 0; i < trailArray.length; i++) {
        const dot = trailArray[i];
        dot.update();
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