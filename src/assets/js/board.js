export function generateBoardMat(rows, cols) {
    return Array(rows).fill().map(() => Array(cols).fill(0));
}

export function generateBoard(rows, cols, boardElement) {
    // Reset the board first, useful when changing mode
    boardElement.textContent = "";

    // Resize the board to match mode's expected size
    boardElement.style.gridTemplateColumns = `repeat(${cols}, 1.5rem)`;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const btn = document.createElement("button");
            btn.dataset.row = r;
            btn.dataset.col = c;
            boardElement.appendChild(btn);
        }
    }
}

export function getButton(boardElement, r, c) {
    return boardElement.querySelector(`button[data-row="${r}"][data-col="${c}"]`);
}