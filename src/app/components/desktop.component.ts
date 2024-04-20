import { Component, OnInit } from '@angular/core';
import { DesktopIconComponent } from './desktop-icon.component';
import { TerminalComponent } from "./terminal.component";
import { SESSION } from '../src/session';
import { DualJumperGameComponent } from "./dual_jumper_game.component";
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-desktop',
    standalone: true,
    template: `
        <div id="main-desktop">
            <div id="desktop-body">
                <img id="background-image" src="assets/thebackofthejack.jpg" class="unselectable">
                <app-desktop-icon (open_window_event)="open_window($event)" [name]="'Terminal'" [position]="0" [image]="'assets/terminal-icon.svg'">
                </app-desktop-icon>
                <app-terminal *ngIf="is_visible('Terminal')">
                </app-terminal>
                <app-desktop-icon (open_window_event)="open_window($event)" [name]="'Dual-jumper'" [position]="1" [image]="'assets/dual-jumper-icon.png'">
                </app-desktop-icon>
                <app-dual-jumper-game *ngIf="is_visible('Dual-jumper')">
                </app-dual-jumper-game>
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
            height:48px;
            position: absolute;
            top: 1;
            left: 1;
        }
    `,
    imports: [
        NgIf,
        DesktopIconComponent,
        TerminalComponent,
        DualJumperGameComponent
    ]
}
)
export class DesktopComponent implements OnInit{
    
    ngOnInit(): void {
        this.open_window("Terminal");
    }

    open_window(name: string){
        SESSION.set_visibility(name, true);
    }

    is_visible(name: string): boolean {        
        return SESSION.get_visibility(name);
    }
}

