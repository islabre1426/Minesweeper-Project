import { getButton } from "./board.js";
import { config } from "./config.js";
import { onAdjacentCell } from "./util.js";

export function revealCell(r, c, boardMat, rows, cols, board, state, callbacks) {
    const btn = getButton(board, r, c);
    if (!btn || btn.classList.contains("revealed") || btn.classList.contains("flagged")) {
        return;
    }

    btn.classList.add("revealed");
    const cell = boardMat[r][c];

    if (cell === "M") {
        btn.textContent = config.emoji.mine;
        btn.classList.add("mine", "mine-hit");
        callbacks.onLose(r, c);
        return;
    }

    state.revealedSafeCells++;
    if (state.revealedSafeCells === state.totalSafeCells) {
        callbacks.onWin();
        return;
    }

    if (cell > 0) {
        btn.textContent = cell;
        btn.classList.add(`n${cell}`);
        return;
    }

    // Empty cell
    btn.textContent = "";

    // Also reveal empty adjacent cells
    onAdjacentCell(r, c, rows, cols, (nr, nc) => revealCell(nr, nc, boardMat, rows, cols, board, state, callbacks));
}