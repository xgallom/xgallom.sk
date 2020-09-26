export const Section03 = {
  title: 'XOS Development Blog - Hello World pt. 2',
  content: [
    {
      type: 'section',
      title: 'NAME',
      content: [{type: 'paragraph', content: ['XOS Development Blog - Hello World']}]
    },
    {
      type: 'section',
      title: 'BLOG PART THREE, WEEEEEEEEEEEEEE',
      content: [
        {
          type: 'paragraph',
          content: [
            'We are continuing where we left off two weeks ago by looking at the C++ source code of our majestic Hello ' +
            'Kermit Kernel World. We will skim over some basics of %BrightBlue%core%White%, then go into %BrightBlue%xos' +
            '%White%, and finish by explaining what happens inside the %BrightBlue%tty%White% and %BrightBlue%vga%White%.',
          ]
        }
      ]
    },
    {
      type: 'section',
      title: 'CORE IS NOT THAT CORE',
      content: [
        {
          type: 'paragraph',
          content: [
            'Despite the fundamentally sounding name, core is not very important. It just contains a bunch of useless ' +
            'stuff that wouldn\'t fit anywhere else because it has no purpose other than semantic. It may grow in ' +
            'importance later, especially due to the fact that we miss all the C++ template functionality, as it is in ' +
            'the standard library. This choice of architecture is incomprehensible for me as it completely obliterates ' +
            'all template meta-programming within a freestanding environment, and honestly, it\'s disgustang. ' +
            'In any case, it\'s just a few headers that are required everywhere and nowhere at once.',
          ]
        },
      ]
    },
    {
      type: 'section',
      title: 'EXTERN C',
      content: [
        {
          type: 'paragraph',
          content: [
            'When interfacing with assembly or C code, we need to produce symbols that have a predicable and reasonable ' +
            'naming scheme. C++ functions use name mangling to ensure functions with same name but different ' +
            'arguments have different symbols, so they are unambiguous to function overloading.',
            '',
            'That is why C++ provides the extern "C" synopsis, which allows for creating unmangled C symbols ' +
            'in C++ as well as inclusion of C code into C++. The language provides a special kind of scope and anything ' +
            'within the scope is considered as C code. If we want to provide our C++ function to a C-like environment, ' +
            'we just wrap its declaration in extern "C". If the definition isn\'t wrapped as well, it will be valid C++ ' +
            'code but compiler will understand that this function is not meant to be mangled which will in turn ' +
            'disable overloading for that function.',
            '',
            'What we have to keep in mind is that this intrinsic is not known to a C compiler. We don\'t have to care ' +
            'because we don\'t have any actual C code and want to interface only with assembly, but if we were ' +
            'to use it as it is usually used, we would have to conditionally enable it only in the C++ environment. ' +
            'That\'s exactly how we\'re going to do it. The following code snippet defines macros _EXT_C and _EXT_C_END, ' +
            'which either surround the code inside them in an extern "C" scope, or do nothing depending on the compiler mode.'
          ]
        },
        {
          type: 'text_image',
          content: [
            ' '.repeat(120 - 8),
            '%Fg%// The __cplusplus define is provided by the compiler if%White%',
            '%Fg%//  we\'re in a C++ environment.%White%',
            '',
            '%Yellow%#ifdef %BrightRed%__cplusplus%White%',
            '',
            '%Yellow%#define %BrightRed%_EXT_C     %Yellow%extern %BrightMagenta%"C" %White%{',
            '%Yellow%#define %BrightRed%_EXT_C_END %White%}',
            '',
            '%Yellow%#else',
            '',
            '%Yellow%#define %BrightRed%_EXT_C%White%',
            '%Yellow%#define %BrightRed%_EXT_C_END%White%',
            '',
            '%Yellow%#endif'
          ]
        },
      ]
    },
    {
      type: 'section',
      title: 'NO RETURN',
      content: [
        {
          type: 'paragraph',
          content: [
            'Gcc provides many different function attributes. When applied to a function they may hint the compiler ' +
            'about some behavior or non-obvious information and allow for more optimal optimisation. Notice the wording. ' +
            'C++ is full of ambiguity and undefined or implementation specific behavior, which just waits for you to ' +
            'take your sources to a different version of the same compiler and get completely shat on. When you use ' +
            'an attribute not supported by a specific compiler it usually means a compiler error, but when you use an ' +
            'attribute supported by multiple compilers you may get fucked. See? Even you getting fucked in the ass by ' +
            'the compiler is not guaranteed by the C++ standards committee.',
            '',
            'Anyways, attribute __noreturn__ signals the compiler that the function never returns, and it should consider it ' +
            'being called as leaving the caller scope forever. This niche attribute applies for example to "abort" or ' +
            '"exit" type functions, or functions that contain an endless loop.',
          ]
        },
        {
          type: 'text_image',
          content: [
            ' '.repeat(120 - 8),
            '%Yellow%#define %BrightRed%_NoRet %Yellow%__attribute__%White%((__noreturn__))'
          ]
        },
      ]
    },
    {
      type: 'section',
      title: 'RESTRICT',
      content: [
        {
          type: 'paragraph',
          content: [
            'The last one we will cover in this section is the restrict keyword. This one is considered as a cv-qualifier ' +
            'by the language, but applies only to pointers. Cv-qualifiers are the const and volatile keywords. Const ' +
            'informs the compiler that some value is never supposed to change after assignment, volatile that some value may ' +
            'change by forces other than assignment inside the program. Volatile could be for example used to ' +
            'represent hardware mapped registers, as reading from such a memory address is not always guaranteed to load the same ' +
            'value, and could be used for example to create a busy-wait loop while for waiting for some register to change.',
            '',
            'Restrict only applies to pointers and it informs the compiler that the values pointed to by more than one ' +
            'pointer can not overlap. This allows for amazing compiler optimisations and is one of the most important ' +
            'parts of any low level C++ optimisation techniques. A standard example of this is memcpy and memmove. ' +
            'Memcpy arguments are usually declared as (void *restrict dest, const void *restrict src, size_t count), ' +
            'which signals the compiler the meaning of memcpy - to copy non-overlapping regions of memory, as opposed to ' +
            'memmove, which with (void *dest, const void *src, size_t count) does not have to satisfy that guarantee.',
            '',
            'There is another syntactic discrepancy here - C has the restrict keyword as the part of the language, while ' +
            'C++ does not. C++ defines the __restrict keyword, which is the equivalent built-in. I am not a hundred ' +
            'percent sure if __restrict is also recognised by C, but I know for a fact that after my research I defined ' +
            'them distinctively for a reason. New macro is also shorter omegalul'
          ]
        },
        {
          type: 'text_image',
          content: [
            ' '.repeat(120 - 8),
            '%Yellow%#ifdef %BrightRed%__cplusplus%White%',
            '',
            '%Yellow%#define %BrightRed%_Rstr %Yellow%__restrict%White%',
            '',
            '%Yellow%#else%White%',
            '',
            '%Yellow%#define %BrightRed%_Rstr %Yellow%restrict%White%',
            '',
            '%Yellow%#endif%White%'
          ]
        },
      ]
    },
    {
      type: 'section',
      title: 'XOXOS',
      content: [
        {
          type: 'paragraph',
          content: [
            '%BrightCyan%kernel_main%White% - The fabled Ilúvatar of our kernel. That which holds it all together. ' +
            'The Zion and the Abyss. Kinda. In the end it is just an entry point, not a Tolkiens being of ultimate ' +
            'creation, so there isn\'t actually a real reason for it to be considered such a special function when ' +
            'compared to any other part of the kernel. Same could be said about the user level %BrightCyan%main%White%, and ' +
            'people still think it\'s somehow "chosen" because it gets called at the start of the program. Well it ' +
            'ain\'t. The chosen one is %BrightCyan%_start%White%. Especially in this phase, when %BrightCyan%kernel_main%White% ' +
            'basically just writes a bunch of shit on the screen.',
            '',
            'In any case, it is declared as extern "C" because remember, it\'s being called directly by the assembly ' +
            'entry point and we need to know how to reference to it by its symbol.',
            '',
            'To clear this in one swell swoop, there is also %BrightBlue%compiler_checks.h%White% which just contains ' +
            'few lines of code to find out if we are compiling in a correct i386 freestanding environment.'
          ]
        },
        {
          type: 'text_image',
          content: [
            ' '.repeat(120 - 8),
            '%BrightRed%compiler_checks.h:%White%',
            '',
            '%Yellow%#if%White% defined(%BrightRed%__linux__%White%) || \\',
            '        defined(%BrightRed%unix%White%) || defined(%BrightRed%__unix%White%) || defined(%BrightRed%__unix__%White%) || \\',
            '        defined(%BrightRed%_WIN32%White%) || defined(%BrightRed%WIN32%White%) || \\',
            '        defined(%BrightRed%__APPLE__%White%) || defined(%BrightRed%__MACH__%White%) || \\',
            '        defined(%BrightRed%__FreeBSD__%White%) || \\',
            '        defined(%BrightRed%__ANDROID__%White%)',
            '',
            '%Yellow%#error %BrightMagenta%"Can\'t use the system compiler for compiling xos"%White%',
            '',
            '%Yellow%#endif%White%',
            '',
            '',
            '%Yellow%#if !defined(%BrightRed%__i386__%White%)',
            '',
            '%Yellow%#error %BrightMagenta%"xos requires an x86 elf compiler"%White%',
            '',
            '%Yellow%#endif%White%'
          ]
        },
        {
          type: 'paragraph',
          content: [
            'And here, the magnum opus that just initialises the tty and prints the welcome screen. Wish I could ' +
            'embed an image, but guess that\'s the disadvantage of having a console interface AMIRITE?! xDDDDDD'
          ]
        },
        {
          type: 'text_image',
          content: [
            ' '.repeat(120 - 8),
            '%BrightRed%kernel_main.cpp:%White%',
            '',
            '%Cpp%#include %Lit%"compiler_checks.h"%@%',
            '',
            '%Cpp%#include %Lit%<xos/ext_c.h>%@%',
            '%Cpp%#include %Lit%<xos/tty.h>%@%',
            '%Cpp%#include %Lit%<xos/vga.h>%@%',
            '',
            '',
            '%Mcr%_EXT_C%@%',
            '',
            '%Kw%void %Fn%kernel_main%@%(%Kw%void%@%);',
            '',
            '%Mcr%_EXT_C_END%@%',
            '',
            '',
            '%Kw%static void %Fn%printWelcome%@%()',
            '{',
            '        %Tp%tty%@%::%Fn%setColor%@%(%Tp%vga%@%::%Fn%ColorAttribute%@%(%Tp%vga%@%::%Tp%Color%@%::%Tp%B%rightMagenta%@%,',
            '                                          %Tp%vga%@%::%Tp%Color%@%::%Tp%B%rightBlue%@%));',
            '        %Tp%tty%@%::%Fn%write%@%(%Lit%" xos v0.0.1 "%@%);',
            '',
            '        %Tp%tty%@%::%Fn%setColor%@%(%Tp%vga%@%::%Fn%ColorAttribute%@%(%Tp%vga%@%::%Tp%Color%@%::%Tp%B%rightMagenta%@%));',
            '        %Tp%tty%@%::%Fn%write%@%(%Lit%" greets your bitch ass.\\n\\n"%@%);',
            '',
            '        %Tp%tty%@%::%Fn%setColor%@%(%Tp%vga%@%::%Fn%ColorAttribute%@%(%Tp%vga%@%::%Tp%Color%@%::%Tp%B%rightBlue%@%));',
            '        %Tp%tty%@%::%Fn%write%@%(%Lit%"Copyright Milan Gallo 2020.\\n"%@%);',
            '}',
            '',
            '%Kw%void %Fn%kernel_main%@%()',
            '{',
            '        %Tp%tty%@%::%Fn%initialize%@%();',
            '        %Fn%printWelcome%@%();',
            '}'
          ]
        },
      ]
    },
    {
      type: 'section',
      title: 'LIB{C|K}',
      content: [
        {
          type: 'paragraph',
          content: [
            'This is the one I\'m actually thinking about a lot. Having a compliant standard C library is definitely ' +
            'an advantage but due to the fact that the only user of xos is going to be me and my dead wife, I am not ' +
            'completely sure that we need it. In that spirit I\'ve started by implementing some functions from ' +
            '%BrightBlue%string.h%White% but also made my own non-standard C++ alternative. It\'s in namespace xos and ' +
            'has the same naming convention, unlike the standard library which is in namespace std and has no functions ' +
            'named same as the C alternatives doing something entirely different.',
            '',
            'One thing to notice is, that as I\'ve mentioned before, libc and libk are two different libraries built from the ' +
            'same source, libk containing sources for usage in the kernel and libc currently doing nothing, but having ' +
            'the option to provide a standard library interface in user space. Due to this fact there are some functions ' +
            'with a dual implementation and the compiler chooses the correct one for the correct target. Because even ' +
            'having a target libc that did not build the source with correct defines screwed with CLions intellisense, ' +
            'I\'ve temporarily disabled the target in CMakeLists.txt (if you were wondering).',
            '',
            'I am pretty sure I do not want to just wall-of-code this segment, as doing that in the case of the C ' +
            'library would certainly just make you want to commit sudoku. Rather than that, I will provide short ' +
            'descriptions of what every function does and leave it up to you to think about how would you implement ' +
            'it. I will provide the C++ variants because they are short and header-only templated code. Another ' +
            'thing to note is that we can use the extern "C" trick to have C++ sources for C declared functions, ' +
            'and that not all system headers are missing. Headers like %BrightBlue%stddef.h%White% and %BrightBlue%' +
            'stdint.h%White% exist.'
          ]
        },
        {
          type: 'text_image',
          content: [
            ' '.repeat(120 - 8),
            '%BrightRed%string.h:%White%',
            '',
            '%Cpp%#include %Lit%<sys/cdefs.h>%@%',
            '%Cpp%#include %Lit%<xos/ext_c.h>%@%',
            '%Cpp%#include %Lit%<xos/restrict.h>%@%',
            '',
            '%Cpp%#include %Lit%<stddef.h>%@%',
            '',
            '%Mcr%_EXT_C%@%',
            '',
            '%Cm%// Does a byte-by-byte comparison of left and right up to byteLength, and returns%@%',
            '%Cm%//  < 0 if first non-matching left value < first non-matching right value%@%',
            '%Cm%//  = 0 if left is identical to right%@%',
            '%Cm%//  > 0 if first non-matching left value > first non-matching right value%@%',
            '%Kw%int %Fn%memcmp%@%(%Kw%const void %@%*left, %Kw%const void %@%*right, %Tp%size_t %@%byteLength);',
            '',
            '%Cm%// Copies byteLength bytes from src into dest. Regions can not overlap.%@%',
            '%Kw%void %@%*%Fn%memcpy%@%(%Kw%void %@%*%Mcr%_Rstr %@%dest, %Kw%const void %@%*%Mcr%_Rstr %@%src, %Tp%size_t %@%byteLength);',
            '',
            '%Cm%// Copies byteLength bytes from src into dest. Regions can overlap.%@%',
            '%Kw%void %@%*%Fn%memmove%@%(%Kw%void %@%*dest%@%, %Kw%const void %@%*src, %Tp%size_t %@%byteLength);',
            '',
            '%Cm%// Sets byteLength bytes of dest to value.%@%',
            '%Kw%void %@%*%Fn%memset%@%(%Kw%void %@%*dest, int %@%value, %Tp%size_t %@%byteLength);',
            '',
            '%Cm%// Copies characters from src into dest until a null terminating character is found.%@%',
            '%Kw%char %@%*%Fn%strcpy%@%(%Kw%char %@%*%Mcr%_Rstr %@%dest, %Kw%const char %@%*%Mcr%_Rstr %@%src);',
            '',
            '%Cm%// Copies length characters from src into dest.%@%',
            '%Kw%char %@%*%Fn%strncpy%@%(%Kw%char %@%*%Mcr%_Rstr %@%dest, %Kw%const char %@%*%Mcr%_Rstr %@%src, %Tp%size_t %@%length);',
            '',
            '%Cm%// Returns the number of characters in str up to, but without the terminating null character.%@%',
            '%Tp%size_t %Fn%strlen%@%(%Kw%const char %@%*str);',
            '',
            '%Mcr%_EXT_C_END%@%'
          ]
        },
        {
          type: 'paragraph',
          content: [
            'As you may have noticed a whole lot is missing and it shall for quite some time. I will be completing it as ' +
            'I am requiring more and more functionalities in the kernel code. The C++ variant has even some of the C ' +
            'implementations missing, because I just did not need them.'
          ]
        },
        {
          type: 'text_image',
          content: [
            ' '.repeat(120 - 8),
            '%BrightRed%xos/string.h:%White%',
            '',
            '%Cpp%#include %Lit%<sys/cdefs.h>%@%',
            '%Cpp%#include %Lit%<xos/ext_c.h>%@%',
            '%Cpp%#include %Lit%<xos/restrict.h>%@%',
            '',
            '%Cpp%#include %Lit%<stddef.h>',
            '',
            '%Kw%namespace %Tp%xos %@%{',
            '    %Kw%template%@%<%Kw%typename %Tp%T%@%>',
            '    %Kw%inline %Tp%T %@%*%Fn%memcpy%@%(%Tp%T %@%*%Mcr%_Rstr %@%dest, %Kw%const %Tp%T %@%*%Mcr%_Rstr %@%src, %Tp%size_t %@%count)',
            '    {',
            '            %Kw%if %@%(!count)',
            '                    %Kw%return %@%dest;',
            '',
            '            %Tp%T %@%*%Mcr%_Rstr %@%destBuf = dest;',
            '',
            '            %Kw%do%@%',
            '                    %@%*destBuf++ = *src++;',
            '            %Kw%while %@%(--count);',
            '',
            '            %Kw%return %@%dest;',
            '    }',
            '',
            '    %Kw%template%@%<%Kw%typename %Tp%T%@%>',
            '    %Kw%inline %Tp%T %@%*%Fn%rmemcpy%@%(%Tp%T %@%*%Mcr%_Rstr %@%rdest, %Kw%const %Tp%T %@%*%Mcr%_Rstr %@%rsrc, %Tp%size_t %@%count)',
            '    {',
            '            %Kw%if %@%(!count)',
            '                    %Kw%return %@%rdest;',
            '',
            '            %Kw%do%@%',
            '                    *--rdest = *--rsrc;',
            '            %Kw%while %@%(--count);',
            '',
            '            %Kw%return %@%rdest;',
            '    }',
            '',
            '    %Kw%template%@%<%Kw%typename %Tp%T%@%>',
            '    %Kw%inline %Tp%T %@%*%Fn%memmove%@%(%Tp%T %@%*dest, %Kw%const %Tp%T %@%*src, %Tp%size_t %@%count)',
            '    {',
            '            %Kw%if %@%(dest < src)',
            '                    %Kw%return %Fn%memcpy%@%<%Tp%T%@%>(dest, src, count);',
            '            %Kw%else%@%',
            '                    %Kw%return %Fn%rmemcpy%@%<%Tp%T%@%>(dest + count, src + count, count);',
            '    }',
            '',
            '    %Kw%template%@%<%Kw%typename %Tp%T%@%>',
            '    %Kw%inline %Tp%T %@%*%Fn%memset%@%(%Tp%T %@%*%Mcr%_Rstr %@%dest, %Tp%T %@%value, %Tp%size_t %@%count)',
            '    {',
            '            %Kw%if %@%(!count)',
            '                    %Kw%return %@%dest;',
            '',
            '            %Tp%T %@%*%Mcr%_Rstr %Kw%const %@%start = dest;',
            '',
            '            %Kw%do%@%',
            '                    %@%*dest++ = value;',
            '            %Kw%while %@%(--count);',
            '',
            '            %Kw%return %@%start;',
            '    }',
            '',
            '    %Kw%template%@%<%Kw%typename %Tp%T%@%, %Tp%size_t %Tmpl%N%@%>',
            '    %Kw%inline %Tp%T %@%*%Fn%memset%@%(%Tp%T %@%(&%Mcr%_Rstr %@%dest)[%Tmpl%N%@%], %Tp%T %@%value)',
            '    {',
            '            %Kw%for %@%(%Kw%auto %@%&entry : dest)',
            '                    %@%entry = value;',
            '',
            '            %Kw%return %@%dest;',
            '    }',
            '}'
          ]
        },
      ]
    },
    {
      type: 'section',
      title: 'HYSTERICAL PEPELAUGH',
      content: [
        {
          type: 'paragraph',
          content: [
            'So we did not make it to vga again. God fucking damnit. It pains me dearly to say we have to part so soon, ' +
            'but I swear this is for the last time. Next time we will have nothing on our hands, except the tty and vga. ' +
            'They may also get split, not sure. uwu',
            '',
            '',
            '%BrightBlue%I%BrightCyan%_%BrightGreen%a%Yellow%m%BrightRed%_%BrightMagenta%a' +
            '%BrightBlue%n%BrightCyan%n%BrightGreen%o%Yellow%u%BrightRed%n%BrightMagenta%c' +
            '%BrightBlue%i%BrightCyan%n%BrightGreen%g%Yellow%_%BrightRed%a%BrightMagenta%_' +
            '%BrightBlue%c%BrightCyan%o%BrightGreen%n%Yellow%t%BrightRed%e%BrightMagenta%s' +
            '%BrightBlue%t%BrightCyan%!%@%',
            '',
            'Five best people that implement a standard, plain, ' +
            'clean, well thought-out string.h implementation will win my most favourite chocolate in the whole world. ' +
            'I am providing a skeleton repository for you that you can fork on %BrightRed%GitHub/xgallom/blog_contest%@%. As the ' +
            'implementation should work the same in a freestanding and hosted environment, it can not depend on any ' +
            'part of the standard library except the headers that I provide in the header file. It also can not use operator new ' +
            'or any other form of dynamic allocation, because we do not yet have it. Additional information ' +
            'will be inside the repository, you can simply open the project in CLion and run the string_test target to ' +
            'obtain it.',
            '',
            'Send links to your submissions via any social platform that I am active on. Deadline is %BrightRed%30.6.2020 23:59:59%@%. ' +
            'Only people I personally know are eligible for the price. I reserve the right to provide the price ' +
            'whenever we soonest meet, in case you are not from Bratislava. You may also pick it up in Bratislava ' +
            'whenever you want if you live near by.',
            '',
            'All the source code will get my personal feedback and along my reference implementation will be showcased ' +
            'so that everyone gets a chance to see a different perspective and maybe learn something new.',
            '',
            '',
            'Lots of love and good luck. <3',
            'Signed-off-by: Milan Gallo <gallo.milan.jr@gmail.com>'
          ]
        }
      ]
    },
  ]
};

