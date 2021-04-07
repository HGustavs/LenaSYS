function generateHash() {
    var randNum = getRandomNumber();
    var hash = createHash(randNum);
    return decimalToHexString(hash);
}

function createHash(num) {
    var string = num.toString();
    var hash = 0;

    if (string.length == 0) return hash;

    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash;
}

function decimalToHexString(number) {
    if (number < 0) {
        number = 0xFFFFFFFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}

function getRandomNumber() {
    return Math.floor(Math.random() * 1000000) + 100000;
}
