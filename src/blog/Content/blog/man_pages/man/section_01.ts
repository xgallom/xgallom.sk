export const Section01 = {
  title: 'Manual pager utils',
  content: [
    {
      type: 'section',
      title: 'NAME',
      content: [{ type: 'paragraph', content: ['man - an interface to the system reference manuals'] }],
    },
    {
      type: 'section',
      title: 'SYNOPSIS',
      content: [{
        type: 'paragraph', content: [
          '%BrightRed%man%Fg% [%BrightGreen%section%Fg%] %BrightGreen%page%Fg%'
        ]
      }]
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
      }]
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
      }]
    },
  ]
};

