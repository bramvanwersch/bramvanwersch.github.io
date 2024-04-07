import { Component, OnInit } from '@angular/core';
import { TerminalLineComponent } from './terminal-line.component';
import { NgFor } from '@angular/common';
import { LineType, TerminalLineOutput } from '../src/output_lines';
import { ActiveTerminalLineComponent } from './active-terminal-line.component';
import { COMMAND_MAPPING } from '../src/command_definitions';

@Component({
    selector: 'app-terminal',
    standalone: true,
    imports: [
        TerminalLineComponent,
        ActiveTerminalLineComponent,
        NgFor
    ],
    template: `
    <div class="terminal">
      <div class="terminal-internal terminal-styling">
          <div class="official-message-box">
              <div>
                  <div class="welcome-message">
                      Welcome to the website of Bram van Wersch. From here you can find all sorts of things about my work, but only if you look hard enough.
                  </div>
                  <div>
                      > SSH session to anomymous&#64;web
                  </div>
                  <ul>
                      <li>
                          SSH compression: <span class="good">V</span>
                      </li>
                      <li>
                          SSH-browser: <span class="good">V</span>
                      </li>
                      <li>
                          X11-forwarding: <span class="error">X</span>
                      </li>
                  </ul>
              </div>
          </div>
          <app-terminal-line *ngFor="let line of lines" [line]="line">
          </app-terminal-line>
          <app-active-terminal-line (terminalCommandEvent)="run_command($event)" (emit_line_event)="add_message($event)">
          </app-active-terminal-line>
      </div>
    </div>
  `,
    styles: `
    .terminal{
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .terminal-internal{
        padding: 5px;
        flex-grow: 1;
        border-style: solid;
        border-radius: 3px;
        border-color: rgb(112, 109, 109);
    }

    .official-message-box{
        border-width: 2px;
        margin: 5px;
        padding: 10px;
        border-style: solid;
        border-color: rgb(112, 109, 109);
    }

    .welcome-message{
        color: var(--response-color);
        text-align: center;
        margin-bottom: 20px;
    }
  `
})
export class TerminalComponent implements OnInit {

    lines: TerminalLineOutput[]

    constructor() {
        this.lines = [];
    }

    ngOnInit(): void {
        this.run_command("help");
    }

    run_command(input: string) {
        let parts = this._get_arguments(input);
        let command = COMMAND_MAPPING[parts[0]];
        this.lines.push(new TerminalLineOutput([input], LineType.COMMAND))
        if (command === undefined) {
            this.lines.push(new TerminalLineOutput([`Unknown command '${parts[0]}'`], LineType.ERROR))
        } else {
            this.lines.push(command.call(parts.slice(1)));
        }
    }

    add_message(event: TerminalLineOutput) {
        this.lines.push(event);
    }

    _get_arguments(input: string): string[] {
        return input.split(/[ ,]+/);
    }
}
