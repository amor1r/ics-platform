'use client';

import { Sidebar } from './sidebar';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  FileSearch,
  UserPlus,
} from 'lucide-react';

const adminSidebarItems = [
  {
    title: 'لوحة التحكم',
    href: '/admin/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'المشاريع',
    href: '/admin/projects',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'المستخدمين',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'السجلات',
    href: '/admin/logs',
    icon: <FileSearch className="h-5 w-5" />,
  },
  {
    title: 'دعوات المدراء',
    href: '/admin/invites',
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    title: 'الإعدادات',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function AdminSidebar() {
  return <Sidebar items={adminSidebarItems} />;
}

