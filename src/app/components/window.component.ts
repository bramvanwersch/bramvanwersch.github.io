import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-window',
    standalone: true,
    imports: [
        NgStyle
    ],
    template: `
        <div class="window" [ngStyle]="{width: width, height: height, visibility: visibility}">
            <div class="window-top-bar">
                <div class="close-button" (click)="close_window()">
                    X
                </div>
            </div>
            <ng-content selector=".window-content">
            </ng-content>
        </div>
    `,
    styles: `
        .window{
            position: absolute;
            background-color: lightgrey;
            height: 10px;
            width: 10px;
            top: 100px;
            left: 100px;
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
    @Input() visibility: string = "visible";

    @Output() close_window_event = new EventEmitter<string>();

    close_window(){
        this.close_window_event.emit(this.name);    
    }
}

