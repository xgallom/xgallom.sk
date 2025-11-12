import { ManPages } from './man_pages';

export const Blog = {
  enabled: true,
  skipBoot: false,
  bootSpeed: 1.0,
  title: 'Blog',
  type: 'linux_boot',
  system: {
    enabled: true,
    title: 'Blog',
    type: 'linux_shell',
    messageOfTheDay: [
      '%White%Welcome to my blog page!',
      'Please don\'t feel threatened, people used to terminal will feel right at home in here.',
      'If you are completely hopeless, just use the command %BrightBlue%prog%White% to list available commands, ' +
      'and %BrightBlue%help%White% for a short introduction and a list of important command combinations for displaying content.',
      '',
      'I know it\'s a bit bare here, but bear with me, more content is on the way! <3',
      '',
      '2020-05-26: Added mouse wheel support for %BrightBlue%man%White%. You can now scroll through the contents of the page.',
      '2020-05-26: Second xos blog page! read it with %BrightBlue%man %BrightRed% xos%White%.%BrightRed%2%White%.',
      '2020-06-09: Third xos blog page! read it with %BrightBlue%man %BrightRed% xos%White%.%BrightRed%3%White%.',
      '2020-06-11: Third xos blog contest deadline change! From %BrightRed%16.6.2020 18:00%@% to %BrightRed%30.6.2020 23:59:59%@%.',
      '2020-09-26: Fourth xos blog page! read it with %BrightBlue%man %BrightRed%xos%White%.%BrightRed%4%White%. Also found out the mouse wheel is buggy and was only tested on chrome.%Fg%',
    ],
    help: [
      '%White%This blog page is specifically made to resemble my home system, powered by the omnipotent Arch™ Linux® distribution.',
      'Of course this is inaccurate, since I use a window manager, but whoopty-freakin\'-doo, I am not going to implement one here.',
      '',
      'The core of every linux system is its console, which you can in a very simplified manner use here.',
      'Because I did not implement a whole shell, you can not use everything you are used to in one, for example ' +
      'there are no pipes, sub expressions, arithmetic, multiline input, and so on.',
      '',
      'You use the system by entering expressions into the shell prompt, and it interprets them and executes ' +
      'various programs and commands.',
      'To display a list of all available programs, use the %BrightBlue%prog%White% command.',
      '',
      'To read a blog, you can use the linux manual pager. Its name is %BrightBlue%man%White%.',
      'To invoke it, use it with the name of the page you want to view, for example %BrightBlue%man %BrightRed%xos%White%.',
      '',
      'To read a specific blog page, use %BrightBlue%man %BrightRed%xos%White%.%BrightRed%N%White%, where %BrightRed%N%White% is the page number.%Fg%',
    ],
    manPages: ManPages
  }
};
