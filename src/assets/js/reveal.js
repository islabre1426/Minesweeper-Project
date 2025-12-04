import { getButton, getCellState } from "./board.js";
import { config } from "./config.js";
import { onAdjacentCell } from "./util.js";

export function revealCell(r, c, boardMat, rows, cols, board, state, action, callbacks) {
    const btn = getButton(board, r, c);
    if (!btn || btn.classList.contains("revealed") || btn.classList.contains("flagged")) {
        return;
    }

    // Reset the button UI, useful when undoing the game
    if (btn.style.cursor === "pointer") {
        btn.style.cursor = "initial";
    }

    const prev = getCellState(btn);

    btn.classList.add("revealed");
    const cell = boardMat[r][c];

    // Cell is a mine
    if (cell === "M") {
        btn.textContent = config.emoji.mine;
        btn.classList.add("mine", "mine-hit");
        action.changes.push({r, c, prev, next: getCellState(btn)});
        callbacks.onLose(action);
        return;
    }

    state.revealedSafeCells++;
    if (state.revealedSafeCells === state.totalSafeCells) {
        action.changes.push({r, c, prev, next: getCellState(btn)});
        callbacks.onWin(action);
        return;
    }

    // Cell is a number
    if (cell > 0) {
        btn.textContent = cell;
        btn.classList.add(`n${cell}`);
        action.changes.push({r, c, prev, next: getCellState(btn)});
        return;
    }

    // Empty cell
    btn.textContent = "";
    action.changes.push({r, c, prev, next: getCellState(btn)});

    // Also reveal empty adjacent cells
    onAdjacentCell(r, c, rows, cols, (nr, nc) => revealCell(nr, nc, boardMat, rows, cols, board, state, action, callbacks));
}