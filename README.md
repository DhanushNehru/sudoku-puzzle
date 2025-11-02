# sudoku puzzle

[![npm version](https://img.shields.io/npm/v/sudoku-puzzle.svg?color=blue)](https://www.npmjs.com/package/sudoku-puzzle)

Sudoku puzzle generator and solver
A Sudoku generator, solver, and validator npm package that supports various grid sizes (9x9, 16x16, etc.) and allows for generating puzzles with different complexity levels.

## Features

- Generate Sudoku puzzles of various sizes (e.g., 9x9, 16x16).
- Solve Sudoku puzzles.
- Validate Sudoku boards.
- Generate puzzles with different complexity levels.

## Installation

To install the Sudoku generator package, run:

```
npm install sudoku-puzzle
```

## Usage

### Generate Sudoku
Use generateSudoku(size, complexity) to generate a Sudoku puzzle with a specified size and complexity level. Complexity level ranges from 1 to 5, where 1 is the easiest and 5 is the hardest.

### Solve Sudoku
Use solveSudoku(board, size) to solve a given Sudoku puzzle. The board parameter should be a 2D array representing the Sudoku puzzle, and size should be the size of the board.

### Validate Sudoku
Use isBoardValid(board) to validate if a given Sudoku board is valid. The board parameter should be a 2D array representing the Sudoku board.

### 🔍 Difficulty Estimation

You can now estimate the difficulty level of a generated Sudoku puzzle.

```js
const { generateSudoku, estimateDifficulty } = require("sudoku-puzzle");

const puzzle = generateSudoku(9);
console.log(estimateDifficulty(puzzle)); // "Easy", "Medium", or "Hard"
----

Feel free to update the README.md or raise issues if any to enhance the project
