import { config } from "./config";
import { isMine } from "./mines";

export function showLose(board, boardMat) {
    const btns = board.querySelectorAll("button");

    for (const btn of btns) {
        const r = btn.dataset.row;
        const c = btn.dataset.col;

        btn.disabled = true;

        if (isMine(boardMat, r, c) && !btn.classList.contains("flagged")) {
            btn.textContent = config.emoji.mine;
            btn.classList.add("revealed", "mine");
        }

        if (btn.classList.contains("flagged") && !isMine(boardMat, r, c)) {
            btn.textContent = config.emoji.misflagged;
            btn.classList.add("misflagged");
        }
    }
}

export function showWin(board, boardMat) {
    const btns = board.querySelectorAll("button");

    for (const btn of btns) {
        const r = btn.dataset.row;
        const c = btn.dataset.col;

        btn.disabled = true;

        if (isMine(boardMat, r, c)) {
            btn.textContent = config.emoji.flag;
            btn.classList.add("revealed", "flagged");
        }
    }
}