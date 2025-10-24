const { generateSudoku, getDifficultyLevels } = require("./generator");
const { solveSudoku } = require("./solver");
const { isBoardValid } = require("./validator");
const { SudokuGameManager } = require("./gameManager");
const { InteractiveSudokuGame } = require("./interactiveGame");
const { estimateDifficulty } = require("./difficultyEstimator");

// ✅ Export everything together
module.exports = {
  generateSudoku,
  getDifficultyLevels,
  solveSudoku,
  isBoardValid,
  SudokuGameManager,
  InteractiveSudokuGame,
  estimateDifficulty,
};
