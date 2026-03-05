import { useMemo } from 'react';
import { NavItem } from '@/config/nav-config';

export function useFilteredNavItems(navItems: NavItem[]) {
  return useMemo(() => {
    return navItems.filter(item => item.title && item.url);
  }, [navItems]);
}
