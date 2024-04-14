import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SESSION, Session } from '../src/session';

@Component({
    selector: 'app-window',
    standalone: true,
    imports: [
        NgStyle
    ],
    template: `
        <div class="window" [ngStyle]="{width: width, height: height, display: get_visibility()}" [id]="windown_unique_id">
            <div class="window-top-bar" [id]="top_unique_id">
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
            min-height: 30px;
        }

        .close-button{
            cursor: pointer;
            text-align: center;
            position: absolute;
            top: 3px;
            right: 3px;
            height: 18px;
            width: 18px;
            border-style: solid;
            border-radius: 3px;
            border-color: black;     
            background-color: red;
        }
    `}
)
export class WindowComponent implements OnInit {

    @Input() height!: string;
    @Input() width!: string;
    @Input() name!: string;

    top_unique_id: string
    windown_unique_id: string

    @Output() close_window_event = new EventEmitter<string>();

    constructor(){
        this.top_unique_id = SESSION.get_unique_id();
        this.windown_unique_id = SESSION.get_unique_id();
    }

    ngOnInit(): void {
        setTimeout(()=>{
            this.set_drag_window();
        }, 0);
    }

    close_window() {
        SESSION.set_visibility(this.name, false);
    }

    get_visibility(): string {
        return SESSION.get_visibility(this.name);
    }

    set_drag_window() {
        // https://www.w3schools.com/howto/howto_js_draggable.asp
        var element = document.getElementById(this.windown_unique_id);
        if (element == null){
            console.log('ow noo, dragging is not working.');
            return;
        }
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let top_element = document.getElementById(this.top_unique_id);
        
        if (top_element){
            top_element.onmousedown = dragMouseDown;
        }
        
        function dragMouseDown(event: MouseEvent) {
            event.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = event.clientX;
            pos4 = event.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(event: MouseEvent) {
            event.preventDefault();
            if (element == null){
                console.log('ow noo, dragging is not working.');
                return;
            }
            // calculate the new cursor position:
            pos1 = pos3 - event.clientX;
            pos2 = pos4 - event.clientY;
            pos3 = event.clientX;
            pos4 = event.clientY;
            // set the element's new position:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

