const { generateSudoku } = require("./generator");
const { solveSudoku } = require("./solver");
const { isBoardValid } = require("./validator");
const { estimateDifficulty } = require("./difficultyEstimator");

// ✅ Export everything together
module.exports = {
  generateSudoku,
  solveSudoku,
  isBoardValid,
  estimateDifficulty,
};
