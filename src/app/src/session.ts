

export class Session{

    current_dir: string
    current_user: string
    window_visibility: Map<string, boolean>
    current_id_counter: number

    constructor(){
        this.current_user = "anonymous"
        this.current_dir = `~`;
        this.window_visibility = new Map();
        this.current_id_counter = 0;
    }

    get_prefix(): string{
        return `${SESSION.current_user}@web: ${SESSION.current_dir}/>`;
    }

    get_visibility(name: string): boolean{
        let value = this.window_visibility.get(name);
        if (!value){
            return false;
        }
        return value;
    }

    set_visibility(name: string, value: boolean){
        this.window_visibility.set(name, value);
    }

    get_unique_id(): string{
        return `my-website-id-${this.current_id_counter++}`;
    }
}

export const SESSION = new Session();