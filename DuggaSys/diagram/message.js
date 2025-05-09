/**
 * @description Displays a popup message as feedback for the current user. This message will then be destroyed after a specified time.
 * @param {messageTypes} type What kind of message type this is.
 * @param {String} message Contents of the message displayed.
 * @param {Number} time Milliseconds until the message will be destroyed.
 * @see messageTypes All kind of messages there exist to display.
 */
function displayMessage(type, message, time = 5000) {
    // Message settings
    const maxMessagesAtDisplay = 5; // The number of messages that can be displayed on the screen

    const messageElement = document.getElementById("diagram-message"); // Get div for error-messages
    const id = makeRandomID();

    // If the already is the maximum number of messages, remove the oldest one
    if (messageElement.childElementCount >= maxMessagesAtDisplay) {
        removeMessage(messageElement.firstElementChild);
    }

    // Add a new message to the div.
    messageElement.innerHTML += `<div id='${id}' onclick='removeMessage(this)' class='${type}'><p>${message}</p></div>`;

    if (time > 0) {
        setTimerToMessage(messageElement.lastElementChild, time);
    }

}

/**
 * @description Function for setting the message destruction timer of a popup message. This is used by the displayMessage() function.
 * @param {HTMLElement} element The message DOM element that should be edited.
 * @param {Number} time Milliseconds until the message will be destroyed.
 */
function setTimerToMessage(element, time = 5000) {
    if (!element) return;

    element.innerHTML += `<div class="timeIndicatorBar"></div>`;
    var timer = setInterval(function () {
        const element = document.getElementById(settings.misc.errorMsgMap[timer].id);
        settings.misc.errorMsgMap[timer].percent -= 1;
        element.lastElementChild.style.width = `calc(${settings.misc.errorMsgMap[timer].percent - 1}% - 10px)`;

        // If the time is out, remove the message
        if (settings.misc.errorMsgMap[timer].percent === 0) removeMessage(element, timer);

    }, time / 100);

    // Adds to map: TimerID: ElementID, Percent
    settings.misc.errorMsgMap[timer] = {
        id: element.id,
        percent: 100
    };
}

/**
 * @description Destroys a popup message.
 * @param {HTMLElement} element The message DOM element that should be destroyed.
 * @param {Number} timer Kills the timer associated with the popup message. Can be null and will not remove any timer then.
 */
function removeMessage(element, timer) {
    // If there is no timer in the parameter try find it by elementID in
    if (!timer) {
        timer = Object.keys(settings.misc.errorMsgMap).find(key => {
            return settings.misc.errorMsgMap[key].id === element.id
        });
    }

    if (timer) {
        clearInterval(timer); // Remove the timer
        delete settings.misc.errorMsgMap[timer]; // Remove timer from the map
    }

    element.remove(); // Remove the element from DOM
    // Remove ID from randomidArray
    settings.misc.randomidArray = settings.misc.randomidArray.filter(id => {
        return element.id !== id;
    });
}
