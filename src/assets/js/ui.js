import { getCellState } from "./board";
import { config } from "./config";
import { isMine } from "./mines";

export function showLose(board, boardMat, action) {
    const btns = board.querySelectorAll("button");

    for (const btn of btns) {
        const r = +btn.dataset.row;
        const c = +btn.dataset.col;

        const prev = getCellState(btn);

        // Disable the buttons
        btn.disabled = true;
        btn.style.cursor = "initial";

        if (isMine(boardMat, r, c) && !btn.classList.contains("flagged")) {
            btn.textContent = config.emoji.mine;
            btn.classList.add("revealed", "mine");
        }

        if (btn.classList.contains("flagged") && !isMine(boardMat, r, c)) {
            btn.textContent = config.emoji.misflagged;
            btn.classList.add("misflagged");
        }

        const next = getCellState(btn);

        // Only push if state changed
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
            action.changes.push({r, c, prev, next});
        }
    }
}

export function showWin(board, boardMat, action) {
    const btns = board.querySelectorAll("button");

    for (const btn of btns) {
        const r = +btn.dataset.row;
        const c = +btn.dataset.col;

        const prev = getCellState(btn);

        // Disable the buttons
        btn.disabled = true;
        btn.style.cursor = "initial";

        if (isMine(boardMat, r, c)) {
            btn.textContent = config.emoji.flag;
            btn.classList.add("revealed", "flagged");
        }

        const next = getCellState(btn);

        // Only push if state changed
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
            action.changes.push({r, c, prev, next});
        }
    }
}