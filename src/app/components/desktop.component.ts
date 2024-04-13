import { Component} from '@angular/core';
import { DesktopIconComponent } from './desktop-icon.component';
import { TerminalComponent } from "./terminal.component";
import { SESSION } from '../src/session';

@Component({
    selector: 'app-desktop',
    standalone: true,
    template: `
        <div id="main-desktop">
            <div id="desktop-body">
                <img id="background-image" src="assets/thebackofthejack.jpg" class="unselectable">
                <app-desktop-icon (open_window_event)="open_window($event)" [name]="'Terminal'">
                </app-desktop-icon>
                <app-terminal>
                </app-terminal>
            </div>
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
            width: 100%;
            overflow: hidden;
            background-color: black;
        }

        #desktop-body{
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        #background-image{
            flex-grow: 1;
        }

        #bottom-border{
            position: absolute;
            bottom: 0;
            height: 50px;
            width: 100%;
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

    open_window(name: string){
        SESSION.set_visibility(name, true);
    }
}

