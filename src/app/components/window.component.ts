import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SESSION } from '../src/session';

@Component({
    selector: 'app-window',
    standalone: true,
    imports: [
        NgStyle,
    ],
    template: `
        <div class="window" [ngStyle]="{width: width, height: height, display: get_display()}" [id]="windown_unique_id">
            <div class="window-top-bar" [id]="top_unique_id">
                <div class="window-name">
                    {{ name }}
                </div>
                <div class="top-button close-button" (click)="close_window()">
                    X
                </div>
                <div class="top-button minimize-button" (click)="hide_window()">
                    -
                </div>
            </div>
            <ng-content selector=".window-content" class="internal-window">
            </ng-content>
        </div>
    `,
    styles: `
        .window{
            position: absolute;
            display: flex;
            flex-direction: column;
            background-color: lightgrey;
            top: 10%;
            left: 10%;
        }

        .top-button{
            cursor: pointer;
            text-align: center;
            position: absolute;
            height: 18px;
            width: 18px;
            border-style: solid;
            border-radius: 3px;
            border-color: black;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .minimize-button{
            top: 3px;
            right: 30px;
        }

        .window-top-bar{
            background-color: grey;
            height: 30px;
            min-height: 30px;
        }

        .window-name{
            display: flex;
            margin-left: 10px;
            flex-direction: column;
            height: 100%;
            justify-content: center;
        }

        .close-button{
            top: 3px;
            right: 3px;
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
        let window = SESSION.windows.get(this.name);
        if (!window){
            return
        }
        window.open_window(false);
    }

    get_display(): string{
        let window = SESSION.windows.get(this.name);
        if (!window){
            return 'none';
        }        
        if (window.visible){
            return 'flex';
        }
        return 'none';
    }

    hide_window(){
        let window = SESSION.windows.get(this.name);
        if (!window){
            return
        }
        window.visible = false;
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

