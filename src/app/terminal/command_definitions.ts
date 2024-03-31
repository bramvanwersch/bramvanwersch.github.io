import { Command } from "./command";
import { TerminalLineOutput } from "./output_lines";


export const COMMAND_MAPPING: { [key: string]: Command } = {
    "help": new Command("help", help_func, "show help message for all current commands"),
    "cd": new Command("cd", cd_func, "move to another directory"),
    "about": new Command("about", about_func, "show some information about the author of this website")
}

function help_func(parts: string[]): TerminalLineOutput {
    let help_text = ["These are all the available commands:"];

    for (let key in COMMAND_MAPPING) {
        let command = COMMAND_MAPPING[key];
        help_text.push(`- ${key}: ${command.help_text}\n`);
    }
    return new TerminalLineOutput(help_text);
}

function cd_func(input: string[]): TerminalLineOutput {
    return new TerminalLineOutput(["Not implemented"]);

}

function about_func(input: string[]): TerminalLineOutput {
    return new TerminalLineOutput(
        [`Hey there I'm Bram and I love to write software, both for a living and in my free time. From web applications to 
          complicated algorithms to simple automation scripts. The most interesting things are when I can learn something new 
          (hence I wrote this website in angular instead of something I already know). I have a background in biology and 
          still find the topic very interesting. This is why I currently work at <a href="https://www.genomescan.nl" target="_blank">GenomeScan</a>,
          a DNA sequencing company, as a software developer.`, '<br>', `In my free time I program all sorts of things, mainly things related to video games. 
          Since these impose interesting challenges and are generally very different from my work duties.`]);
}
