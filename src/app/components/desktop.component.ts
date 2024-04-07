import { Component} from '@angular/core';
import { DesktopIconComponent } from './desktop-icon.component';
import { WindowComponent } from './window.component';

@Component({
    selector: 'app-desktop',
    standalone: true,
    imports: [
        DesktopIconComponent,
        WindowComponent
    ],
    template: `
        <div id="main-desktop">
            <img id="background-image" src="assets/thebackofthejack.jpg" class="unselectable">
            <app-desktop-icon (open_window_event)="open_window($event)">
            </app-desktop-icon>
            <app-window [height]="'500px'" [width]="'500px'" [visibility]="get_visibility('terminal')" (close_window_event)="close_window($event)">
            </app-window>
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
    `}
)
export class DesktopComponent {

    window_visibilty: Map<string, string>

    constructor(){
        this.window_visibilty = new Map();
        this.window_visibilty.set("terminal", "hidden")
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

