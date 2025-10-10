// Simple CLI for Sudoku Puzzle
const readline = require('readline');
const { generateSudoku, solveSudoku, isBoardValid } = require('./index');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function printBoard(board) {
    board.forEach(row => {
        console.log(row.map(cell => (cell === 0 ? '.' : cell)).join(' '));
    });
}

function askDifficulty(callback) {
    rl.question('Select difficulty (1-Easy, 2-Medium, 3-Hard, 4-Expert, 5-Evil): ', answer => {
        const diff = parseInt(answer);
        if (diff >= 1 && diff <= 5) {
            callback(diff);
        } else {
            console.log('Invalid input. Please enter a number between 1 and 5.');
            askDifficulty(callback);
        }
    });
}

function askAction(board, startTime) {
    rl.question('\nOptions: (h)int, (s)olve, (q)uit\nYour move: ', answer => {
        if (answer === 'h') {
            giveHint(board);
            printBoard(board);
            askAction(board, startTime);
        } else if (answer === 's') {
            solveSudoku(board, board.length);
            printBoard(board);
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            console.log(`Solved! Time taken: ${timeTaken} seconds.`);
            rl.close();
        } else if (answer === 'q') {
            rl.close();
        } else {
            console.log('Unknown option.');
            askAction(board, startTime);
        }
    });
}

function giveHint(board) {
    // Find the first empty cell and fill it with the correct value
    const size = board.length;
    const temp = JSON.parse(JSON.stringify(board));
    if (solveSudoku(temp, size)) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) {
                    board[i][j] = temp[i][j];
                    console.log(`Hint: Filled cell [${i + 1}, ${j + 1}] with ${temp[i][j]}`);
                    return;
                }
            }
        }
    } else {
        console.log('No hints available. Puzzle may be unsolvable.');
    }
}

function startGame() {
    askDifficulty(difficulty => {
        const board = generateSudoku(9, difficulty);
        console.log('\nHere is your puzzle:');
        printBoard(board);
        const startTime = Date.now();
        askAction(board, startTime);
    });
}

startGame();
