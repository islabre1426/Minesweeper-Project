export function onAdjacentCell(r, c, rows, cols, callback) {
    const direction = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1], [ 0, 0], [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1],
    ];

    for (const [dr, dc] of direction) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            callback(nr, nc);
        }
    }
}