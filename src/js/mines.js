export function isMine(boardMat, r, c) {
    return boardMat[r][c] === "M";
}

export function placeMines(boardMat, amount, safeRow, safeCol, rows, cols) {
    let placed = 0;

    const forbidden = new Set();
    const dirs = [
        [-1,-1],[-1,0],[-1,1],
        [ 0,-1],[ 0,0],[ 0,1],
        [ 1,-1],[ 1,0],[ 1,1]
    ];

    for (const [dr, dc] of dirs) {
        const nr = safeRow + dr;
        const nc = safeCol + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            forbidden.add(`${nr},${nc}`);
        }
    }

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
    const dirs = [
        [-1,-1],[-1,0],[-1,1],
        [ 0,-1],[ 0,0],[ 0,1],
        [ 1,-1],[ 1,0],[ 1,1]
    ];

    const countMines = (r, c) => {
        let count = 0;
        for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (isMine(boardMat, nr, nc)) count++;
            }
        }
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