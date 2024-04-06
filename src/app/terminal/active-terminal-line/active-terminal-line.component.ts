import { Component, EventEmitter, Output } from '@angular/core';
import { COMMAND_MAPPING } from '../command_definitions';
import { LineType, TerminalLineOutput } from '../output_lines';
import { SESSION } from '../session';

@Component({
    selector: 'app-active-terminal-line',
    standalone: true,
    imports: [],
    template: `
  <div>
    <div id="active-line">
        <label id="acitve-line-pre">{{ prefix }}</label>
        <input type="text" id="active-line-input" class="terminal-styling" autofocus spellcheck="false" (keyup.enter)="onEnter($event)" (keydown.Tab)="autocomplete($event)">
    </div>
  </div>
  `,
    styles: `
    #active-line-input{
      margin: 0;
      padding: 0;
      border: none;
      outline-width: 0;
      outline: none;
      overflow: hidden;
      resize: none;
      width: calc(100% - 130px);
      color: var(--response-color);
  }

  #active-line{
      width: 100%;
      display: flex;
      align-items: flex-start;
  }

  #active-line-pre{
      
  }
`})
export class ActiveTerminalLineComponent {

    @Output() terminalCommandEvent = new EventEmitter<string>();
    @Output() emit_line_event = new EventEmitter<TerminalLineOutput>();

    prefix: string

    constructor() {
        this.prefix = SESSION.get_prefix();
    }

    onEnter(event: Event) {
        let value = (event.target as HTMLInputElement).value;
        if (value === "") {
            return;
        }
        (event.target as HTMLInputElement).value = "";
        this.terminalCommandEvent.emit(value);
        this.prefix = SESSION.get_prefix();
    }

    autocomplete(event: Event) {
        event.preventDefault();
        let value = (event.target as HTMLInputElement).value;
        let matched = [];
        for (let key in COMMAND_MAPPING) {
            if (key.startsWith(value)) {
                matched.push(key);
            }
        }
        if (matched.length === 1) {
            (event.target as HTMLInputElement).value = matched[0];
        }
        else if (matched.length > 1) {
            this.emit_line_event.emit(new TerminalLineOutput([value], LineType.COMMAND));
            this.emit_line_event.emit(new TerminalLineOutput([matched.join("&nbsp&nbsp&nbsp&nbsp")]));
        }
    }
}
