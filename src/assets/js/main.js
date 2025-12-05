import { config } from "./config.js";
import { generateBoardMat, generateBoard, getCellState, getButton, applyCellState } from "./board.js";
import { placeMines, placeNumbers } from "./mines.js";
import { revealCell } from "./reveal.js";
import { startTimer, stopTimer, resetTimer, getTimerValue } from "./timer.js";
import { showLose, showWin } from "./ui.js";

const modeSel = document.getElementById("mode-select");
const board = document.getElementById("board");
const minesUI = document.getElementById("mines");
const emoji = document.getElementById("emoji");
const stopwatch = document.getElementById("stopwatch");
const undoBtn = document.getElementById("undo");

let history = [];

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

    let action = {
        type: "flag",
        changes: [],
        stateBefore: {
            gameOver: state.gameOver,
            revealedSafeCells: state.revealedSafeCells,
            mineCount: mineCount,
            emoji: emoji.textContent,
            time: getTimerValue(),
        },
    };

    const prev = getCellState(btn);

    if (btn.classList.contains("flagged")) {
        btn.classList.remove("flagged");
        btn.textContent = "";
        minesUI.textContent = `${config.emoji.mine} ${++mineCount}`;
    
    // Cannot flag more than the amount of mines on the board
    } else if (mineCount > 0)  {
        btn.classList.add("flagged");
        btn.textContent = config.emoji.flag;
        minesUI.textContent = `${config.emoji.mine} ${--mineCount}`;
    }

    action.changes.push({
        r: btn.dataset.row,
        c: btn.dataset.col,
        prev,
        next: getCellState(btn),
    });

    action.stateAfter = {
        gameOver: state.gameOver,
        revealedSafeCells: state.revealedSafeCells,
        mineCount: mineCount,
        emoji: emoji.textContent,
        time: getTimerValue(),
    },

    history.push(action);
});

// Left-click to reveal cell
board.addEventListener("click", e => {
    if (state.gameOver) return;
    
    const btn = e.target;
    if (!btn.matches("button")) return;

    const r = +btn.dataset.row;
    const c = +btn.dataset.col;

    let action = {
        type: "reveal",
        changes: [],
        stateBefore: {
            gameOver: state.gameOver,
            revealedSafeCells: state.revealedSafeCells,
            mineCount: mineCount,
            emoji: emoji.textContent,
            time: getTimerValue(),
        },
    };

    if (state.firstClick) {
        resetTimer(updateTimerDisplay);
        startTimer(updateTimerDisplay);

        placeMines(boardMat, mineCount, r, c, rows, cols);
        placeNumbers(boardMat, rows, cols);

        state.totalSafeCells = rows * cols - mineCount;
        state.revealedSafeCells = 0;
        state.firstClick = false;
    }

    revealCell(r, c, boardMat, rows, cols, board, state, action, {
        onLose: (action) => {
            state.gameOver = true;
            stopTimer();
            emoji.textContent = config.emoji.lose;
            showLose(board, boardMat, action);
        },

        onWin: (action) => {
            state.gameOver = true;
            stopTimer();
            emoji.textContent = config.emoji.win;
            showWin(board, boardMat, action, minesUI, mineCount);
        },
    });

    action.stateAfter = {
        gameOver: state.gameOver,
        revealedSafeCells: state.revealedSafeCells,
        mineCount: mineCount,
        emoji: emoji.textContent,
        time: getTimerValue(),
    };

    history.push(action);
});

// Click emoji to restart game
emoji.addEventListener("click", () => initialize(state.mode));

// Undo button
undoBtn.addEventListener("click", () => {
    if (history.length === 0) return;

    const action = history.pop();

    // Restore all previous state
    for (const ch of action.changes) {
        const btn = getButton(board, ch.r, ch.c);
        applyCellState(btn, ch.prev);
    }

    state.gameOver = action.stateBefore.gameOver;
    state.revealedSafeCells = action.stateBefore.revealedSafeCells;
    mineCount = action.stateBefore.mineCount;
    emoji.textContent = action.stateBefore.emoji;
    minesUI.textContent = `${config.emoji.mine} ${mineCount}`;

    for (const btn of board.querySelectorAll("button")) {
        btn.disabled = false;

        // Restore non-revealed cell state
        if (!btn.classList.contains("revealed")) {
            btn.style.cursor = "pointer";
        }
    }

    startTimer(updateTimerDisplay);
});

function updateTimerDisplay(t) {
    const min = String(Math.floor(t / 60)).padStart(2, "0");
    const sec = String(t % 60).padStart(2, "0");
    stopwatch.textContent = `${config.emoji.stopwatch} ${min}:${sec}`;
};