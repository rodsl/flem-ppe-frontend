import { FiArchive, FiHome, FiPackage, FiUsers } from "react-icons/fi";

export const sidebarData = [
  {
    items: [
      {
        title: "Dashboard",
        icon: FiHome,
        href: "/dashboard",
      },
    ],
  },
  {
    label: "gerenciamento",
    items: [
      {
        title: "Beneficiários",
        icon: FiUsers,
        href: "/beneficiarios",
      },
      // {
      //   title: "Cadastros",
      //   icon: FiArchive,
      //   href: "/cadastros",
      //   subItems: [
      //     {
      //       title: "Beneficiários",
      //       icon: FiUserPlus,
      //       href: "/beneficiarios"
      //     },
      //   ]
      // },
      {
        title: "Materiais",
        icon: FiPackage,
        href: "/materiais",
      },
    ],
  },
];
