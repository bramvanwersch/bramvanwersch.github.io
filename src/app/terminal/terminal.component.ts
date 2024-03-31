import { Component, OnInit } from '@angular/core';
import { TerminalLineComponent } from './terminal-line/terminal-line.component';
import { NgFor } from '@angular/common';
import { LineType, TerminalLineOutput } from './output_lines';
import { ActiveTerminalLineComponent } from './active-terminal-line/active-terminal-line.component';
import { COMMAND_MAPPING } from './command_definitions';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [
    TerminalLineComponent,
    ActiveTerminalLineComponent,
    NgFor
  ],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})
export class TerminalComponent implements OnInit {

  lines: TerminalLineOutput[]

  constructor(){

    this.lines = [];
  }

  ngOnInit(): void {
    this.run_command("help");
  }

  run_command(input: string) {
    let parts = this._get_arguments(input);
    let command = COMMAND_MAPPING[parts[0]];
    this.lines.push(new TerminalLineOutput([parts[0]], LineType.COMMAND))
    if (command === undefined) {
      this.lines.push(new TerminalLineOutput([`Unknown command '${parts[0]}'`], LineType.ERROR))
    } else {
      this.lines.push(command.call(parts.slice(1)));
    }
  }

  add_message(event: string){
    this.lines.push()
  }

  _get_arguments(input: string): string[] {
    return input.split(/[ ,]+/);
  }
}
