// playing interactive sudoku
// from the installed library https://github.com/DhanushNehru/sudoku-puzzle

const os = require('os');
const { InteractiveSudokuGame } = require('./src/interactiveGame');
const { WindowsCompatibleSudokuGame } = require('./src/windowsGame');

/**
 * This script demonstrates how to launch the interactive Sudoku game
 * using the classes provided by this library.
 *
 * It automatically detects the operating system to provide the best
 * compatibility, especially for the Windows command-line interface.
 */

console.log('Initializing Sudoku game...');

try {
    // On Windows, the standard readline interface can have issues.
    // The WindowsCompatibleSudokuGame uses a different input method to fix this.
    if (os.platform() === 'win32') {
        console.log('Windows detected. Launching compatible version.');
        new WindowsCompatibleSudokuGame();
    } else {
        console.log('Launching standard interactive game.');
        new InteractiveSudokuGame();
    }
} catch (error) {
    console.error('Failed to start the Sudoku game:', error);
    console.error('Please ensure you have run "npm install" and that all dependencies are available.');
}