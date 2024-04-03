

export class Session{

    current_dir: string
    current_user: string

    constructor(){
        this.current_dir = "~/";
        this.current_user = "anonymous"
    }
}

export const SESSION = new Session();