const IS_DIST = false;  // TODO: npm build 할 때 is_dist = true로 변경

export class Exception extends Error {
    suggestion: string | undefined;
    location: string;

    constructor(message: string, suggestion?: string) {
        super(message);
        this.name = this.constructor.name;
        this.suggestion = suggestion;
        this.location = this.stack ? '\n' + this.stack.split('\n').slice(1).join('\n') : 'No stack trace available';
    }

    toString() {
        const separator = '\n\n';

        let result: string;

        if (!IS_DIST) {
            const reset = '\x1b[0m';
            const red = '\x1b[31m';
            const yellow = '\x1b[33m';
            const cyan = '\x1b[36m';
            const bold = '\x1b[1m';

            result = `${bold}${red}${this.name}:${reset} ${this.message}${separator}` + `${bold}${cyan}Location:${reset} ${this.location}`;
            
            if (this.suggestion)
                result += `${separator}${bold}${yellow}Suggestion:${reset} ${this.suggestion}`;
        }
        else {
            result = `${this.name}: ${this.message}${separator}` + `Location: ${this.location}`;
            
            if (this.suggestion)
                result += `${separator}Suggestion: ${this.suggestion}`;
        }

        return result;
    }
}

export class TypeException extends Exception {
    constructor(value: any, type: string, suggestion?: string) {
        super(`Expected ${type}, got ${value}`, suggestion);
    }
}
