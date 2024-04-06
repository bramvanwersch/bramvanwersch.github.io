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
        let paths = [
            "/home/bram/repos",
            "/home/anonymous",
            "/etc",
        ]
        this.path_mapping.set("", this.root)
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
        let current_dir = SESSION.current_dir.replace("~", this._get_home_path());
        console.log(current_dir);
        
        path = path.replace("~", this._get_home_path());
        console.log(path);

        path = path.replace("..", this._get_parent_path(current_dir));
        console.log(path);
        
        path = path.replace(".", current_dir);
        console.log(path);
                
        if (!path.startsWith("/") && path != ''){
            path = `${SESSION.current_dir}/${path}`;
        }
        
        if (this.path_mapping.get(path) === undefined){
            return undefined;
        }
        return path;
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
