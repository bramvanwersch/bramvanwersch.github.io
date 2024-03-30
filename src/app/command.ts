export class Command {

    response: string;
    command: string;

    constructor(command: string, response: string){
        this.command = command;
        this.response = response;
    }
}
