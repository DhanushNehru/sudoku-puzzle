const { generateSudoku } = require('../src/generator');

test('generate 9x9 Sudoku with complexity 1', () => {
    const board = generateSudoku(9, 1);
    expect(board.length).toBe(9);
    board.forEach(row => expect(row.length).toBe(9));
    let emptyCount = board.flat().filter(cell => cell === 0).length;
    expect(emptyCount).toBeGreaterThan(0);
});

test('generate 9x9 Sudoku with complexity 5', () => {
    const board = generateSudoku(9, 5);
    expect(board.length).toBe(9);
    board.forEach(row => expect(row.length).toBe(9));
    let emptyCount = board.flat().filter(cell => cell === 0).length;
    expect(emptyCount).toBeGreaterThan(0);
});

test('generate 16x16 Sudoku with complexity 3', () => {
    const board = generateSudoku(16, 3);
    expect(board.length).toBe(16);
    board.forEach(row => expect(row.length).toBe(16));
    let emptyCount = board.flat().filter(cell => cell === 0).length;
    expect(emptyCount).toBeGreaterThan(0);
});
