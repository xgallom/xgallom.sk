export const Content = {
  type: 'grub',
  title: 'GRUB  version 2.04',
  entries: [
    {
      enabled: true,
      skipBoot: false,
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
          '- xoxo Milan %Fg%',
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
          '%Fg%',
        ],
        manPages: [
          {
            name: 'man',
            sections: [
              {
                title: 'Manual pager utils',
                content: [
                  {
                    type: 'section',
                    title: 'NAME',
                    content: [{type: 'paragraph', content: ['man - an interface to the system reference manuals']}],
                  },
                  {
                    type: 'section',
                    title: 'SYNOPSIS',
                    content: [{
                      type: 'paragraph', content: [
                        '%BrightRed%man%Fg% [%BrightGreen%section%Fg%] %BrightGreen%page%Fg%'
                      ]
                    }],
                  },
                  {
                    type: 'section',
                    title: 'DESCRIPTION',
                    content: [{
                      type: 'paragraph', content: [
                        '%BrightRed%man%Fg% is the system\'s manual pager.  %BrightGreen%Page%Fg% argument given to ' +
                        '%BrightRed%man%Fg% is normally the name of a ' +
                        'program, utility or function.  The %BrightGreen%manual page%Fg% associated with each of these arguments is ' +
                        'then found and displayed.  A %BrightGreen%section%Fg%, if provided, will direct ' +
                        '%BrightRed%man%Fg% to look only in that %BrightGreen%section%Fg% of the manual.  ' +
                        'If omitted, first %BrightGreen%section%Fg% of the manual is displayed.',
                      ]
                    }],
                  },
                  {
                    type: 'section',
                    title: 'EXAMPLES',
                    content: [{
                      type: 'list', content: [
                        {
                          entry: '%BrightRed%man%Fg% %BrightGreen%man%Fg%',
                          content: [{
                            type: 'paragraph', content: [
                              'Display the manual page for the %BrightGreen%item%Fg% (program) %BrightGreen%man%Fg%.'
                            ]
                          }]
                        },
                        {
                          entry: '%BrightRed%man%Fg% %BrightGreen%man%Fg%.%BrightGreen%1%Fg%',
                          content: [{
                            type: 'paragraph', content: [
                              'Display the manual page for the %BrightGreen%item man%Fg% in section %BrightGreen%1%Fg%.'
                            ]
                          }]
                        },
                        {
                          entry: '%BrightRed%man%Fg% %BrightGreen%1%Fg% %BrightGreen%man%Fg%',
                          content: [{
                            type: 'paragraph', content: [
                              'Display the manual page for the %BrightGreen%item man%Fg% in section %BrightGreen%1%Fg%.'
                            ]
                          }]
                        },

                      ]
                    }],
                  },
                ],
              }
            ],
          },
          {
            name: 'xos',
            sections: [
              {
                title: 'XOS Development Blog - Introduction',
                content: [
                  {
                    type: 'section',
                    title: 'NAME',
                    content: [{type: 'paragraph', content: ['XOS Development Blog - Introduction']}],
                  },
                  {
                    type: 'section',
                    title: 'HAIL FRIEND, WELCOME TO MY ABYSS',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          'Welcome to my blog, my name is Milan, and I\'ve been interested in low-level programming ever ' +
                          'since I was little. I\'ve made some simple emulators, an 8chip one, and an unfinished one for GBA.',
                          '',
                          'I\'ve done my fair share of C++ programming, and I have some experience in commercial C++ projects. ' +
                          'XOS is my attempt to get deeper understanding of how this whole "PC" thing works, and to give myself an opportunity ' +
                          'to study an amazing field of computer science: The Binary Operations Abyss. It can also give me a niche edge ' +
                          'on the software industry landscape, but that\'s not remotely as amazing.',
                          '',
                          'I want this blog to contain mostly interesting findings I learn along the way, with my perspective ' +
                          'on the solution implementation, and explanation of how I understand the problem, along with some gay jokes.',
                          '',
                          'Before we start, I should put out a small disclaimer: This blog series covers an enormous topic, ',
                          'and assumes that you have basic understanding of computers and modern personal computer architecture. If you have ' +
                          'at any point no idea what I\'m talking about, feel free to just google some wikipedia articles ' +
                          'to get a crude understanding of what is going on, and then continue. There\'s no shame in the game, ' +
                          'that\'s how I learned, and that\'s how your next door neighbour Laszlo taught himself how to knit ' +
                          'that disturbing turkish carpet he\'s hanged over your corridor wall.',
                          '',
                          'Some topics that you should definitely have sorted out prior, or sort them out along the way include:',
                          'Binary arithmetic, Boolean algebra, surface level electromagnetism/electronics, logic gates.'
                        ],
                      }
                    ],
                  },
                  {
                    type: 'section',
                    title: 'CHANGE IN HARDWARE AND WHAT IT BRINGS',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          'As time progresses, personal computer systems get gradually more complex to push the limits ' +
                          'of state of the art computing capabilities.',
                          'This push towards the next generation is obfuscated by the fact that new CPUs have to be backwards ' +
                          'compatible with the previously released processors, making the new capabilities weirdly stacked on ' +
                          'top of existing systems. Sadly, there exists no hardware update capability as it does with software. ' +
                          'Metal upgrades tend to be costly and require an actual physical replacement.',
                          'This isn\'t such an issue with for example CPU sockets or motherboard bus interfaces - after some time ' +
                          'the new hardware simply becomes incompatible with the old components and the computer has to be replaced as a whole.',
                          '',
                          'Since software is distributed in compiled binary format, it\'s impossible to do this with CPU internals. ' +
                          'New CPUs have to be ABI compatible with previous versions, otherwise getting an x64 CPU would block you out of all ' +
                          '32-bit software, which still has to evolve to support the new architecture of the system.',
                          'One solution would be for every software publisher to provide binaries for every possible CPU ' +
                          'architecture, or source based distribution, but one is cumbersome, and the other is unacceptable for commercial and security purposes.',
                          '',
                          'This splits CPU improvements into two categories - small incremental changes which provide a ' +
                          'specific variation of an existing or newly introduced feature, and huge leaps in system ' +
                          'architecture which break the previous ABI compatibility but have to be enabled.',
                          'An example of the former is addition of registers for hardware floating point computation, ' +
                          'the latter includes jumps between CPU 16-bit, 32-bit and 64-bit modes.',
                          'Since the new CPU has to be able to still run old code in the legacy mode, the internals have to be a superset ' +
                          'of previous architecture. Since previous architecture has to be backwards compatible as well, ' +
                          'we end up with a chain of backwards compatible opt-in modes, and when you first start your computer, your ' +
                          '64-bit 8 core 4 GHz processor is backwards compatible with Intel 8086, which is considered ' +
                          'as the father of the PC system, was released in 1978, and had between 5 MHz to 10 MHz with a 16-bit architecture.',
                          '',
                          'This reflects in how registers work. General purpose registers, which were also in the 8086 - A, B, C, D, ' +
                          'have 16-bit variants AX, BX, CX, DX. With introduction of Intel 80386, these registers were extended to 32-bits: ' +
                          'EAX, EBX, ECX, EDX. 64-bit processors again extended these ones, with RAX, RBX, RCX and RDX.',
                          '',
                          'These registers are of course implemented in hardware as a single register, and storing a value ' +
                          'in one changes the value of all the registers. Following image shows how the registers are laid out:',
                        ],
                      },
                      {
                        type: 'text_image',
                        content: [
                          '                               RAX HW Register                                   ',
                          '╔═════════════════════════════════════╦═══════════════════╦══════════╦══════════╗',
                          '║ 00110000 10001000 11001001 01111010 ║ 10101100 00101100 ║ 10100111 ║ 01010010 ║',
                          '╚═════════════════════════════════════╩═══════════════════╩══════════╩══════════╝',
                          '│                                     │                   │          │          │',
                          '│                                     │                   │  AH [8b] │  AL [8b] │',
                          '│                                     │                   ├──────────┴──────────┤',
                          '│                                     │                   │                     │',
                          '│                                     │                   │      AX  [16b]      │',
                          '│                                     │                   └─────────────────────┤',
                          '│                                     │                                         │',
                          '│                                     │               EAX [32b]                 │',
                          '│                                     └─────────────────────────────────────────┤',
                          '│                                                                               │',
                          '│                                 RAX [64b]                                     │',
                          '└───────────────────────────────────────────────────────────────────────────────┘',

                        ],
                      },
                      {
                        type: 'paragraph',
                        content: [
                          'Your computer starts in so called "16-bit Real Mode". This is basically exactly how 8086 operated. ' +
                          'In this mode, you only have access to AL, AH and AX registers, and being able to use the 32-bit ' +
                          'wide EAX requires transferring the CPU to "Protected Mode". This is the process I mentioned before, ' +
                          'where you give the CPU a sign that you know that your software is not targeted for a 16-bit machine, ' +
                          'all hell breaks loose and the endless Ouroboros of progress swallows any pride you had left from your ' +
                          'High school Microprocessor Architecture class.',
                          '',
                          'This elusive mode is so intricate compared to the Real Mode, and so hard to comprehend to my mere mortal soul, ' +
                          'that it changes everything from memory mapping, segmentation, interrupt handling, to adding entirely new sets of registers, ' +
                          'for example the hardware floating point ones.',
                          '',
                          'If you don\'t understand some of these terms yet, don\'t worry, each of these topics has to be tackled with ' +
                          'when creating an OS, and every single one will be explained in this series, either as a separate chapter or just a paragraph.',
                        ],
                      }
                    ],
                  },
                  {
                    type: 'section',
                    title: 'A BRIEF HISTORY OF CPU ARCHITECTURES',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          'In this section, we will be looking on the history of CPUs, selecting the biggest breaktroughs.',
                        ],
                      },
                      {
                        type: 'list',
                        content: [
                          {
                            entry: '%BrightRed%- 1950s         : The Beginning%White%',
                            content: [
                              {
                                type: 'paragraph',
                                content: [
                                  'Nothing was standardized, every design was unique and non compatible.' +
                                  'Computers ran programs from punching tapes and were the size of yo momma\'s credit card debt.',
                                ],
                              }
                            ],
                          },
                          {
                            entry: '%BrightRed%- 1960s         : Start of Computer Revolution%White%',
                            content: [
                              {
                                type: 'paragraph',
                                content: [
                                  'First attempts for standardization, introduction of the Complex Instruction Set Computer.',
                                ],
                              }
                            ],
                          },
                          {
                            entry: '%BrightRed%- 1970s         : First Microprocessors and Computer Revolution%White%',
                            content: [
                              {
                                type: 'paragraph',
                                content: [
                                  'Invention of MOSFET transistors, decomposition of systems to separate parts (RAM, ROM, registers, CPU). ' +
                                  'Intel starting production of CPUs, as they were previously primarily a memory manufacturer.',
                                  'Introduction of Intel 8086 - the 16-bit grandfather of modern CPUs, from which comes the abbreviation x86.',
                                  'x86 basically means "8 something 86", whether it\'s i386, i486, i686 - 80386, 80486 and 80686 respectively.'
                                ],
                              }
                            ],
                          },
                          {
                            entry: '%BrightRed%- 1980s/1990s   : RISC and Parallelism%White%',
                            content: [
                              {
                                type: 'paragraph',
                                content: [
                                  'Slow transition to RISC architecture, instruction level parallelism, branch prediction, out of order execution.',
                                  'This is where the fun stops, understanding personal computers is still fairly common due to lack of software ' +
                                  'infrastructure, but the systems are getting more and more complex. Golden era of software development.',
                                  'Introduction of Intel 80386 - the first 32-bit processor which introduced protected mode, with 12 to 40 MHz clock frequency, ' +
                                  'ability to address up to 4 GB of ram and 9 32-bit, and 7 16-bit registers.',
                                  'Father of the i386 architecture.',
                                  'Introduction of Intel 80686 - Pentium Pro, 150 to 200 MHz single core CPU from late 90s.'
                                ],
                              }
                            ],
                          },
                          {
                            entry: '%BrightRed%- 2000s/present : Going multi-core%White%',
                            content: [
                              {
                                type: 'paragraph',
                                content: [
                                  'More incomprehensible bullshit introduced. First multi-core processor, transition to x64 architecture.',
                                  'Intel Core 2 Duo - Dual core, ~1 GHz clock, 64-bit microarchitecture.',
                                  'From 2007 forward, only people with beards could develop low-level software.'
                                ],
                              }
                            ],
                          },
                        ],
                      }
                    ],
                  },
                  {
                    type: 'section',
                    title: 'CLOSING REMARKS',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          'In the next part of the series, we will look on the basic XOS setup, toolchain, build process, and first Hello World ' +
                          'program in unforgiving coldness of bare-metal software.',
                          '',
                          'Let\'s just say that you have nothing. No standard library, no threading, no memory allocation.',
                          'Output to the monitor is done purely by manipulating old VGA standard hardware on your machine.',
                          '',
                          'Hope you liked this first introduction to the world of OS Development, please send me feedback on ' +
                          'social media, email, or any cyber platform you particularly enjoy. I know the site is cumbersome to deal ' +
                          'with, but you made it this far, and honestly, what is wrong about having a little fun along the way? ' +
                          'I absolutely loved making this platform, and from the bottom of my heart hope that you will grow to love it as well.',
                          '',
                          'Signed-off-by: Milan Gallo <gallo.milan.jr@gmail.com>',
                        ],
                      }
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      enabled: true,
      title: 'Playground (contentless)',
      type: 'linux_boot',
      system: {
        type: 'linux_shell',
      },
    },
  ],
};

