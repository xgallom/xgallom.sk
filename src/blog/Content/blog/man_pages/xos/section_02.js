export const Section02 = {
  title: 'XOS Development Blog - Hello World',
  content: [
    {
      type: 'section',
      title: 'NAME',
      content: [{type: 'paragraph', content: ['XOS Development Blog - Hello World']}]
    },
    {
      type: 'section',
      title: 'ALAS STRANGER, WE MEET AGAIN',
      content: [
        {
          type: 'paragraph',
          content: [
            'I am very pleased that you\'ve decided to wander back into my pit of bits. We have a lot on the agenda, ' +
            'so let\'s get right to it. ' +
            'Today, I wanted to get to a full x86 hello world, but since my initial setup is kinda complex, it ' +
            'might just get too much-too soon. Should that happen, I will finish this topic in the next episode.',
            '',
            'We will definitely look at some essential information about x86, the toolchain setup, project layout, ' +
            'vga and tty.'
          ]
        }
      ]
    },
    {
      type: 'section',
      title: 'LIGHT SPEED COURSE OF THE X86 ARCHITECTURE',
      content: [
        {
          type: 'paragraph',
          content: [
            'This will not be enough if you\'ve never looked at computer internals. I sincerely suggest that if you ' +
            'get lost, go google these terms. I\'ve said it in the introduction and I am restating it now just to ' +
            'prove how important it is. Do not fear. The whole point of this blog is to show you how interesting and ' +
            'amazing computers actually are, I can not teach you everything you need to know. I want to set you on ' +
            'a path that will guide you towards interesting topics, and provide just enough so that you can connect the ' +
            'dots.',
            '',
            '%BrightRed%Generic x86 computer%White% consists of a motherboard, block devices (DVD and drives), and a ' +
            'power source. We will skip the obvious one: Power supply connects to the motherboard and block devices.',
            '',
            'The core of the motherboard is the PCI bus. There used to be the ISA bus, but it\'s completely ' +
            'obsolete nowadays. On the PCI bus, there are various bridges and shit, but we can skip those. ' +
            'Most importantly, there is the CPU, RAM controller, expansion slots, SATA controller and USB controller.',
            '',
            'The PCIs expansion slots contain plugged in the GPU, sound card, network card, etc. This allows them to ' +
            'interface directly to the CPU through the CPU PCI bridge. SATA controller connects to your block devices, ' +
            'USB controller connects to you front/back panel connectors and therefore your external USB devices.',
            '',
            'At some point in the future, I will have to write a PCI driver, or at least interact with it, so I will ' +
            'save the implementation details for later. But, if you have no idea what a bus is, on hardware level, it\'s ' +
            'basically a bunch of wires, of which each has a name and a purpose. Circuits called controllers and bridges ' +
            'are specifically designed to connect to these wires, and they communicate with other bridges/controllers ' +
            'on the bus through it. On the other side of these circuits there are the actual devices that do something, ' +
            'that can then interact with everything else that\'s on the bus.',
          ]
        },
        {
          type: 'text_image',
          content: [
            '                                                                                 ',
            '                              Motherboard layout                                 ',
            '┌───────────────────────────────────────────────────────────────────────────────┐',
            '│                                                             PCI slots         │',
            '│                  ┌───┐   ┌───┐              SATA                ╥             │',
            '│   ┌───────┐      │RAM├┐ ┌┤RAM│         ╔═█─┴┴┴┴┴┘   ┌───────┐   ║   ┌───────┐ │',
            '│   │       │      └───┘│ │└───┘         ║ SATA ctl   │       ├─┐ ║ ┌─┤       │ │',
            '│   │  CPU  │           ███ RAM ctl      ║            │       ├─┤ ║ ├─┤       │ │',
            '│   │       │      ┌───┐│║│┌───┐         ║    USB     │  GPU  ├─┼─╫─┼─┤  eth  │ │',
            '│   └───┬───┘      │RAM├┘║└┤RAM│         ╠═█─┴┴┴┴┘    │       ├─┤ ║ ├─┤       │ │',
            '│       █ CPU brg  └───┘ ║ └───┘         ║ USB ctl    │       ├─┘ ║ └─┤       │ │',
            '│       ║                ║               ║            └───────┘   ║   └───────┘ │',
            '│ ╞═════╩════════════════╩═══════════════╩════════════════════════╬═══════════╡ │',
            '│                                    PCI bus          ┌───────┐   ║   ┌───────┐ │',
            '│                                                     │       ├─┐ ║ ┌─┤       │ │',
            '│                                                     │       ├─┤ ║ ├─┤       │ │',
            '│                                                     │ sound ├─┼─╫─┼─┤ wi-fi │ │',
            '│                                                     │       ├─┤ ║ ├─┤       │ │',
            '│                                                     │       ├─┘ ║ └─┤       │ │',
            '│                                                     └───────┘   ║   └───────┘ │',
            '│                                                                 ╨             │',
            '└───────────────────────────────────────────────────────────────────────────────┘',
          ]
        },
        {
          type: 'paragraph',
          content: [
            '%BrightRed%CPU%White% does everything through its pinouts into the motherboard  socket. Reading memory, ' +
            'talking to peripherals, loading data from disk, reading clock time. Some of these functionalities ' +
            'can be accessed via CPUs input/output ports (GPIO), some are memory mapped onto some fixed memory address, ' +
            'some can use DMA, some use a combination of these. This is also the answer to the question of how do you ' +
            'do anything on a computer without an operating system. You just construct a program that manages an interface ' +
            'and use that instead.',
            '',
            '%BrightRed%Physical memory%White% maps, as one would grow to expect by now, into low, upper and extended memory. Low is the first 640 kB, ' +
            'accessible from 16-bit Real Mode, and upper memory is 384 kB of memory available from Real Mode with an enabled A-20 line. ' +
            'This line enables 20-bit addressing and was an intermediate step between 16-bit and 32-bit modes. ' +
            'Extended memory (>1MB) is only available in Protected and 64-bit mode.',
            '',
            'When your computer starts, your BIOS loads the first disk sector (512 B) from a drive into low memory and ' +
            'jumps to the start. This sector should contain a boot loader, which loads the operating system.',
          ]
        },
        {
          type: 'text_image',
          content: [
            '                                                                                           ',
            '┌─────────────────────────────────────────────────────────────────────────────────────────┐',
            '│                                 Real Mode Address Space                                 │',
            '├──────────┬──────────┬────────┬─────────────────────────┬────────────────────────────────┤',
            '│ Start    │ End      │ Size   │ Description             │ Type                           │',
            '├──────────┼──────────┼────────┼─────────────────────────┼──────────────────┬─────────────┤',
            '│ 00000000 │ 000003ff │   1 kB │ Interrupt Vector Table  │                  │             │',
            '├──────────┼──────────┼────────┼─────────────────────────┤ Unusable in RM   │             │',
            '│ 00000400 │ 000004ff │ 256  B │ BIOS Data Area          │                  │             │',
            '├──────────┼──────────┼────────┼─────────────────────────┼──────────────────┤             │',
            '│ 00000500 │ 00007bff │  30 kB │ Conventional memory     │                  │             │',
            '├──────────┼──────────┼────────┼─────────────────────────┤                  │ Low Memory  │',
            '│ 00007c00 │ 00007dff │ 512  B │ Boot Loader boot sector │ Usable           │             │',
            '├──────────┼──────────┼────────┼─────────────────────────┤                  │             │',
            '│ 00007e00 │ 0007ffff │ 480 kB │ Conventional memory     │                  │             │',
            '├──────────┼──────────┼────────┼─────────────────────────┼──────────────────┤             │',
            '│ 00080000 │ 0009ffff │ 128 kB │ Extended BIOS Data Area │ Used by EBDA     │             │',
            '├──────────┼──────────┼────────┼─────────────────────────┼──────────────────┼─────────────┤',
            '│ 000a0000 │ 000bffff │ 128 kB │ Video display memory    │ Hardware Mapped  │             │',
            '├──────────┼──────────┼────────┼─────────────────────────┼──────────────────┤             │',
            '│ 000c0000 │ 000c7fff │  32 kB │ Video BIOS              │                  │             │',
            '├──────────┼──────────┼────────┼─────────────────────────┤                  │ High Memory │',
            '│ 000c8000 │ 000effff │ 160 kB │ BIOS Expansions         │ ROM/HW/SR Mapped │             │',
            '├──────────┼──────────┼────────┼─────────────────────────┤                  │             │',
            '│ 000f0000 │ 000fffff │  64 kB │ Motherboard BIOS        │                  │             │',
            '└──────────┴──────────┴────────┴─────────────────────────┴──────────────────┴─────────────┘',
          ]
        },
        {
          type: 'paragraph',
          content: [
            '%BrightRed%Extended Memory%White% is not mapped very interestingly. It just contains the rest of the available ' +
            'RAM and sometimes can contain some mapped hardware. It goes as far as it can be addressed, but that doesn\'t mean ' +
            'that there is something in it everywhere. CPU simply doesn\'t have anything to map after it\'s gone through ' +
            'all the memory and mapped devices.',
            '',
            '%BrightRed%Note for lost:%White% Mapping of devices/memory means assigning a chunk of external hardware data onto a portion ' +
            'of address space. So for example we say that memory is mapped onto 0x500-0x7bff when writing into those ' +
            'addresses by the CPU would mean storing values into a specific chunk of RAM memory through the RAM controller, ' +
            'and loading from them would retrieve values from the same chunk of RAM. When we say that a VGA memory is mapped ' +
            'in 0xa000-0xbffff, we mean that writing to that address would store a value into the VGA cards graphical memory, ' +
            'for example changing a character or a pixel on the screen.',
            '',
            'There is a difference between memory mapping and IO. There are different instructions for loading and storing into memory, ' +
            'and reading/writing into ports of the CPU. There are completely different things mapped in the ' +
            'address space and the port IO space.'
          ]
        }
      ]
    },
    {
      type: 'section',
      title: 'HELLO KERMIT KERNEL WORLD!',
      content: [
        {
          type: 'paragraph',
          content: [
            'I already tried to make an OS once. It was orange, written in assembly, running in Real mode, and when you ' +
            'started a program your clock froze. Those where the days my nibba.',
            '',
            'First, is the %BrightRed%toolchain%White%. I decided to go with CMake, as it allows me to organize my project ' +
            'much easier than with raw make. First thing I had to do was compiling gcc. Arch does have a package for arm gcc ' +
            'cross-compiler, but there is no package for x86. The prebuilt compiler of the system produces ELF binaries that ' +
            'run on your Linux system, has all the standard libraries and can\'t be used for this purpose. So I downloaded ' +
            'newest freshest cleanest gcc version 9.3.0 and binutils, and compiled them for i686 target architecture. ' +
            'I put them into /usr/local/gcc/i686-elf/, set up my path and they were good to go. The whole thing took around 4 hours.',
            '',
            'Now I had to plug it into CMake. I created a CLion project, and created a custom Toolchain which directed ' +
            'to the shiny new gcc. I structured the project directory as follows:'
          ]
        },
        {
          type: 'text_image',
          content: [
            ' '.repeat(120 - 8 - 2 * 2),
            '└──┬%BrightBlue%xos %Fg%(Project root)%White%',
            '   ├──┬%BrightBlue%arch %Fg%(Architecture specific code)%White%',
            '   │  ├──┬%BrightBlue%i386 %Fg%(x86 specific code)%White%',
            '   │  │  ├──┬%BrightBlue%boot%White%',
            '   │  │  │  ├──┬%BrightBlue%src                                                     %White%',
            '   │  │  │  │  └──%BrightGreen%boot.s %Fg%(os loader procedure)%White%',
            '   │  │  │  └──%BrightRed%CMakeLists.txt                                            %White%',
            '   │  │  ├──┬%BrightBlue%kernel %Fg%(Architecture specific kernel code)%White%',
            '   │  │  │  ├──┬%BrightBlue%tty %Fg%(Virtual console)%White%',
            '   │  │  │  │  ├──┬%BrightBlue%include                                              %White%',
            '   │  │  │  │  │  └──┬%BrightBlue%xos                                               %White%',
            '   │  │  │  │  │     └──%BrightCyan%tty.h                                           %White%',
            '   │  │  │  │  ├──┬%BrightBlue%src                                                  %White%',
            '   │  │  │  │  │  └──%BrightGreen%tty.cpp                                           %White%',
            '   │  │  │  │  └──%BrightRed%CMakeLists.txt                                         %White%',
            '   │  │  │  ├──┬%BrightBlue%vga %Fg%(Graphics interface)%White%',
            '   │  │  │  │  ├──┬%BrightBlue%include                                              %White%',
            '   │  │  │  │  │  └──┬%BrightBlue%xos                                               %White%',
            '   │  │  │  │  │     └──%BrightCyan%vga.h                                           %White%',
            '   │  │  │  │  ├──┬%BrightBlue%src                                                  %White%',
            '   │  │  │  │  │  └──%BrightGreen%vga.cpp                                           %White%',
            '   │  │  │  │  └──%BrightRed%CMakeLists.txt                                         %White%',
            '   │  │  │  └──%BrightRed%CMakeLists.txt                                            %White%',
            '   │  │  ├──%BrightRed%CMakeLists.txt                                               %White%',
            '   │  │  └──%BrightMagenta%linker.ld %Fg%(i386 linker script)%White%',
            '   │  └──%BrightRed%CMakeLists.txt                                                  %White%',
            '   ├──┬%BrightBlue%core %Fg%(Universal utilities)%White%',
            '   │  ├──┬%BrightBlue%include                                                       %White%',
            '   │  │  └──┬%BrightBlue%xos                                                        %White%',
            '   │  │     ├──%BrightCyan%ext_c.h                                                  %White%',
            '   │  │     ├──%BrightCyan%noreturn.h                                               %White%',
            '   │  │     └──%BrightCyan%restrict.h                                               %White%',
            '   │  └──%BrightRed%CMakeLists.txt                                                  %White%',
            '   ├──┬%BrightBlue%image_root %Fg%(Grub image target)%White%',
            '   │  ├──┬%BrightBlue%src %Fg%(Grub image root directory)%White%',
            '   │  │  └──┬%BrightBlue%boot                                                       %White%',
            '   │  │     └──┬%BrightBlue%grub                                                    %White%',
            '   │  │        └──%BrightMagenta%grub.cfg %Fg%(Grub config)%White%',
            '   │  └──%BrightRed%CMakeLists.txt                                                  %White%',
            '   ├──┬%BrightBlue%libc %Fg%(Sources for libc/libk)%White%',
            '   │  ├──┬%BrightBlue%include                                                       %White%',
            '   │  │  ├──┬%BrightBlue%sys                                                        %White%',
            '   │  │  │  └──%BrightCyan%cdefs.h %Fg%(xos libc defines)%White%',
            '   │  │  ├──┬%BrightBlue%xos %Fg%(Custom C++ stdlib)%White%',
            '   │  │  │  └──%BrightCyan%string.h                                                 %White%',
            '   │  │  └──%BrightCyan%string.h                                                    %White%',
            '   │  ├──┬%BrightBlue%src                                                           %White%',
            '   │  │  └──%BrightGreen%string.cpp                                                 %White%',
            '   │  └──%BrightRed%CMakeLists.txt                                                  %White%',
            '   ├──┬%BrightBlue%xos %Fg%(Actual xos executable)%White%',
            '   │  ├──┬%BrightBlue%src                                                           %White%',
            '   │  │  ├──%BrightCyan%compiler_checks.h %Fg%(Compiler version checks)%White%',
            '   │  │  └──%BrightGreen%kernel_main.cpp %Fg%(xos entry C function)%White%',
            '   │  └──%BrightRed%CMakeLists.txt                                                  %White%',
            '   ├──%Gray%.gitignore                                                              %White%',
            '   ├──%BrightMagenta%burn_xos_iso                                                   %White%',
            '   ├──%BrightRed%CMakeLists.txt                                                     %White%',
            '   ├──%BrightMagenta%run_xos_bin                                                    %White%',
            '   └──%BrightMagenta%run_xos_iso                                                    %White%',
          ]
        },
        {
          type: 'paragraph',
          content: [
            'It\'s kinda a lot, right? As I said in the beginning, writing a hello world is not so easy. ' +
            'I will skip over the contents of the CMakeFiles, and just sketch out the rough idea.',
            '',
            '%BrightBlue%arch%White% contains architecture specific sources, much like in the Linux kernel. ' +
            'This is useful in case I decided at some point to support more than one CPU architecture. ' +
            'Root CMakeFiles takes care of setting up various compiler flags, using the correct %BrightBlue%arch ' +
            'subfolder%White%, adding linker flags and linker script.',
            '',
            '%BrightBlue%core%White% contains only generally uninteresting headers, for example for using a correct ' +
            'restrict keyword when in C++ and C environments.',
            '',
            '%BrightBlue%image_root%White% directory contains a CMakeLists which adds two custom targets - %BrightRed%' +
            'image_root%White% and %BrightRed%build_image_root%White%. Former creates an image root directory, which ' +
            'contains configuration for grub and the built i686 elf xos binary. The latter builds an iso from this ' +
            'directory via grub-mkrescue. It\'s not an optimal solution for production, but it provides a sufficient ' +
            'iteration speed and everything needed.',
            '',
            '%BrightBlue%libc%White% contains sources for standard library, which might be useful once I actually get ' +
            'to having user space programs and requiring a gcc sysroot with my own implementation. It currently contains ' +
            'two targets, libc and libk, which are both built from same sources but have different implementations (' +
            'libc has currently nothing implemented, and is disabled, libk has everything I\'ve programmed up until now).',
            '',
            '%BrightBlue%xos%White% is what puts it all together. With some compiler checks so that you can not build ' +
            'the os without a cross compiler environment, it also contains the %BrightCyan%kernel_main%White% procedure, ' +
            'which is called after system startup and is the entry point to C++ code.',
          ]
        },
      ]
    },
    {
      type: 'section',
      title: 'HOW DO YOU GRUB?',
      content: [
        {
          type: 'paragraph',
          content: [
            'Now, you might be wondering, how is it possible to boot up using Grub? Every good OS should start by ' +
            'writing a boot loader! Well no. To avoid all the (very useful to learn) bootloader drama, ' +
            'we use a  format known as Multiboot. With Multiboot, you just build a binary with a specific Multiboot header, ' +
            'and point Grub to it, and it does its magic. Grub can load modules, set up video mode, give you information ' +
            'on how the memory is mapped, how much memory there actually is, and much more. For our purposes, we just ' +
            'need to know how to get the most basic thing running. I read the whole Multiboot specification so you don\'t have to, ' +
            'and concluded that it isn\'t all that impossible to do, but our compiler builds an elf binary. How do ' +
            'we give it the information needed so the output is valid for our very specific environment?',
            '',
            '%BrightRed%Linker Script%White% located in %BrightBlue%arch/i386/linker.ld%White% tells the compiler the ' +
            'layout we need to have for our executable. Elf executables are split into sectors. %BrightGreen%.text%White%' +
            'contains executable code (functions), %BrightGreen%.rodata%White% contains read-only data (constants), ' +
            '%BrightGreen%.data%White%contains static variables (those have to exist for the whole runtime of the program) and' +
            '%BrightGreen%.bss%White%contains the stack and unitialized variables. We want xos to be loaded into ' +
            'start of the extended memory (exactly at 1MB), begin execution with %BrightCyan%_start%White% label and ' +
            'to put the Multiboot header contents to the front.',
          ]
        },
        {
          type: 'text_image',
          content: [
            ' '.repeat(120 - 8),
            '%BrightRed%linker.ld%White%:',
            '',
            'ENTRY(%BrightCyan%_start%White%)',
            '',
            'SECTIONS',
            '{',
            '        . = 1M;',
            '',
            '        %BrightGreen%.text%White% BLOCK(4K) : ALIGN(4K)',
            '        {',
            '                *(%BrightGreen%.multiboot%White%)',
            '                *(%BrightGreen%.text%White%)',
            '        }',
            '',
            '        %BrightGreen%.rodata%White% BLOCK(4K) : ALIGN(4K)',
            '        {',
            '                *(%BrightGreen%.rodata%White%)',
            '        }',
            '',
            '        %BrightGreen%.data%White% BLOCK(4K) : ALIGN(4K)',
            '        {',
            '                *(%BrightGreen%.data%White%)',
            '        }',
            '',
            '        %BrightGreen%.bss%White% BLOCK(4K) : ALIGN(4K)',
            '        {',
            '                *(%BrightGreen%COMMON%White%)',
            '                *(%BrightGreen%.bss%White%)',
            '        }',
            '}'
          ]
        },
        {
          type: 'paragraph',
          content: [
            'The %BrightGreen%.multiboot%White%section we just made up is not a part of a standard ' +
            'elf executable, so we have to put it inside the %BrightGreen%.text%White%section before the contents ' +
            'of the %BrightGreen%.text%White% section.',
            '',
            'Now that we have a layout and an entry, we need to handle it. %BrightBlue%arch/i386/boot/src/boot.s%White%' +
            'contains the multiboot header and the %BrightCyan%_start%White% entry label. Following assembly code just ' +
            'sets up the stack, and transfers to %BrightCyan%kernel_main%White%.',
          ]
        },
        {
          type: 'text_image',
          content: [
            ' '.repeat(120 - 8),
            '%BrightRed%boot.s%White%:',
            '',
            '%Fg%# Declare constants for the Multiboot header',
            '%Yellow%.set %White%ALIGN,    %BrightMagenta%1%White%<<%BrightMagenta%0             %Fg%# align loaded modules on page boundaries',
            '%Yellow%.set %White%MEMINFO,  %BrightMagenta%1%White%<<%BrightMagenta%1             %Fg%# provide memory map',
            '%Yellow%.set %White%FLAGS,    ALIGN | MEMINFO  %Fg%# this is the Multiboot \'flag\' field',
            '%Yellow%.set %White%MAGIC,    %BrightMagenta%0x1BADB002       %Fg%# \'magic number\' lets bootloader find the header',
            '%Yellow%.set %White%CHECKSUM, -(MAGIC + FLAGS) %Fg%# checksum of above, to prove we are multiboot',
            '',
            '%Fg%# Declare a header as in the Multiboot Standard',
            '%Yellow%.section %BrightGreen%.multiboot',
            '%Yellow%.align %White%4',
            '%Yellow%.long %White%MAGIC',
            '%Yellow%.long %White%FLAGS',
            '%Yellow%.long %White%CHECKSUM',
            '',
            '%Fg%# Reserve a stack for the initial thread',
            '%Yellow%.section%BrightGreen% %BrightGreen%.bss',
            '',
            '%Yellow%.align%White% 16',
            '%BrightCyan%stack_bottom:',
            '%Yellow%.skip%White% 16384 %Fg%# 16 kB',
            '%BrightCyan%stack_top:',
            '',
            '%Fg%# The entry point',
            '%Yellow%.section%BrightGreen% .text',
            '%Yellow%.global%BrightCyan% _start',
            '%Yellow%.type%BrightCyan% _start%White%, %Yellow%@function',
            '%BrightCyan%_start:',
            '        %Fg%# Setup stack',
            '        %Yellow%movl%White% $%BrightCyan%stack_top%White%, %BrightRed%%esp',
            '',
            '        %Fg%# Transfer control to C++',
            '        %Yellow%call %BrightCyan%kernel_main',
            '',
            '        %Fg%# Halt if kernel_main returns',
            '        %Yellow%cli',
            '%BrightCyan%1:      %Yellow%hlt',
            '        jmp %BrightMagenta%1b',
            '%Yellow%.size%BrightCyan% _start%White%, . - %BrightCyan%_start%White%',
          ]
        },
        {
          type: 'paragraph',
          content: [
            'From this point on, we are done. We are in the warmth of C++, the %BrightCyan%kernel_main%White%starts ' +
            'executing, and we can drop the assembly. Almost. There are still requirements for assembly, but ' +
            'we can either use gcc inline assembly®, and write assembly inside the C++ code, or just isolate it in the ' +
            'pits of %BrightBlue%arch/i386/kernel%White%, in %BrightBlue%asm%White% and related directories.',
            '',
            'Grub gets the binary with a valid multiboot header, an entry point which calls main, and a config file ' +
            'to specify where our binary is. After we compile it, we just copy it into the correct %BrightBlue%img_root' +
            '%White% sub-directory, and call grub-mkconfig. System is burned on a USB drive and runs, giving us a ' +
            'beautiful Text Mode screen with written text.'
          ]
        },
      ]
    },
    {
      type: 'section',
      title: 'NEXT WEEK WE ARE...',
      content: [
        {
          type: 'paragraph',
          content: [
            'Going to look inside the %BrightCyan%kernel_main%White% procedure, how to create a basic virtual ' +
            'console and how to use the vga Text Mode. Phew! It was a lot right? A lot for one week. And we are still not done. ' +
            'Hell, we didn\'t event look at any C++ code! Heresy. That is the life of an OS developer. Nothing ' +
            'comes free, and for every little piece you have to fight. But don\'t worry, the further we get the ' +
            'easier it gets, up until a point where you have to write a filesystem. And the drives don\'t spin. And ' +
            'you have to make them. And you have no idea how.',
            '',
            'Signed-off-by: Milan Gallo <gallo.milan.jr@gmail.com>'
          ]
        }
      ]
    }
  ]
};

