export enum LineType{
    MESSAGE = 0,  // message to the user from the system about a command that was requested
    COMMAND = 1,  // message about the commnand the user executed
    ERROR = 2,  // error occured
}


export class TerminalLineOutput {

    lines: string[]
    type: LineType

    constructor(lines: string[], type: LineType = LineType.MESSAGE){
        this.lines = lines;
        this.type = type;
    }

    as_html(): string[]{
        switch (this.type){
            case LineType.ERROR: {
                let total = [];
                for (let line of this.lines){
                    total.push(`<div class="error" [innerHTML]="${line}"></div>`);
                }
                console.log(total);
                
                return total;
            }
            case LineType.COMMAND: {
                return [`<div>anomymous&#64;web: ~/>${this.lines[0]}</div>`]
            }
            case LineType.MESSAGE: {
                let total = [];
                for (let line of this.lines){
                    total.push(`<div [innerHTML]="${line}"></div>`);
                }
                return total;
            }
            default: {
                throw "Invalid type provided";
            }
        }
    }
}
