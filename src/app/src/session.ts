

export class Session{

    current_dir: string
    current_user: string
    window_visibility: Map<string, string>
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

    get_unique_id(): string{
        return `my-website-id-${this.current_id_counter++}`;
    }
}

export const SESSION = new Session();