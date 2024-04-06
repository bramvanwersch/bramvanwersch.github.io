import { TerminalLineOutput } from "./output_lines";


export class Command{

    name: string
    function: (input: string[]) => TerminalLineOutput

    help_text: string

    constructor(name: string, func: (input: string[]) => TerminalLineOutput, help_text: string){
        this.name = name;
        this.function = func;
        this.help_text = help_text;
    }

    call(input: string[]): TerminalLineOutput{
        return this.function(input);
    }
}