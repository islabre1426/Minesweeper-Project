import { onAdjacentCell } from "./util";

export function isMine(boardMat, r, c) {
    return boardMat[r][c] === "M";
}

export function placeMines(boardMat, amount, safeRow, safeCol, rows, cols) {
    let placed = 0;

    // The set of first-click cell and its neighbor, cannot place mines there
    const forbidden = new Set();
    onAdjacentCell(safeRow, safeCol, rows, cols, (nr, nc) => forbidden.add(`${nr},${nc}`))

    while (placed < amount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if (forbidden.has(`${r},${c}`)) continue;

        if (!isMine(boardMat, r, c)) {
            boardMat[r][c] = "M";
            placed++;
        }
    }
}

export function placeNumbers(boardMat, rows, cols) {
    const countMines = (r, c) => {
        let count = 0;

        onAdjacentCell(r, c, rows, cols, (nr, nc) => {
            if (isMine(boardMat, nr, nc)) count++;
        })

        return count;
    };

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (isMine(boardMat, r, c)) continue;
            const count = countMines(r, c);
            boardMat[r][c] = count > 0 ? count : 0;
        }
    }
}