import { useDisclosure } from "@chakra-ui/react";
import { BreadcrumbBar } from "components/Breadcrumb";
import { Navbar } from "components/Navbar";
import { Sidebar } from "components/Sidebar";
import { NavItem } from "components/Sidebar/SidebarItem";
import { NavLabel } from "components/Sidebar/SidebarLabel";
import { sidebarData } from "data/sidebarData";
import { useRouter } from "next/router";
import { Fragment } from "react";

export function DashboardLayout({ appName, children, ...props }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const entities = [
    { value: "ba", label: "Bahia", defaultValue: true },
    { value: "to", label: "Tocantins", defaultValue: false },
  ];
  const router = useRouter();
  const linkPath = router.asPath.split("/");
  linkPath.shift();

  return (
    <>
      <Navbar onClick={onOpen} entities={entities} appName={appName}>
        <BreadcrumbBar entities={entities} />
      </Navbar>
      <Sidebar isOpen={isOpen} onClose={onClose} appName={appName}>
        {sidebarData &&
          sidebarData.map((obj, idx) => (
            <Fragment key={`frag_${obj.label}${idx}`}>
              <NavLabel key={`navlabel_${obj.label}${idx}`}>
                {obj.label}
              </NavLabel>
              {obj.items.map((item, idx) => (
                <NavItem
                  key={`navitem_${item.title}_${idx}`}
                  icon={item.icon}
                  title={item.title}
                  href={`${item.href}`}
                  sidebarClose={onClose}
                  subItems={item.subItems}
                />
              ))}
            </Fragment>
          ))}
      </Sidebar>
        {children}
    </>
  );
}
