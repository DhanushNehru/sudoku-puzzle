const { generateSudoku, getDifficultyLevels } = require('./generator');
const { solveSudoku } = require('./solver');
const { SudokuGameManager } = require('./gameManager');
const { CliColors, CliBox } = require('./cliUtils');
const readline = require('readline');

class InteractiveSudokuGame {
    constructor() {
        this.gameManager = new SudokuGameManager();
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: CliColors.highlight('🎮 > '),
            terminal: false  // This fixes the double character issue on Windows
        });
        
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
            `${CliColors.info('🚀 Quick Start:')}`,
            `   ${CliColors.highlight('start')} ${CliColors.dim('- See all difficulty levels')}`,
            `   ${CliColors.highlight('start medium')} ${CliColors.dim('- Begin a balanced game')}`,
            `   ${CliColors.highlight('help')} ${CliColors.dim('- See all commands')}`,
            ''
        ].join('\n');
        
        console.log(title);
        console.log(CliBox.drawSeparator(60, '═'));
        
        this.gameManager.onTimerUpdate = (elapsedTime) => {
            // Update timer display in title bar (non-intrusive)
            process.title = `Sudoku - ${this.gameManager.formatTime(elapsedTime)}`;
        };
        
        this.rl.prompt();
        this.rl.on('line', (input) => this.handleCommand(input.trim()));
        
        this.rl.on('close', () => {
            this.cleanup();
            console.log(CliColors.success('\n👋 Thanks for playing Sudoku! Come back soon!'));
            this.gameManager.close();
            process.exit(0);
        });
        
        // Handle process termination gracefully
        process.on('SIGINT', () => {
            this.cleanup();
            process.exit(0);
        });
    }
    
    cleanup() {
        if (this.rl) {
            this.rl.removeAllListeners();
            this.rl.close();
        }
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
                    this.confirmAndExecute(
                        'solve',
                        'This will solve the puzzle. Are you sure?',
                        () => {
                            this.gameManager.currentBoard = this.gameManager.solutionBoard;
                            this.gameManager.stopTimer();
                            this.refreshDisplay();
                            console.log(CliColors.success('✅ Puzzle solved!'));
                        }
                    );
                    break;

                case 'mode':
                    this.gameManager.toggleStrictMode();
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
                case 'clear':
                    if (parts.length === 1) {
                        this.refreshDisplay();
                    } else {
                        this.clearCell(parts);
                    }
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

        this.rl.prompt();
    }

    startNewGame(parts) {
        let difficulty = 'medium';
        let size = 9;
        
        // If no difficulty specified, show comprehensive options
        if (parts.length === 1) {
            console.log(CliColors.title('🎯 SUDOKU GAME OPTIONS'));
            console.log('═'.repeat(60));
            console.log();
            
            // Show difficulty levels
            console.log(CliColors.subtitle('📊 DIFFICULTY LEVELS:'));
            console.log();
            const levels = getDifficultyLevels();
            levels.forEach((level, index) => {
                const stars = '⭐'.repeat(index + 1) + '☆'.repeat(7 - index - 1);
                const difficultyName = CliColors.highlight(level.key.padEnd(12));
                console.log(`   ${difficultyName} ${stars} ${CliColors.dim('- ' + level.description)}`);
            });
            
            console.log();
            console.log('═'.repeat(60));
            
            // Show grid size options
            console.log(CliColors.subtitle('� GRID SIZES:'));
            console.log();
            console.log(`   ${CliColors.highlight('9x9'.padEnd(12))} ⬜⬜⬜ ${CliColors.dim('- Classic Sudoku (recommended for beginners)')}`);
            console.log(`   ${CliColors.highlight('16x16'.padEnd(12))} ⬜⬜⬜⬜ ${CliColors.dim('- Large grid (uses numbers 1-16, very challenging)')}`);
            
            console.log();
            console.log('═'.repeat(60));
            
            // Show usage examples
            console.log(CliColors.info('💡 COMMAND EXAMPLES:'));
            console.log();
            console.log(`   ${CliColors.highlight('start beginner')}     ${CliColors.dim('→ Easy 9x9 puzzle (default size)')}`);
            console.log(`   ${CliColors.highlight('start medium')}       ${CliColors.dim('→ Balanced 9x9 puzzle')}`);
            console.log(`   ${CliColors.highlight('start expert')}       ${CliColors.dim('→ Hard 9x9 puzzle')}`);
            console.log(`   ${CliColors.highlight('start medium 16')}    ${CliColors.dim('→ Medium 16x16 puzzle')}`);
            console.log(`   ${CliColors.highlight('start hard 16')}      ${CliColors.dim('→ Hard 16x16 puzzle')}`);
            
            console.log();
            console.log(CliColors.success('🚀 Ready to play? Choose your challenge above!'));
            console.log(CliColors.dim('💡 Tip: Start with "medium" if you\'re new to Sudoku'));
            return;
        }
        
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
            console.log(CliColors.dim('💡 Tip: Type ') + CliColors.highlight('start') + CliColors.dim(' alone to see all difficulty options'));
            return;
        }
        
        // Validate size
        if (![9, 16].includes(size)) {
            console.log(CliColors.error(`❌ Invalid grid size: "${size}"`));
            console.log(CliColors.info('📐 Available grid sizes:'));
            console.log(`   ${CliColors.highlight('9')} - Classic 9x9 Sudoku (uses numbers 1-9)`);
            console.log(`   ${CliColors.highlight('16')} - Large 16x16 Sudoku (uses numbers 1-16)`);
            console.log(CliColors.dim('💡 Tip: Type ') + CliColors.highlight('start') + CliColors.dim(' alone to see all options'));
            return;
        }
        
        // Check if this is a challenging combination
        const isChallengingGeneration = (size === 16 && ['expert', 'master', 'extreme'].includes(difficulty));
        
        if (isChallengingGeneration) {
            console.log(CliColors.warning(`⚠️  WARNING: ${difficulty.toUpperCase()} 16x16 puzzles are extremely complex!`));
            console.log(CliColors.info('   • Generation may take 30-60 seconds'));
            console.log(CliColors.info('   • The puzzle will be very challenging to solve'));
            console.log(CliColors.dim('   💡 Consider trying "medium 16" or "expert 9" first'));
            console.log();
        }
        
        console.log(CliColors.info(`🎲 Generating ${CliColors.highlight(difficulty)} ${CliColors.highlight(size + 'x' + size)} puzzle...`));
        
        // Loading animation
        const loadingChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let i = 0;
        const loadingInterval = setInterval(() => {
            process.stdout.write(`\r${CliColors.info(loadingChars[i % loadingChars.length] + ' Generating puzzle...')}`);
            i++;
        }, 100);
        
        const generatePuzzle = () => {
            try {
                const puzzle = generateSudoku(size, difficulty);
                
                clearInterval(loadingInterval);
                process.stdout.write('\r' + ' '.repeat(50) + '\r');
                
                this.gameManager.startGame(puzzle, difficulty, size);
                this.gameManager.displayBoard();
                
                console.log(CliColors.success(`🎮 Game started! Type ${CliColors.highlight('"help"')} for commands.`));
            } catch (error) {
                clearInterval(loadingInterval);
                process.stdout.write('\r' + ' '.repeat(50) + '\r');
                console.log(CliColors.error(`❌ Failed to generate puzzle: ${error.message}`));
                console.log(CliColors.info('💡 Try a lower difficulty or smaller grid size.'));
            }
        };
        
        // Generate puzzle with timeout protection
        setTimeout(generatePuzzle, 500);
    }

    makeMove(parts) {
        if (parts.length !== 4) {
            console.log(CliColors.error('❌ Usage: move <row> <col> <value>'));
            console.log(CliColors.dim('   Example: move 1 3 5'));
            return;
        }
        
        const row = parseInt(parts[1]) - 1;  // Convert to 0-based
        const col = parseInt(parts[2]) - 1;  // Convert to 0-based
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
                // Game completed - ask for new game
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
        const confirmMsg = [
            CliColors.warning('⚠️  AUTO-SOLVE WARNING ⚠️'),
            '',
            'This will automatically solve the puzzle.',
            'Your current progress will be lost.',
            'This action cannot be undone.',
            '',
            CliColors.dim('Type "yes" to confirm or anything else to cancel.')
        ].join('\n');
        
        console.log(CliBox.drawBox(confirmMsg, 'CONFIRMATION', 50));
        
        this.rl.question(CliColors.warning('Confirm auto-solve (yes/no): '), (answer) => {
            if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                console.log(CliColors.info('🤖 Auto-solving puzzle...'));
                
                // Solving animation
                const solvingChars = ['🔍', '🔎', '🧠', '⚡'];
                let i = 0;
                const solvingInterval = setInterval(() => {
                    process.stdout.write(`\r${solvingChars[i % solvingChars.length]} Solving...`);
                    i++;
                }, 200);
                
                setTimeout(() => {
                    clearInterval(solvingInterval);
                    process.stdout.write('\r' + ' '.repeat(20) + '\r');
                    
                    const solved = solveSudoku(this.gameManager.currentBoard, this.gameManager.size);
                    
                    if (solved) {
                        this.gameManager.stopTimer();
                        this.refreshDisplay();
                        console.log(CliColors.success('✅ Puzzle solved automatically!'));
                        console.log(CliColors.dim('📊 Note: Auto-solve doesn\'t count as completion.'));
                    } else {
                        console.log(CliColors.error('❌ Could not solve the current puzzle state.'));
                    }
                    this.rl.prompt();
                }, 2000);
            } else {
                console.log(CliColors.info('Auto-solve cancelled.'));
                this.rl.prompt();
            }
        });
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
        const quitMsg = [
            CliColors.warning('Are you sure you want to quit?'),
            CliColors.dim('Your current progress will be lost.')
        ].join('\n');
        
        console.log(CliBox.drawBox(quitMsg, 'QUIT GAME', 40));
        
        this.rl.question(CliColors.warning('Quit? (yes/no): '), (answer) => {
            if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                this.rl.close();
            } else {
                console.log(CliColors.success('Welcome back! Continue playing.'));
                this.rl.prompt();
            }
        });
    }
}

module.exports = { InteractiveSudokuGame };