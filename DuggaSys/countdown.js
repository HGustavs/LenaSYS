//Storing the countdown function
let countdown;
// simply add classes in PHP/HTML document
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const button = document.querySelector('[data-time]');

function timer(sec) {
  const now = Date.now();
  const then = now + sec * 1000;
  // as soon as the function is invoked - run it
  displayTimeLeft(sec);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secLeft = Math.round((then - Date.now()) / 1000);
    // Stop to prevent negative values
    if (secLeft < 0) {
      clearIntervals(countdown);
      return;
    }
    //display the countdown-timer
    displayTimeLeft(secLeft);
  }, 1000);
}

// start countdown at the correct time (otherwise 1 sec will be skipped at the beginning)
function displayTimeLeft(sec) {
  // only show full minutes
  const minutes = Math.floor(sec / 60);
  // only show the seconds according to the minutes from const minutes
  const remainderSec = sec % 60;
  // fixes the 0 problem when couting down
  const display = `${minutes}:${remainderSec < 10 ? '0' : ''}${remainderSec}`;
  // live update the html tab-bar with the countdown-timer
  document.title = display;
  timerDisplay.textContent = display;
  console.log({minutes, remainderSec});
}

function displayEndTime(timestamp) {
  // Allows us to fetch the current time which later will let us parse out the information we want
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  endTime.textContent = `Dugga ends at ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
  const sec = parseInt(this.dataset.time);
  timer(sec);
  console.log(sec);
}

button.forEach (button => addEventListener('click', startTimer));
// create customTimer as a form trough php/html in order to make this function work everywhere on the site
document.customTimer.addEventListener('submit', function(e) {
  // prevent default click/enter behaviour to create the customTimer more Ajax like.
  e.preventDefault();
  const mins = this.minutes.value;
  console.log(mins);
  timer(mins * 60);
  this.reset();
});
