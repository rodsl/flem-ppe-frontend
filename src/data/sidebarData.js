import {
  FiArchive,
  FiCalendar,
  FiFileText,
  FiHome,
  FiPackage,
  FiUsers,
} from "react-icons/fi";
import {
  HiOutlineAcademicCap,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { TbBrandTelegram, TbBuildingCommunity, TbPerspective } from "react-icons/tb";
import { MdWorkOutline } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";

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
    label: "cadastros",
    items: [
      {
        title: "Beneficiários",
        icon: FiUsers,
        href: "/beneficiarios",
      },
      {
        title: "Demandantes",
        icon: TbBuildingCommunity,
        href: "/demandantes",
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
        title: "Escritórios Regionais",
        icon: HiOutlineOfficeBuilding,
        href: "/escritorios-regionais",
      },
      {
        title: "Monitores",
        icon: HiOutlineUserGroup,
        href: "/monitores",
      },
      {
        title: "Materiais",
        icon: FiPackage,
        href: "/materiais",
      },
      {
        title: "Formações",
        icon: HiOutlineAcademicCap,
        href: "/formacoes",
      },
      {
        title: "Ofícios",
        icon: FiFileText,
        href: "/oficios",
        subItems: [
          {
            title: "Templates",
            icon: FiFileText,
            href: "/templates",
          },
          {
            title: "Parâmetros",
            icon: FiFileText,
            href: "/parametros",
          },
        ],
      },
      {
        title: "Situações de Vaga",
        icon: MdWorkOutline,
        href: "/situacoes-vaga",
      },
      {
        title: "Eventos",
        icon: FiCalendar,
        href: "/eventos",
      },
      {
        title: "Ações CR",
        icon: FiCalendar,
        href: "/acoes",
      },
    ],
  },
  {
    label: "gerenciamento",
    items: [
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
        title: "Comunicados",
        icon: TbBrandTelegram,
        href: "/comunicados",
      },
      {
        title: "Envio de Ofícios",
        icon: FiFileText,
        href: "/envio-oficios",
      },
      {
        title: "Fila de Ações CR",
        icon: FiCalendar,
        href: "/fila-acoes",
      },
    ],
  },
];
