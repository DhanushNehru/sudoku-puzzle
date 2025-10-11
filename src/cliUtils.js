// CLI Colors and formatting utilities
class CliColors {
    static colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        dim: '\x1b[2m',
        
        // Foreground colors
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        
        // Bright foreground colors
        brightRed: '\x1b[91m',
        brightGreen: '\x1b[92m',
        brightYellow: '\x1b[93m',
        brightBlue: '\x1b[94m',
        brightMagenta: '\x1b[95m',
        brightCyan: '\x1b[96m',
        brightWhite: '\x1b[97m',
        
        // Background colors
        bgBlack: '\x1b[40m',
        bgRed: '\x1b[41m',
        bgGreen: '\x1b[42m',
        bgYellow: '\x1b[43m',
        bgBlue: '\x1b[44m',
        bgMagenta: '\x1b[45m',
        bgCyan: '\x1b[46m',
        bgWhite: '\x1b[47m',
        
        // Bright background colors
        bgBrightRed: '\x1b[101m',
        bgBrightGreen: '\x1b[102m',
        bgBrightYellow: '\x1b[103m',
        bgBrightBlue: '\x1b[104m',
        bgBrightMagenta: '\x1b[105m',
        bgBrightCyan: '\x1b[106m',
        bgBrightWhite: '\x1b[107m'
    };

    static colorize(text, color) {
        return `${this.colors[color] || ''}${text}${this.colors.reset}`;
    }

    static bold(text) {
        return `${this.colors.bright}${text}${this.colors.reset}`;
    }

    static success(text) {
        return this.colorize(text, 'brightGreen');
    }

    static error(text) {
        return this.colorize(text, 'brightRed');
    }

    static warning(text) {
        return this.colorize(text, 'brightYellow');
    }

    static info(text) {
        return this.colorize(text, 'brightBlue');
    }

    static highlight(text) {
        return this.colorize(text, 'brightCyan');
    }

    static dim(text) {
        return `${this.colors.dim}${text}${this.colors.reset}`;
    }

    static title(text) {
        return this.colorize(this.bold(text), 'brightMagenta');
    }

    static subtitle(text) {
        return this.colorize(text, 'cyan');
    }
}

class CliBox {
    static horizontal = '─';
    static vertical = '│';
    static topLeft = '┌';
    static topRight = '┐';
    static bottomLeft = '└';
    static bottomRight = '┘';
    static cross = '┼';
    static teeDown = '┬';
    static teeUp = '┴';
    static teeRight = '├';
    static teeLeft = '┤';

    static drawBox(content, title = '', width = null) {
        const lines = content.split('\n');
        const maxLength = Math.max(...lines.map(line => line.replace(/\x1b\[[0-9;]*m/g, '').length));
        const boxWidth = width || Math.max(maxLength + 4, title.length + 4);
        
        let result = '';
        
        // Top border
        result += this.topLeft + this.horizontal.repeat(boxWidth - 2) + this.topRight + '\n';
        
        // Title
        if (title) {
            const titlePadding = Math.floor((boxWidth - 2 - title.length) / 2);
            result += this.vertical + ' '.repeat(titlePadding) + CliColors.bold(title) + 
                     ' '.repeat(boxWidth - 2 - titlePadding - title.length) + this.vertical + '\n';
            result += this.teeRight + this.horizontal.repeat(boxWidth - 2) + this.teeLeft + '\n';
        }
        
        // Content
        lines.forEach(line => {
            const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '');
            const padding = boxWidth - 2 - cleanLine.length;
            result += this.vertical + line + ' '.repeat(Math.max(0, padding)) + this.vertical + '\n';
        });
        
        // Bottom border
        result += this.bottomLeft + this.horizontal.repeat(boxWidth - 2) + this.bottomRight + '\n';
        
        return result;
    }

    static drawSeparator(width = 50, char = '═') {
        return char.repeat(width);
    }
}

class CliProgress {
    static progressBar(current, total, width = 20, filled = '█', empty = '░') {
        const percentage = Math.round((current / total) * 100);
        const filledWidth = Math.round((current / total) * width);
        const emptyWidth = width - filledWidth;
        
        const bar = CliColors.success(filled.repeat(filledWidth)) + 
                   CliColors.dim(empty.repeat(emptyWidth));
        
        return `${bar} ${percentage}%`;
    }
}

module.exports = { CliColors, CliBox, CliProgress };