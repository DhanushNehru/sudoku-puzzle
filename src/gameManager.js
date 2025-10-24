const readline = require('readline');
const { CliColors, CliBox, CliProgress } = require('./cliUtils');
const { solveSudoku } = require('./solver');
const { isBoardValid } = require('./validator');

class SudokuGameManager {
    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.pausedTime = 0;
        this.isPaused = false;
        this.strictMode = false; // Off by default for immediate feedback
        this.timerInterval = null;
        this.onTimerUpdate = null;
        this.currentBoard = null;
        this.originalBoard = null;
        this.solutionBoard = null; // Store the solved puzzle
        this.difficulty = 'medium';
        this.size = 9;
        this.moves = 0;
        this.hints = 3;
        this.lastHintCell = null;
        this.errors = [];
        
        // Setup readline interface for console input
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    clearScreen() {
        console.clear();
        // Alternative for systems that don't support console.clear()
        process.stdout.write('\x1B[2J\x1B[0f');
    }

    drawHeader() {
        const title = '🧩 SUDOKU PUZZLE GAME 🧩';
        const stats = this.getGameStats();
        
        console.log(CliColors.title(CliBox.drawSeparator(60, '═')));
        console.log(CliColors.title(title.padStart(35).padEnd(60)));
        console.log(CliColors.title(CliBox.drawSeparator(60, '═')));
        
        // Game status bar
        const statusLine = [
            `${CliColors.highlight('⏱️')} ${CliColors.bold(stats.formattedTime)}`,
            `${CliColors.highlight('📊')} ${CliColors.bold(stats.difficulty.toUpperCase())}`,
            `${CliColors.highlight('🎯')} ${CliColors.bold(stats.moves)} moves`,
            `${CliColors.highlight('💡')} ${CliColors.bold(stats.hints)} hints`
        ].join('  │  ');
        
        console.log(CliColors.info('┌' + '─'.repeat(58) + '┐'));
        console.log(CliColors.info('│') + ` ${statusLine} ` + CliColors.info('│'));
        console.log(CliColors.info('└' + '─'.repeat(58) + '┘'));
        
        if (this.isPaused) {
            console.log(CliColors.warning(CliBox.drawBox('⏸️  GAME PAUSED', '', 60)));
        }
    }

    startGame(board, difficulty = 'medium', size = 9) {
        this.currentBoard = JSON.parse(JSON.stringify(board));
        this.originalBoard = JSON.parse(JSON.stringify(board));
        this.difficulty = difficulty;
        this.size = size;
        this.moves = 0;
        this.hints = 3;
        this.errors = [];
        this.startTime = Date.now();
        this.endTime = null;
        this.pausedTime = 0;
        this.isPaused = false;
        this.startTimer();
        
        // Generate and store the solution for hints
        this.solutionBoard = JSON.parse(JSON.stringify(board));
        solveSudoku(this.solutionBoard, size);

        this.clearScreen();
        this.drawHeader();
        
        // Welcome message
        const welcomeMsg = [
            `🎮 ${CliColors.success('Game Started!')}`,
            `📏 Board Size: ${CliColors.highlight(size + 'x' + size)}`,
            `📊 Difficulty: ${CliColors.highlight(difficulty.toUpperCase())}`,
            `💡 Hints Available: ${CliColors.highlight(this.hints)}`,
            `⏱️  Timer: ${CliColors.success('Started!')}`
        ].join('\n');
        
        console.log(CliBox.drawBox(welcomeMsg, 'GAME SETUP', 50));
        console.log();
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            if (!this.isPaused && this.onTimerUpdate) {
                this.onTimerUpdate(this.getElapsedTime());
            }
        }, 1000);
    }

    pauseTimer() {
        if (!this.isPaused && this.startTime) {
            this.isPaused = true;
            // Add the time from the last active session to the total paused/played time
            this.pausedTime += Date.now() - this.startTime;
            this.startTime = null; // Nullify startTime to stop accumulation in getElapsedTime
            this.clearScreen();
            this.drawHeader();
            console.log(CliColors.warning('\n⏸️  Game paused - Type "resume" or "pause" to continue'));
        }
    }

    resumeTimer() {
        if (this.isPaused) {
            this.isPaused = false;
            // Set a new start time for the current active session
            this.startTime = Date.now();
            this.clearScreen();
            this.drawHeader();
            this.displayBoard();
            console.log(CliColors.success('▶️  Game resumed'));
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.startTime && !this.endTime) {
            this.endTime = Date.now();
            // Add the final session's time to the total
            this.pausedTime += this.endTime - this.startTime;
            this.startTime = null;
        }
    }

    getElapsedTime() {
        // Start with the total time from all previous sessions
        let elapsed = this.pausedTime;
        
        // If the game is currently running, add the time from the current active session
        if (!this.isPaused && this.startTime) {
            elapsed += Date.now() - this.startTime;
        }
        
        return Math.floor(elapsed / 1000);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    makeMove(row, col, value) {
        if (this.originalBoard[row][col] !== 0) {
            console.log(CliColors.error('❌ Cannot modify original numbers!'));
            return false;
        }
        
        if (value < 0 || value > this.size) {
            console.log(CliColors.error(`❌ Invalid value! Use 0-${this.size}`));
            return false;
        }
        
        this.currentBoard[row][col] = value;
        this.moves++;
        
        // Clear any previous error for this cell
        this.errors = this.errors.filter(e => !(e.row === row && e.col === col));
        
        if (value === 0) {
            console.log(CliColors.info(`🗑️  Cleared cell (${row + 1}, ${col + 1})`));
        } else {
            console.log(CliColors.success(`✏️  Set (${row + 1}, ${col + 1}) = ${CliColors.bold(value)}`));
            
            // In strict mode, only flag direct rule violations (duplicates).
            if (this.strictMode) {
                if (!this.isValidMove(row, col, value)) {
                    console.log(CliColors.warning('⚠️  Warning: This move creates a duplicate in a row, column, or box!'));
                    this.errors.push({ row, col, value });
                }
            } else {
                // In normal mode, check against the actual solution for immediate feedback.
                if (this.solutionBoard && this.solutionBoard[row][col] !== value) {
                    console.log(CliColors.warning('⚠️  Warning: That is not the correct number for this cell!'));
                    this.errors.push({ row, col, value });
                }
            }
        }
        
        return true;
    }

    isValidMove(row, col, value) {
        // This function is no longer used for interactive move validation (which now checks against the solution board).
        // However, it is still used for board validation in other contexts, such as in isComplete().
        // It checks for duplicates in the row, column, and box for the given value.
        for (let i = 0; i < this.size; i++) {
            if (this.currentBoard[row][i] === value && i !== col) return false; // Check row
            if (this.currentBoard[i][col] === value && i !== row) return false; // Check col
        }

        const sqrt = Math.sqrt(this.size);
        const boxRowStart = row - row % sqrt;
        const boxColStart = col - col % sqrt;

        for (let r = boxRowStart; r < boxRowStart + sqrt; r++) {
            for (let c = boxColStart; c < boxColStart + sqrt; c++) {
                if (this.currentBoard[r][c] === value && r !== row && c !== col) {
                    return false;
                }
            }
        }
        return true;
    }

    getHint() {
        if (this.hints <= 0) {
            console.log(CliColors.warning('💡 No hints remaining!'));
            return false;
        }
        
        if (!this.solutionBoard) {
            console.log(CliColors.error('❌ Solution not available. Cannot provide a hint.'));
            return false;
        }

        // Find first empty cell and give hint from the pre-solved board
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.currentBoard[row][col] === 0) {
                    const hintValue = this.solutionBoard[row][col];
                    
                    const hintMsg = [
                        `💡 ${CliColors.success('HINT!')}`,
                        `Cell (${CliColors.highlight(row + 1)}, ${CliColors.highlight(col + 1)}) should be ${CliColors.bold(hintValue)}`,
                        `Hints remaining: ${CliColors.warning(this.hints - 1)}`
                    ].join('\n');
                    
                    console.log(CliBox.drawBox(hintMsg, 'HINT', 40));
                    
                    this.lastHintCell = { row, col, value: hintValue };
                    this.hints--;
                    return true;
                }
            }
        }
        
        console.log(CliColors.warning('💡 No hints available for current state (board is full or unsolvable).'));
        return false;
    }

    displayBoard() {
        console.log(CliColors.subtitle('\n📋 SUDOKU BOARD'));
        
        const sqrt = Math.sqrt(this.size);
        const isLarge = this.size > 9;
        const cellInnerWidth = isLarge ? 3 : 2; // Width for the number itself
        const cellPadding = 1; // Space on each side of the number
        const cellWidth = cellInnerWidth + cellPadding * 2;
        const boardWidth = this.size * cellWidth + (sqrt - 1);

        // Column headers (1-16 for 16x16)
        let header = '    ';
        for (let i = 0; i < this.size; i++) {
            const colLabel = (i + 1).toString();
            header += CliColors.dim(colLabel.padStart(cellWidth - cellPadding).padEnd(cellWidth));
            if ((i + 1) % sqrt === 0 && i < this.size - 1) {
                header += ' ';
            }
        }
        console.log(header);
        
        // Top border
        const separatorLine = '   ' + CliBox.teeRight + CliBox.horizontal.repeat(boardWidth) + CliBox.teeLeft;
        console.log('   ' + CliBox.topLeft + CliBox.horizontal.repeat(boardWidth) + CliBox.topRight);
        
        for (let row = 0; row < this.size; row++) {
            const rowLabel = (row + 1).toString();
            let rowStr = CliColors.dim(rowLabel.padStart(2)) + ' ' + CliBox.vertical;
            
            for (let col = 0; col < this.size; col++) {
                const value = this.currentBoard[row][col];
                const isOriginal = this.originalBoard[row][col] !== 0;
                const hasError = this.errors.some(e => e.row === row && e.col === col);
                const isHint = this.lastHintCell && this.lastHintCell.row === row && this.lastHintCell.col === col;
                
                let cellDisplay;
                const displayValue = value.toString();

                if (value === 0) {
                    cellDisplay = CliColors.dim(' '.repeat(cellWidth - 1) + '·');
                } else {
                    // Center the value within the cell width
                    const paddedValue = ` ${displayValue.padStart(isLarge ? 2 : 1)} `.padEnd(cellWidth);
                    if (isOriginal) {
                        cellDisplay = CliColors.bold(paddedValue);
                    } else if (hasError) {
                        cellDisplay = CliColors.error(paddedValue);
                    } else if (isHint) {
                        cellDisplay = CliColors.highlight(paddedValue);
                    } else {
                        cellDisplay = CliColors.success(paddedValue);
                    }
                }
                
                rowStr += cellDisplay;

                // Vertical separator
                if ((col + 1) % sqrt === 0 && col < this.size - 1) {
                    rowStr += CliBox.vertical;
                }
            }
            rowStr += CliBox.vertical;
            console.log(rowStr);
            
            // Horizontal separator
            if ((row + 1) % sqrt === 0 && row < this.size - 1) {
                console.log(separatorLine);
            }
        }
        
        // Bottom border
        console.log('   ' + CliBox.bottomLeft + CliBox.horizontal.repeat(boardWidth) + CliBox.bottomRight);
        
        // Legend
        const legendItems = [
            `${CliColors.bold('●')} Original`,
            `${CliColors.success('●')} Your input`,
            `${CliColors.error('●')} Invalid`,
            `${CliColors.highlight('●')} Hint`,
            `${CliColors.dim('●')} Empty`
        ];
        
        const legend = legendItems.join(' │ ');
        
        console.log(CliColors.dim('\n   Legend: ' + legend));
        
        // Progress indicator
        const filledCells = this.currentBoard.flat().filter(cell => cell !== 0).length;
        const totalCells = this.size * this.size;
        const progressMsg = `Progress: ${CliProgress.progressBar(filledCells, totalCells)} (${filledCells}/${totalCells} cells)`;
        console.log('\n   ' + progressMsg);
    }

    toggleStrictMode() {
        this.strictMode = !this.strictMode;
        if (this.strictMode) {
            console.log(CliColors.warning('🟡 Strict Mode ON: Only direct rule violations will be flagged.'));
        } else {
            console.log(CliColors.success('✅ Strict Mode OFF: Incorrect numbers will be flagged immediately.'));
        }
    }

    isComplete() {
        // A board is complete if it's full and follows all Sudoku rules.
        // This includes checking for duplicates in rows, columns, and boxes.
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const value = this.currentBoard[i][j];
                if (value === 0) {
                    return false; // Empty cell found
                }
                
                // Temporarily remove the value for validation
                this.currentBoard[i][j] = 0;
                
                // Check if the value is unique in its row, column, and box
                if (!this.isValidMove(i, j, value)) {
                    this.currentBoard[i][j] = value; // Restore the value
                    return false; // Duplicate found
                }
                
                // Restore the value
                this.currentBoard[i][j] = value;
            }
        }
        
        return true;
    }

    checkCompletion() {
        if (this.isComplete()) {
            this.stopTimer();
            const stats = this.getGameStats();
            
            this.clearScreen();
            
            // Celebration animation
            console.log(CliColors.success('\n🎉'.repeat(20)));
            
            const congratsMsg = [
                `🏆 ${CliColors.success('PUZZLE COMPLETED!')} 🏆`,
                '',
                `⏱️  Time: ${CliColors.bold(stats.formattedTime)}`,
                `📊 Difficulty: ${CliColors.bold(stats.difficulty.toUpperCase())}`,
                `🎯 Total Moves: ${CliColors.bold(stats.moves)}`,
                `💡 Hints Used: ${CliColors.bold(3 - stats.hints)}`,
                `📏 Board Size: ${CliColors.bold(stats.size + 'x' + stats.size)}`,
                '',
                `${CliColors.highlight('Congratulations on solving this puzzle!')}`
            ].join('\n');
            
            console.log(CliBox.drawBox(congratsMsg, 'VICTORY!', 60));
            
            // Performance rating
            const rating = this.calculateRating(stats);
            console.log(CliBox.drawBox(`Your Performance: ${rating.stars}\n${rating.message}`, 'RATING', 60));
            
            console.log(CliColors.success('🎉'.repeat(20) + '\n'));
            
            return true;
        }
        return false;
    }

    calculateRating(stats) {
        const timeBonus = stats.elapsedTime < 300 ? 2 : stats.elapsedTime < 600 ? 1 : 0;
        const hintPenalty = (3 - stats.hints) * 0.5;
        const difficultyBonus = {
            'beginner': 1, 'easy': 2, 'medium': 3, 'hard': 4, 'expert': 5, 'master': 6, 'extreme': 7
        }[stats.difficulty] || 3;
        
        const score = Math.max(1, Math.min(5, difficultyBonus + timeBonus - hintPenalty));
        
        const ratings = {
            5: { stars: '⭐⭐⭐⭐⭐', message: 'LEGENDARY! Perfect solve!' },
            4: { stars: '⭐⭐⭐⭐☆', message: 'EXCELLENT! Great job!' },
            3: { stars: '⭐⭐⭐☆☆', message: 'GOOD! Nice work!' },
            2: { stars: '⭐⭐☆☆☆', message: 'DECENT! Keep practicing!' },
            1: { stars: '⭐☆☆☆☆', message: 'COMPLETED! Every solve counts!' }
        };
        
        return ratings[Math.floor(score)] || ratings[3];
    }

    getGameStats() {
        return {
            difficulty: this.difficulty,
            size: this.size,
            elapsedTime: this.getElapsedTime(),
            formattedTime: this.formatTime(this.getElapsedTime()),
            isComplete: this.isComplete(),
            isPaused: this.isPaused,
            moves: this.moves,
            hints: this.hints
        };
    }

    showStats() {
        const stats = this.getGameStats();
        const filledCells = this.currentBoard.flat().filter(cell => cell !== 0).length;
        const totalCells = this.size * this.size;
        const completion = ((filledCells / totalCells) * 100).toFixed(1);
        
        const statsMsg = [
            `⏱️  Time: ${CliColors.bold(stats.formattedTime)}`,
            `📊 Difficulty: ${CliColors.bold(stats.difficulty.toUpperCase())}`,
            `🎯 Moves: ${CliColors.bold(stats.moves)}`,
            `💡 Hints Remaining: ${CliColors.bold(stats.hints)}`,
            `📈 Completion: ${CliColors.bold(completion + '%')}`,
            `⏸️  Status: ${stats.isPaused ? CliColors.warning('PAUSED') : CliColors.success('PLAYING')}`,
            `❌ Errors: ${CliColors.error(this.errors.length)}`
        ].join('\n');
        
        console.log(CliBox.drawBox(statsMsg, 'GAME STATISTICS', 50));
    }

    reset() {
        this.stopTimer();
        this.currentBoard = JSON.parse(JSON.stringify(this.originalBoard));
        this.startTime = Date.now(); // Reset start time
        this.endTime = null;
        this.pausedTime = 0;
        this.isPaused = false;
        this.moves = 0;
        this.hints = 3;
        this.errors = [];
        this.lastHintCell = null;
        
        this.startTimer(); // Restart the timer
        
        this.clearScreen();
        console.log(CliColors.success('🔄 Game reset to initial state'));
        this.drawHeader();
        this.displayBoard();
    }

    showHelp() {
        const helpContent = [
            `${CliColors.title('GAME COMMANDS')}`,
            '',
            `${CliColors.highlight('move <row> <col> <value>')} - Make a move (1-based coordinates)`,
            `${CliColors.highlight('clear <row> <col>')}        - Clear a cell`,
            `${CliColors.highlight('hint')}                     - Get a hint (limited)`,
            `${CliColors.highlight('show')}                     - Display current board`,
            `${CliColors.highlight('stats')}                    - Show game statistics`,
            `${CliColors.highlight('pause')}                    - Pause/resume the game`,
            `${CliColors.highlight('reset')}                    - Reset to initial state`,
            `${CliColors.highlight('solve')}                    - Auto-solve the puzzle`,
            `${CliColors.highlight('mode')}                     - Toggle strict mode (harder)`,
            `${CliColors.highlight('help')}                     - Show this help`,
            `${CliColors.highlight('quit')}                     - Exit the game`,
            '',
            `${CliColors.subtitle('TIPS:')}`,
            `• Use ${CliColors.highlight('0')} to clear: ${CliColors.dim('move 1 3 0')}`,
            `• Original numbers ${CliColors.bold('cannot')} be changed`,
            `• Invalid moves are shown in ${CliColors.error('red')}`,
            `• Hints are shown in ${CliColors.highlight('cyan')}`,
        ].join('\n');
        
        console.log(CliBox.drawBox(helpContent, 'HELP', 70));
    }

    close() {
        this.stopTimer();
        if (this.rl) {
            this.rl.close();
        }
    }
}

module.exports = { SudokuGameManager };