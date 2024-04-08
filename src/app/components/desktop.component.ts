import { Component} from '@angular/core';
import { DesktopIconComponent } from './desktop-icon.component';
import { WindowComponent } from './window.component';
import { TerminalComponent } from "./terminal.component";

@Component({
    selector: 'app-desktop',
    standalone: true,
    template: `
        <div id="main-desktop">
            <img id="background-image" src="assets/thebackofthejack.jpg" class="unselectable">
            <app-desktop-icon (open_window_event)="open_window($event)" [name]="'Terminal'">
            </app-desktop-icon>
            <app-terminal [visibility]="'visible'">
            </app-terminal>
            <div id="bottom-border">
                <img id="desktop-icon" src="assets/grid-3x3-gap-fill.svg">
            </div>
        </div>
    `,
    styles: `
        #main-desktop{
            display: flex;
            position: relative;
            flex-direction: column;
            height: 100%;
            background-color: black;
        }

        #background-image{
            max-width: 100%;
            height: 100%;
        }

        #bottom-border{
            position: relative;
            height: 50px;
            background-color: grey;
        }

        #desktop-icon{
            height:45px;
            width: 45px;
            position: absolute;
            top: 0;
            left: 0;
        }
    `,
    imports: [
        DesktopIconComponent,
        TerminalComponent
    ]
}
)
export class DesktopComponent {

    window_visibilty: Map<string, string>

    constructor(){
        this.window_visibilty = new Map();
        this._add_program("Terminal");
    }

    _add_program(name: string){
        this.window_visibilty.set(name, "hidden")
    }

    open_window(event: string){
        this.window_visibilty.set(event, 'visible');
    }

    close_window(event: string){
        this.window_visibilty.set(event, 'hidden');
    }

    get_visibility(key: string): string{
        let value = this.window_visibilty.get(key);
        if (value === undefined){
            throw "Invalid desktop icon name provided";
        }
        return value;
    }

}

