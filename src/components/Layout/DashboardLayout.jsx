import { useDisclosure } from "@chakra-ui/react";
import { BreadcrumbBar } from "components/Breadcrumb";
import { Navbar } from "components/Navbar";
import { Sidebar } from "components/Sidebar";
import { NavLabel } from "components/Sidebar/SidebarItem";
import { NavItem } from "components/Sidebar/SidebarLabel";
import {
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiHome,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { IoPawOutline } from "react-icons/io5";

export function DashboardLayout({ appName, children, ...props }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const entities = [
    { value: "ba", label: "Bahia", defaultValue: true },
    { value: "to", label: "Tocantins", defaultValue: false },
  ];
  
  return (
    <>
      <Navbar onClick={onOpen} entities={entities} appName={appName}>
        <BreadcrumbBar entities={entities} />
      </Navbar>
      <Sidebar isOpen={isOpen} onClose={onClose} appName={appName}>
        <NavLabel>Gerenciamento</NavLabel>
        <NavItem icon={FiHome} title="Dashboard" description="rwerrwerw" />
        <NavItem icon={FiCalendar} title="Calendar" active subMenu />
        <NavItem icon={FiUser} title="Clients" subMenu />
        <NavLabel>Monitoramento</NavLabel>
        <NavItem icon={IoPawOutline} title="Animals" subMenu />
        <NavItem icon={FiDollarSign} title="Stocks" />
        <NavLabel>Relatórios</NavLabel>
        <NavItem icon={FiBriefcase} title="Reports" />
        <NavItem icon={FiSettings} title="Settings" />
      </Sidebar>
      {children}
    </>
  );
}
