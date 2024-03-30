import { Component, OnInit } from '@angular/core';
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
export class TerminalComponent implements OnInit{
  lines: Command[] = [new Command(), new Command()];

  ngOnInit() {
    for (let line of this.lines){
      line.command = "testing";
      line.response = "wow there buddy relax...";
    }
  }

}
