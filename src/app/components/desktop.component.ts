import { Component} from '@angular/core';

@Component({
    selector: 'app-desktop',
    standalone: true,
    imports: [],
    template: `
        <div id="main-desktop">
            <img id="background-image" src="assets/thebackofthejack.jpg">
            <img id="terminal-icon" src="assets/terminal-fill.svg">
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

        #terminal-icon{
            position: absolute;
            
        }

        #background-image{
            max-width: 100%;
            height: 100%;
            user-select: none;
            pointer-events: none;
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

}

