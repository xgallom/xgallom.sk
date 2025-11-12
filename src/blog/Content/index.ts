import { Blog } from './blog';

export const Content = {
  type: 'grub',
  title: 'GRUB  version 2.04',
  entries: [
    {
      ...Blog,
      system: {
        ...Blog.system,
        user: 'root',
      },
      skipBoot: true,
      title: 'Blog (skip boot, root)',
    },
    {
      ...Blog,
      skipBoot: true,
      title: 'Blog (skip boot)',
    },
    {
      ...Blog,
      bootSpeed: 10.0,
      title: 'Blog (fast boot)',
    },
    {
      ...Blog,
      bootSpeed: 1.0,
      title: 'Blog (real boot)',
    },
  ]
};
