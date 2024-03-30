import { Component } from '@angular/core';
import { TerminalLineComponent } from './terminal-line/terminal-line.component';
import { NgFor } from '@angular/common';
import { IssuedCommand } from './issued_command';
import { ActiveTerminalLineComponent } from './active-terminal-line/active-terminal-line.component';
import { cd_func } from './command_definitions';
import { Command } from './command';

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
export class TerminalComponent{

  command_mapping: {[key: string]: Command} = {
    "cd": new Command("cd", cd_func, "move to another directory")
  }

  lines: IssuedCommand[] = [new IssuedCommand("testing", "a test value"), new IssuedCommand("tost", "wow there buddy, relax...")];

  addCommand(input: string){
    let parts = this._get_arguments(input);
    let command = this.command_mapping[parts[0]];
    let issued_command = new IssuedCommand(input);
    if (command === undefined){
      issued_command.set_error(`Unknown command '${parts[0]}'`);
    }else{
      command.call(parts, issued_command);
    }
    this.lines.push(issued_command);
  }

  _get_arguments(input: string): string[]{
    return input.split(/[ ,]+/);
  }
}
