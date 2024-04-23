import { Component, OnInit } from '@angular/core';
import { DesktopIconComponent } from './desktop-icon.component';
import { TerminalComponent } from "./terminal.component";
import { MyWindow, SESSION } from '../src/session';
import { DualJumperGameComponent } from "./dual_jumper_game.component";
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-desktop',
    standalone: true,
    template: `
        <div id="main-desktop">
            <div id="desktop-body">
                <img id="background-image" src="assets/thebackofthejack.jpg" class="unselectable">
                <app-desktop-icon *ngFor="let window of all_windows(); index as i" [name]="window.name" [position]="i" [image]="window.icon">
                </app-desktop-icon>
                <app-terminal *ngIf="is_visible('Terminal')">
                </app-terminal>
                <app-dual-jumper-game *ngIf="is_visible('Dual-jumper')">
                </app-dual-jumper-game>
            </div>
            <div id="bottom-border">
                <div>
                    <img class="bottom-icon" src="assets/grid-3x3-gap-fill.svg">
                </div>
                <div *ngFor="let window of all_windows()">
                    <img class="bottom-icon" [src]="window.icon" *ngIf="window._open" (click)="show_window(window.name)">
                </div>
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
            display: flex;
            bottom: 0;
            height: 50px;
            width: 100%;
            background-color: grey;
        }

        .bottom-icon{
            margin-right: 5px;
            margin-top: 5px;
            height:40px;
        }
    `,
    imports: [
        NgIf,
        NgFor,
        DesktopIconComponent,
        TerminalComponent,
        DualJumperGameComponent
    ]
})
export class DesktopComponent implements OnInit{


    constructor(){
    }

    ngOnInit(): void {
    }

    all_windows(): Array<MyWindow>{
        return Array.from(SESSION.windows.values());
    }

    
    show_window(name: string){
        let window = SESSION.windows.get(name);
        if (!window){
            return
        }
        window.visible = true;
    }

    is_visible(name: string): boolean {
        let window = SESSION.windows.get(name);
        if (!window){
            return false;
        }
        return window._open
    }
}
