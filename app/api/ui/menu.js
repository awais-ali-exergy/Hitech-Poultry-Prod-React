import {
  LayoutDashboard,
  FileText,
  Users,
  KeyRound,
  AlertTriangle,
  Menu,
  File,
  BookOpen,
} from "lucide-react";

const menuItems = [
  {
    key: "dashboard",
    name: "Dashboard",
    link: "/app/dashboard",
    icon: LayoutDashboard,
  },
  /*{
    key: 'pages',
    name: 'Pages',
    icon: FileText,
    child: [
      {
        key: 'other_page',
        name: 'Welcome Page',
        title: true,
      },
      {
        key: 'blank',
        name: 'Blank Page',
        link: '/app',
        icon: File,
      },
      {
        key: 'main_page',
        name: 'Sample Page',
        title: true,
      },
      {
        key: 'form',
        name: 'Form',
        link: '/app/pages/form',
        icon: FileText,
      },
      {
        key: 'table',
        name: 'Table',
        link: '/app/pages/table',
        icon: BookOpen,
      },
      {
        key: 'maintenance',
        name: 'Maintenance',
        link: '/maintenance',
        icon: Menu
      },
      {
        key: 'coming_soon',
        name: 'Coming Soon',
        link: '/coming-soon',
        icon: Menu
      },
    ]
  },
  {
    key: 'auth',
    name: 'Auth Page',
    icon: Users,
    child: [
      {
        key: 'auth_page',
        name: 'User Authentication',
        title: true,
      },
      {
        key: 'login',
        name: 'Login',
        link: '/login',
        icon: Users
      },
      {
        key: 'register',
        name: 'Register',
        link: '/register',
        icon: KeyRound
      },
      {
        key: 'reset',
        name: 'Reset Password',
        link: '/reset-password',
        icon: KeyRound
      },
    ]
  },
  {
    key: 'errors',
    name: 'Errors',
    icon: AlertTriangle,
    child: [
      {
        key: 'errors_page',
        name: 'Errors Pages',
        title: true,
      },
      {
        key: 'not_found_page',
        name: 'Not Found Page',
        link: '/app/pages/not-found',
        icon: AlertTriangle
      },
      {
        key: 'error_page',
        name: 'Error Page',
        link: '/app/pages/error',
        icon: AlertTriangle
      },
    ]
  },
  {
    key: 'menu_levels',
    name: 'Menu Levels',
    multilevel: true,
    icon: Menu,
    child: [
      {
        key: 'level_1',
        name: 'Level 1',
        link: '/#'
      },
      {
        key: 'level_2',
        keyParent: 'menu_levels',
        name: 'Level 2',
        child: [
          {
            key: 'sub_menu_1',
            name: 'Sub Menu 1',
            link: '/#'
          },
          {
            key: 'sub_menu_2',
            name: 'Sub Menu 2',
            link: '/#'
          },
        ]
      },
    ]
  },
  {
    key: 'no_child',
    name: 'One Level Menu',
    icon: File,
    linkParent: '/app/blank-page',
  }*/
];

export default menuItems;
