

export class Session{

    current_dir: string
    current_user: string

    constructor(){
        this.current_dir = "~/";
        this.current_user = "anonymous"
    }

    get_prefix(): string{
        return `${SESSION.current_user}@web: ${SESSION.current_dir}>`;
    }
}

export const SESSION = new Session();