

export class Session{

    current_dir: string
    current_user: string
    windows: Map<string, MyWindow>
    current_id_counter: number

    constructor(){
        this.windows = new Map();
        this.windows.set('Terminal', new MyWindow('Terminal', 'assets/terminal-icon.svg'));
        this.windows.set('Dual-jumper', new MyWindow('Dual-jumper', 'assets/dual-jumper-icon.png'));
        this.current_user = "anonymous"
        this.current_dir = `~`;
        this.current_id_counter = 0;
    }

    get_prefix(): string{
        return `${SESSION.current_user}@web: ${SESSION.current_dir}/>`;
    }

    get_unique_id(): string{
        return `my-website-id-${this.current_id_counter++}`;
    }
}


export class MyWindow{

    visible: boolean
    _open: boolean
    icon: string
    name: string

    constructor(name: string, icon: string, open: boolean = false, visible: boolean = false){
        this.name = name;
        this.icon = icon;
        this._open = open;
        this.visible = visible;
    }

    open_window(state: boolean){
        this._open = state;
        this.visible = state
    }
}


export const SESSION = new Session();
