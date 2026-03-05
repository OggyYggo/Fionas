export interface NavItem {
  title: string;
  url: string;
  shortcut?: string[];
  items?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    title: 'Home',
    url: '/',
    shortcut: ['⌘', 'H']
  },
  {
    title: 'Tours',
    url: '/tours',
    shortcut: ['⌘', 'T']
  },
  {
    title: 'About',
    url: '/about',
    shortcut: ['⌘', 'A']
  },
  {
    title: 'Contact',
    url: '/contact',
    shortcut: ['⌘', 'C']
  },
  {
    title: 'Admin',
    url: '/admin',
    items: [
      {
        title: 'Dashboard',
        url: '/admin/dashboard'
      },
      {
        title: 'Bookings',
        url: '/admin/bookings'
      },
      {
        title: 'Tours',
        url: '/admin/tours'
      }
    ]
  }
];
