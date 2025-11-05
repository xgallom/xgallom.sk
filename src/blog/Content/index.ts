import { Blog } from './blog';

export const Content = {
  type: 'grub',
  title: 'GRUB  version 2.04',
  entries: [
    Blog,
    {
      ...Blog,
      bootSpeed: 10.0,
      title: 'Blog (fast boot)',
    },
    {
      ...Blog,
      skipBoot: true,
      title: 'Blog (disable boot)',
    },
  ]
};
