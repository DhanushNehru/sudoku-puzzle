const { generateSudoku } = require('./generator');
const { solveSudoku } = require('./solver');
const { isBoardValid } = require('./validator');

module.exports = {
    generateSudoku,
    solveSudoku,
    isBoardValid
};