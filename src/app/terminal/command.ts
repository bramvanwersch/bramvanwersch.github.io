import { IssuedCommand } from "./issued_command";


export class Command{

    name: string
    function: (input: string[], issued_command: IssuedCommand) => void
    help_text: string

    constructor(name: string, func: (input: string[], issued_command: IssuedCommand) => void, help_text: string){
        this.name = name;
        this.function = func;
        this.help_text = help_text;
    }

    call(input: string[], issued_command: IssuedCommand){
        this.function(input, issued_command);
    }
}