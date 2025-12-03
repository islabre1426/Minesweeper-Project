import { config } from "./config.js";
import { generateBoardMat, generateBoard } from "./board.js";
import { placeMines, placeNumbers } from "./mines.js";
import { revealCell } from "./reveal.js";
import { startTimer, stopTimer, resetTimer } from "./timer.js";
import { showLose, showWin } from "./ui.js";

const modeSel = document.getElementById("mode-select");
const board = document.getElementById("board");
const minesUI = document.getElementById("mines");
const emoji = document.getElementById("emoji");
const stopwatch = document.getElementById("stopwatch");

let rows, cols, mineCount, boardMat;

let state = {
    mode: null,
    firstClick: true,
    gameOver: false,
    totalSafeCells: 0,
    revealedSafeCells: 0,
};

function initialize(mode) {
    const cfg = config.mode[mode];
    rows = cfg.rows;
    cols = cfg.cols;
    mineCount = cfg.mines;

    minesUI.textContent = `${config.emoji.mine} ${mineCount}`;
    state.mode = mode;
    state.firstClick = true;
    state.gameOver = false;

    generateBoard(rows, cols, board);
    boardMat = generateBoardMat(rows, cols);

    resetTimer(updateTimerDisplay);
    emoji.textContent = config.emoji.normal;
}

modeSel.addEventListener("change", () => initialize(modeSel.value));

// Default game mode
initialize("beginner");

// Right-click to flag cell
board.addEventListener("contextmenu", e => {
    e.preventDefault();

    if (state.gameOver) return;

    const btn = e.target;
    if (!btn.matches("button") || btn.classList.contains("revealed")) return;

    if (btn.classList.contains("flagged")) {
        btn.classList.remove("flagged");
        btn.textContent = "";
        minesUI.textContent = `${config.emoji.mine} ${++mineCount}`;
    } else {
        btn.classList.add("flagged");
        btn.textContent = config.emoji.flag;
        minesUI.textContent = `${config.emoji.mine} ${--mineCount}`;
    }
});

// Left-click to reveal cell
board.addEventListener("click", e => {
    if (state.gameOver) return;
    
    const btn = e.target;
    if (!btn.matches("button")) return;

    const r = +btn.dataset.row;
    const c = +btn.dataset.col;

    if (state.firstClick) {
        resetTimer(updateTimerDisplay);
        startTimer(updateTimerDisplay);

        placeMines(boardMat, mineCount, r, c, rows, cols);
        placeNumbers(boardMat, rows, cols);

        state.totalSafeCells = rows * cols - mineCount;
        state.revealedSafeCells = 0;
        state.firstClick = false;
    }

    revealCell(r, c, boardMat, rows, cols, board, state, {
        onLose: () => {
            state.gameOver = true;
            stopTimer();
            emoji.textContent = config.emoji.lose;
            showLose(board, boardMat);
        },

        onWin: () => {
            state.gameOver = true;
            stopTimer();
            emoji.textContent = config.emoji.win;
            showWin(board, boardMat);
        }
    });
});

// Click emoji to restart game
emoji.addEventListener("click", () => initialize(state.mode));

function updateTimerDisplay(t) {
    const min = String(Math.floor(t / 60)).padStart(2, "0");
    const sec = String(t % 60).padStart(2, "0");
    stopwatch.textContent = `${config.emoji.stopwatch} ${min}:${sec}`;
};