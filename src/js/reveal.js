import { getButton } from "./board.js";

export function revealCell(r, c, boardMat, rows, cols, board, state, callbacks) {
    const btn = getButton(board, r, c);
    if (!btn || btn.classList.contains("revealed") || btn.classList.contains("flagged")) {
        return;
    }

    btn.classList.add("revealed");
    const cell = boardMat[r][c];

    if (cell === "M") {
        btn.textContent = "💣";
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

    btn.textContent = "";
    cascade(r, c, boardMat, rows, cols, board, state, callbacks);
}

function cascade(r, c, boardMat, rows, cols, board, state, callbacks) {
    const dirs = [
        [-1,-1],[-1,0],[-1,1],
        [ 0,-1],[ 0,0],[ 0,1],
        [ 1,-1],[ 1,0],[ 1,1]
    ];

    for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            revealCell(nr, nc, boardMat, rows, cols, board, state, callbacks);
        }
    }
}