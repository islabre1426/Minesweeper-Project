let timer = null;
let time = 0;
let running = false;

export function startTimer(callback) {
    if (running) return;
    running = true;

    timer = setInterval(() => {
        time++;
        callback(time);
    }, 1000);
}

export function stopTimer() {
    clearInterval(timer);
    running = false;
}

export function resetTimer(callback) {
    stopTimer();
    time = 0;
    callback(time);
}

export function getTimerValue() {
    return time;
}