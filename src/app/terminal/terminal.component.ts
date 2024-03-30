import { Component } from '@angular/core';
import { TerminalLineComponent } from './terminal-line/terminal-line.component';
import { NgFor } from '@angular/common';
import { Command } from '../command';
import { ActiveTerminalLineComponent } from './active-terminal-line/active-terminal-line.component';

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
  lines: Command[] = [new Command("testing", "a test value"), new Command("tost", "wow there buddy, relax...")];

  addCommand(event: string){
    this.lines.push(new Command(event, ""));
  }

}
