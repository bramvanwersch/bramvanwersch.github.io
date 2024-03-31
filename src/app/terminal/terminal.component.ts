import { Component, OnInit } from '@angular/core';
import { TerminalLineComponent } from './terminal-line/terminal-line.component';
import { NgFor } from '@angular/common';
import { IssuedCommand } from './issued_command';
import { ActiveTerminalLineComponent } from './active-terminal-line/active-terminal-line.component';
import { cd_func, about_func } from './command_definitions';
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
export class TerminalComponent implements OnInit {

  command_mapping: { [key: string]: Command }
  lines: IssuedCommand[]

  constructor(){
    this.command_mapping = {
      "cd": new Command("cd", cd_func, "move to another directory"),
      "help": new Command("help", this._help_func, "show help message for all current commands"),
      "about": new Command("about", about_func, "show some information about the author of this website")
    }
    this.lines = [];
  }

  ngOnInit(): void {
    this.addCommand("help");
  }

  addCommand(input: string) {
    let parts = this._get_arguments(input);
    let command = this.command_mapping[parts[0]];
    let issued_command = new IssuedCommand(input);
    if (command === undefined) {
      issued_command.set_error(`Unknown command '${parts[0]}'`);
    } else {
      command.call(parts.slice(1), issued_command);
    }
    this.lines.push(issued_command);
  }

  _get_arguments(input: string): string[] {
    return input.split(/[ ,]+/);
  }

  _help_func = (parts: string[], issued_command: IssuedCommand) =>{
    let help_text = ["These are all the available commands:"];
    console.log(this.command_mapping);
    
    for (let key in this.command_mapping){
      console.log(key);
      
      let command = this.command_mapping[key];
      help_text.push(`- ${key}: ${command.help_text}\n`);
    }
    issued_command.response = help_text;
  }
}
