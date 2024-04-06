import { SESSION } from "./session";

export class Directory{
    
    name: string
    parent: Directory | null
    directories: Directory[]
    files: File[]
    path: string

    constructor(name: string, parent: Directory | null){
        this.name = name;
        this.parent = parent;
        this.directories = [];
        this.files = [];
        this.path = this.parent == null ? "" : `${this.parent.path}/${this.name}`;
    }

    add_file(name: string, data: string){
        this.files.push(new File(name, this, data));
    }

    add_directory(name: string){
        this.directories.push(new Directory(name, this));
    }
}


export class File{

    name: string
    parent: Directory
    data: string

    constructor(name: string, parent: Directory, data: string){
        this.name = name;
        this.parent = parent;
        this.data = data;
    }

}

export class FileTree{

    root: Directory
    path_mapping: Map<string, Directory>

    constructor(){
        this.root = new Directory("/", null);
        this.path_mapping = new Map();
        this._init_tree();
    }

    _init_tree(){
        let parts = {
                "home": {
                    "bram": {
                        "repos": {}
                    },
                    "anonymous": {}
                },
                "etc": {}
        }
        this.path_mapping.set("", this.root)
        // ¯\_(ツ)_/¯
        this.path_mapping.set("/", this.root)
        this._add_init_tree(parts, this.root)
        console.log(this.root);
        
    }

    _add_init_tree(obj: Record<string, any>, parent: Directory){
        for (let key in obj){
            let new_dir = new Directory(key, parent);
            this.path_mapping.set(new_dir.path, new_dir);
            parent.directories.push(new_dir);
            this._add_init_tree(obj[key], new_dir)
        }

    }

    get_directory(path: string): Directory | undefined{
        return this._resolve_path(path);
    }

    _resolve_path(path: string): Directory | undefined{
        let current_dir = SESSION.current_dir.replace("~", this._get_home_path());
        
        path = path.replace("~", this._get_home_path());

        path = path.replace("..", this._get_parent_path(current_dir));
        
        path = path.replace(".", current_dir);
                
        if (!path.startsWith("/") && path != ''){
            path = `${SESSION.current_dir}/${path}`;
        }

        return this.path_mapping.get(path);
    }

    _get_parent_path(current_dir: string): string{
        let parent = this.path_mapping.get(current_dir)?.parent
        if (parent == null){
            return "/";
        }
        return parent.path;
    }

    _get_home_path(): string{
        return `/home/${SESSION.current_user}`
    }
}

export let FILE_TREE: FileTree = new FileTree();
