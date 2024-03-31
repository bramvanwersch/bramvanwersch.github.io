import { IssuedCommand } from "./issued_command";


export function cd_func(input: string[], issued_command: IssuedCommand){
    issued_command.response = ["Not implemented"];
}

export function about_func(input: string[], issued_command: IssuedCommand){
    issued_command.response = [`Hey there I'm Bram and I love to write software, both for a living and in my free time. From web applications to 
                               complicated algorithms to simple automation scripts. The most interesting things are when I can learn something new 
                               (hence I wrote this website in angular instead of something I already know). I have a background in biology and 
                               still find the topic very interesting. This is why I currently work at <a href="https://www.genomescan.nl" target="_blank">GenomeScan</a>,
                               a DNA sequencing company, as a software developer.`,'<br>',`In my free time I program all sorts of things, mainly things related to video games. 
                               Since these impose interesting challenges and are generally very different from my work duties.`];
}
