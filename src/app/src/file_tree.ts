import { SESSION } from "./session";

export class Directory {

    name: string
    parent: Directory | null
    directories: Directory[]
    files: File[]
    path: string

    constructor(name: string, parent: Directory | null) {
        this.name = name;
        this.parent = parent;
        this.directories = [];
        this.files = [];
        this.path = this.parent == null ? "" : `${this.parent.path}/${this.name}`;
    }

    add_file(name: string, data: string) {
        this.files.push(new File(name, this, data));
    }

    add_directory(name: string) {
        this.directories.push(new Directory(name, this));
    }
}


export class File {

    name: string
    parent: Directory
    data: string
    path: string

    constructor(name: string, parent: Directory, data: string) {
        this.name = name;
        this.parent = parent;
        this.data = data;
        this.path = `${this.parent.path}/${this.name}`;
    }

}

export class FileTree {

    root: Directory
    dir_mapping: Map<string, Directory>
    file_mapping: Map<string, File>

    constructor() {
        this.root = new Directory("/", null);
        this.dir_mapping = new Map();
        this.file_mapping = new Map();
        this._init_tree();
        let self = this;
        fetch('https://api.github.com/users/bramvanwersch/repos').then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            self._add_repos(data)
        }).catch(error => {
            console.error('Failed to get repos:', error);
        });
    }

    _init_tree() {
        let parts = {
            "home": {
                "bram": {
                    "repos": {}
                },
                "anonymous": {}
            },
            "etc": {}
        }
        this.dir_mapping.set("", this.root)
        // ¯\_(ツ)_/¯
        this.dir_mapping.set("/", this.root)
        this._add_init_tree(parts, this.root)
    }

    _add_init_tree(obj: Record<string, any>, parent: Directory) {
        for (let key in obj) {
            let new_dir = new Directory(key, parent);
            this.add_directory(new_dir);
            this._add_init_tree(obj[key], new_dir)
        }
    }

    _add_repos(data: Array<Record<string, any>>) {
        let directory = this.dir_mapping.get("/home/bram/repos");
        if (directory == undefined) {
            return;
        }
        for (let repo_data of data) {
            let new_dir = new Directory(repo_data["name"], directory);
            this.add_directory(new_dir);
            this.add_file(new File("readme.txt", new_dir ,repo_data["description"]));
            this.add_file(new File("language.txt", new_dir ,repo_data["language"]))
        }
    }

    add_directory(directory: Directory) {
        if (directory.parent != null){
            directory.parent.directories.push(directory);
        }
        this.dir_mapping.set(directory.path, directory);
    }

    add_file(file: File) {
        if (file.parent != null){
            file.parent.files.push(file);
        }
        this.file_mapping.set(file.path, file);
    }

    get_directory(path: string): Directory | undefined {
        return this.dir_mapping.get(this._resolve_path(path));
    }

    get_file(path: string): File | undefined{
        return this.file_mapping.get(this._resolve_path(path));

    }

    _resolve_path(path: string): string {
        let current_dir = SESSION.current_dir.replace("~", this._get_home_path());

        path = path.replace("~", this._get_home_path());

        path = path.replace("..", this._get_parent_path(current_dir));

        if (!path.startsWith("/") && path != '') {
            path = `${SESSION.current_dir}/${path}`;
        }
        return path;
    }

    _get_parent_path(current_dir: string): string {
        let parent = this.dir_mapping.get(current_dir)?.parent
        if (parent == null) {
            return "/";
        }
        return parent.path;
    }

    _get_home_path(): string {
        return `/home/${SESSION.current_user}`
    }
}

export let FILE_TREE: FileTree = new FileTree();
