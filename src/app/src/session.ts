

export class Session{

    current_dir: string
    current_user: string
    window_visibility: Map<string, string>

    constructor(){
        this.current_user = "anonymous"
        this.current_dir = `~`;
        this.window_visibility = new Map();
    }

    get_prefix(): string{
        return `${SESSION.current_user}@web: ${SESSION.current_dir}/>`;
    }

    get_visibility(name: string): string{
        let value = this.window_visibility.get(name);
        if (!value){
            return 'none';
        }
        return value;
    }

    set_visibility(name: string, value: boolean){
        let set_value = 'none';
        if (value){
            set_value = 'flex';
        }
        this.window_visibility.set(name, set_value);
    }
}

export const SESSION = new Session();