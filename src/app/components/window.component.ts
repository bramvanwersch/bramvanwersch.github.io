import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SESSION, Session } from '../src/session';

@Component({
    selector: 'app-window',
    standalone: true,
    imports: [
        NgStyle
    ],
    template: `
        <div class="window" [ngStyle]="{width: width, height: height, display: get_visibility()}">
            <div class="window-top-bar">
                <div class="close-button" (click)="close_window()">
                    X
                </div>
            </div>
            <ng-content selector=".window-content" class="internal-window">
            </ng-content>
        </div>
    `,
    styles: `
        .window{
            position: absolute;
            flex-direction: column;
            background-color: lightgrey;
            top: 10%;
            left: 10%;
        }

        .window-top-bar{
            background-color: grey;
            height: 30px;
        }

        .close-button{
            float: right;
            cursor: pointer;
            text-align: center;
            height: 20px;
            width: 20px;
            border-style: solid;
            border-radius: 3px;
            border-color: black;     
            background-color: red;
        }
    `}
)
export class WindowComponent {

    @Input() height!: string;
    @Input() width!: string;
    @Input() name!: string;

    @Output() close_window_event = new EventEmitter<string>();

    close_window(){
        SESSION.set_visibility(this.name, false);
    }

    get_visibility(): string{
        return SESSION.get_visibility(this.name);
    }
}

