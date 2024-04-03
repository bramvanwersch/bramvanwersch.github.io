import { SESSION } from "./session";

export class Directory{
    
    name: string
    parent: Directory | null
    directories: Directory[]
    files: File[]

    constructor(name: string, parent: Directory | null){
        this.name = name;
        this.parent = parent;
        this.directories = [];
        this.files = [];
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
        let paths = [
            "/home/bram/repos",
            "/home/anonymous",
            "/etc",
        ]
        for (let path of paths){
            let parts = path.split("/").slice(1);
            let dir = this.root;
            let  new_dir;
            let current_path = "";
            for (let part of parts){
                current_path += `/${part}`;
                new_dir = new Directory(part, dir);                
                this.path_mapping.set(current_path, new_dir);
                dir.directories.push(new_dir);
                dir.add_directory(part);
                dir = new_dir;
            }
        }
    }

    get_path(path: string): string | undefined{
        path = path.replace("~", `/home/${SESSION.current_user}`);
        if (this.path_mapping.get(path) === undefined){
            return undefined;
        }
        return path;
    }
}

export let FILE_TREE: FileTree = new FileTree();

export let CURRENT_PATH: string = "~/";
