const { generateSudoku, getDifficultyLevels } = require('./generator');
const { solveSudoku } = require('./solver');
const { SudokuGameManager } = require('./gameManager');
const { CliColors, CliBox } = require('./cliUtils');

class WindowsCompatibleSudokuGame {
    constructor() {
        this.gameManager = new SudokuGameManager();
        this.inputBuffer = '';
        this.setupGame();
    }

    setupGame() {
        this.gameManager.clearScreen();
        
        // ASCII Art Title
        const title = [
            CliColors.title('  ███████╗██╗   ██╗██████╗  ██████╗ ██╗  ██╗██╗   ██╗'),
            CliColors.title('  ██╔════╝██║   ██║██╔══██╗██╔═══██╗██║ ██╔╝██║   ██║'),
            CliColors.title('  ███████╗██║   ██║██║  ██║██║   ██║█████╔╝ ██║   ██║'),
            CliColors.title('  ╚════██║██║   ██║██║  ██║██║   ██║██╔═██╗ ██║   ██║'),
            CliColors.title('  ███████║╚██████╔╝██████╔╝╚██████╔╝██║  ██╗╚██████╔╝'),
            CliColors.title('  ╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝'),
            '',
            CliColors.subtitle('         🧩 Welcome to Interactive Sudoku! 🧩'),
            '',
            `${CliColors.info('Type')} ${CliColors.highlight('"help"')} ${CliColors.info('for commands or')} ${CliColors.highlight('"start"')} ${CliColors.info('to begin a new game.')}`
        ].join('\n');
        
        console.log(title);
        console.log(CliBox.drawSeparator(60, '═'));
        
        this.gameManager.onTimerUpdate = (elapsedTime) => {
            // Update timer display in title bar (non-intrusive)
            process.title = `Sudoku - ${this.gameManager.formatTime(elapsedTime)}`;
        };
        
        this.showPrompt();
        this.setupInputHandling();
    }

    setupInputHandling() {
        // Set up raw input handling for Windows
        process.stdin.setEncoding('utf8');
        process.stdin.setRawMode(true);
        
        let inputLine = '';
        
        process.stdin.on('data', (key) => {
            const char = key.toString();
            
            // Handle special keys
            if (char === '\u0003') { // Ctrl+C
                this.cleanup();
                process.exit(0);
            } else if (char === '\r' || char === '\n') { // Enter
                if (inputLine.trim()) {
                    console.log(); // New line
                    this.handleCommand(inputLine.trim());
                    inputLine = '';
                } else {
                    console.log();
                    this.showPrompt();
                }
            } else if (char === '\u007f' || char === '\b') { // Backspace
                if (inputLine.length > 0) {
                    inputLine = inputLine.slice(0, -1);
                    // Clears the line from the cursor to the end and then redraws the prompt and input
                    process.stdout.clearLine(0);
                    process.stdout.cursorTo(0);
                    this.showPrompt();
                    process.stdout.write(inputLine);
                }
            } else if (char >= ' ') { // Printable characters
                inputLine += char;
                process.stdout.write(char);
            }
        });
        
        // Handle process termination
        process.on('SIGINT', () => {
            this.cleanup();
            process.exit(0);
        });
    }

    showPrompt() {
        process.stdout.write('🎮 > ');
    }

    handleCommand(input) {
        const parts = input.toLowerCase().split(' ');
        const command = parts[0];

        try {
            switch (command) {
                case 'start':
                case 'new':
                    this.startNewGame(parts);
                    break;
                    
                case 'move':
                case 'm':
                    this.makeMove(parts);
                    break;
                    
                case 'clear':
                case 'c':
                    this.clearCell(parts);
                    break;
                    
                case 'show':
                case 's':
                case 'board':
                case 'display':
                    this.refreshDisplay();
                    break;
                    
                case 'hint':
                case 'h':
                    this.gameManager.getHint();
                    break;
                    
                case 'stats':
                case 'statistics':
                case 'status':
                    this.gameManager.showStats();
                    break;
                    
                case 'pause':
                case 'p':
                case 'resume':
                    this.togglePause();
                    break;
                    
                case 'reset':
                case 'r':
                case 'restart':
                    this.gameManager.reset();
                    this.gameManager.displayBoard();
                    break;
                    
                case 'solve':
                case 'auto':
                    this.autoSolve();
                    break;
                    
                case 'difficulties':
                case 'diff':
                case 'levels':
                    this.showDifficulties();
                    break;
                    
                case 'help':
                case '?':
                case 'commands':
                    this.gameManager.showHelp();
                    break;
                    
                case 'cls':
                    this.refreshDisplay();
                    break;
                    
                case 'quit':
                case 'exit':
                case 'q':
                    this.confirmQuit();
                    return;
                    
                default:
                    if (input) {
                        console.log(CliColors.warning(`❓ Unknown command: "${input}"`));
                        console.log(CliColors.info(`Type ${CliColors.highlight('"help"')} for available commands.`));
                    }
            }
        } catch (error) {
            console.log(CliColors.error(`❌ Error: ${error.message}`));
        }

        this.showPrompt();
    }

    startNewGame(parts) {
        let difficulty = 'medium';
        let size = 9;
        
        if (parts.length > 1) {
            difficulty = parts[1];
        }
        if (parts.length > 2) {
            size = parseInt(parts[2]);
        }
        
        // Validate difficulty
        const validDifficulties = getDifficultyLevels().map(d => d.key);
        if (!validDifficulties.includes(difficulty)) {
            console.log(CliColors.error(`❌ Invalid difficulty: "${difficulty}"`));
            console.log(CliColors.info(`Available difficulties: ${CliColors.highlight(validDifficulties.join(', '))}`));
            return;
        }
        
        // Validate size
        if (![9, 16].includes(size)) {
            console.log(CliColors.error('❌ Invalid size. Available sizes: 9, 16'));
            return;
        }
        
        console.log(CliColors.info(`🎲 Generating ${CliColors.highlight(difficulty)} ${CliColors.highlight(size + 'x' + size)} puzzle...`));
        
        // Generate puzzle
        setTimeout(() => {
            const puzzle = generateSudoku(size, difficulty);
            this.gameManager.startGame(puzzle, difficulty, size);
            this.gameManager.displayBoard();
            console.log(CliColors.success(`🎮 Game started! Type ${CliColors.highlight('"help"')} for commands.`));
        }, 500);
    }

    makeMove(parts) {
        if (parts.length !== 4) {
            console.log(CliColors.error('❌ Usage: move <row> <col> <value>'));
            console.log(CliColors.dim('   Example: move 1 3 5'));
            return;
        }
        
        const row = parseInt(parts[1]) - 1;
        const col = parseInt(parts[2]) - 1;
        const value = parseInt(parts[3]);
        
        if (isNaN(row) || isNaN(col) || isNaN(value)) {
            console.log(CliColors.error('❌ Please provide valid numbers'));
            return;
        }
        
        if (row < 0 || row >= this.gameManager.size || col < 0 || col >= this.gameManager.size) {
            console.log(CliColors.error(`❌ Row and column must be between 1 and ${this.gameManager.size}`));
            return;
        }
        
        if (this.gameManager.makeMove(row, col, value)) {
            if (this.gameManager.checkCompletion()) {
                setTimeout(() => {
                    console.log(CliColors.info(`\nWould you like to play again? Type ${CliColors.highlight('"start"')} for a new game!`));
                }, 2000);
                return;
            }
        }
    }

    clearCell(parts) {
        if (parts.length !== 3) {
            console.log(CliColors.error('❌ Usage: clear <row> <col>'));
            console.log(CliColors.dim('   Example: clear 1 3'));
            return;
        }
        
        const row = parseInt(parts[1]) - 1;
        const col = parseInt(parts[2]) - 1;
        
        if (isNaN(row) || isNaN(col)) {
            console.log(CliColors.error('❌ Please provide valid numbers'));
            return;
        }
        
        this.gameManager.makeMove(row, col, 0);
    }

    togglePause() {
        if (this.gameManager.isPaused) {
            this.gameManager.resumeTimer();
        } else {
            this.gameManager.pauseTimer();
        }
    }

    refreshDisplay() {
        this.gameManager.clearScreen();
        this.gameManager.drawHeader();
        this.gameManager.displayBoard();
    }

    autoSolve() {
        console.log(CliColors.warning('⚠️  This will auto-solve the puzzle. Type "yes" to confirm:'));
        // For now, just show the warning - full implementation would need async input
        console.log(CliColors.info('Auto-solve feature needs confirmation input - use original version for this feature.'));
    }

    showDifficulties() {
        const levels = getDifficultyLevels();
        let difficultyContent = CliColors.title('DIFFICULTY LEVELS') + '\n\n';
        
        levels.forEach((level, index) => {
            const stars = '⭐'.repeat(index + 1) + '☆'.repeat(7 - index - 1);
            difficultyContent += `${CliColors.highlight((index + 1) + '.')} ${CliColors.bold(level.name.padEnd(10))} ${stars}\n`;
            difficultyContent += `   ${CliColors.dim(level.description)}\n\n`;
        });
        
        difficultyContent += CliColors.info('💡 Usage: ') + CliColors.highlight('start <difficulty> [size]') + '\n';
        difficultyContent += CliColors.dim('   Example: start expert 9');
        
        console.log(CliBox.drawBox(difficultyContent, '', 70));
    }

    confirmQuit() {
        console.log(CliColors.warning('Are you sure you want to quit? (y/n)'));
        // For simplicity, just exit - full implementation would need input handling
        this.cleanup();
        process.exit(0);
    }

    cleanup() {
        if (process.stdin.setRawMode) {
            process.stdin.setRawMode(false);
        }
        this.gameManager.close();
    }
}

module.exports = { WindowsCompatibleSudokuGame };