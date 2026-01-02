'use client';

import { Sidebar } from './sidebar';
import {
  LayoutDashboard,
  FileText,
  User,
} from 'lucide-react';

const memberSidebarItems = [
  {
    title: 'لوحة التحكم',
    href: '/member/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'المشاريع',
    href: '/member/projects',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'الملف الشخصي',
    href: '/member/profile',
    icon: <User className="h-5 w-5" />,
  },
];

export function MemberSidebar() {
  return <Sidebar items={memberSidebarItems} />;
}

