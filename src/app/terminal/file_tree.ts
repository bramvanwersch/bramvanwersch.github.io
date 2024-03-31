
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

export const TREE_ROOT = new Directory("/", null);

export function init_file_tree(){
    let paths = [
        "/home/bram/repos",
        "/home/anonymous",
        "/etc",
    ]
    for (let path of paths){
        let parts = path.split("/");
        console.log(parts);
        
    }

}