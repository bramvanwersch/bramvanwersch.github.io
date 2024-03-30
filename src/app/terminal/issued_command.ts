export class IssuedCommand {

    response: string;
    command: string;
    is_error: boolean;

    constructor(command: string, response: string = "", is_error: boolean = false){
        this.command = command;
        this.response = response;
        this.is_error = is_error;
    }

    set_error(error: string){
        this.response = error;
        this.is_error = true;
    }
}
