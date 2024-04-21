import { SESSION } from "./session";

export enum LineType{
    MESSAGE = 0,  // message to the user from the system about a command that was requested
    COMMAND = 1,  // message about the commnand the user executed
    ERROR = 2,  // error occured
}


export class TerminalLineOutput {

    lines: string[]
    type: LineType
    prefix: string

    constructor(lines: string[], type: LineType = LineType.MESSAGE){
        this.lines = lines;
        this.type = type;
        this.prefix = "";
        if (this.type === LineType.COMMAND){
            this.prefix = SESSION.get_prefix();
        }
    }
}