import { Command } from "./command";
import { Directory } from "./file_tree";
import { TerminalLineOutput } from "./output_lines";


export const COMMAND_MAPPING: { [key: string]: Command } = {
    "help": new Command("help", help_func, "show help message for all current commands"),
    "about": new Command("about", about_func, "show some information about the author"),
    "skills": new Command("skills", skill_func, "Show a list of skills of the author"),
    "cd": new Command("cd", cd_func, "move to another directory"),
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

function skill_func(input: string[]): TerminalLineOutput{
    return new TerminalLineOutput(
        [
            `Here is a list of languages/skills that I am comfartably using on a scale from 0 to 9. With 0 being able to write 
            a program with lots of trial and error and 9 being able to write that same program as efficient as possible with no external help.`,
            `<span class="no-space">             0   1   2   3   4   5   6   7   8   9 </span>`,
            `<span class="no-space">            |-------------------------------------|</span>`,
            `<span class="no-space">Python:     |#################################    |</span>`,
            `<span class="no-space"> - Django:  |#############################        |</span>`,
            `<span class="no-space">Java:       |#########################            |</span>`,
            `<span class="no-space">Javascript: |##################                   |</span>`,
            `<span class="no-space"> - Vue:     |################                     |</span>`,
            `<span class="no-space">Rust:       |############                         |</span>`,
            `<span class="no-space">C++:        |############                         |</span>`,
            `<span class="no-space">C:          |############                         |</span>`,
            `<span class="no-space">            |-------------------------------------|</span>`,
        ]
    );
}
