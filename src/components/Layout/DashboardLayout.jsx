/**
 * Componentes de Layout.
 *  @module Layout
 */


import { useDisclosure } from "@chakra-ui/react";
import { BreadcrumbBar } from "components/Breadcrumb";
import { Navbar } from "components/Navbar";
import { Sidebar } from "components/Sidebar";
import { SidebarItem } from "components/Sidebar/SidebarItem";
import { SidebarLabel } from "components/Sidebar/SidebarLabel";
import {
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiHome,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { IoPawOutline } from "react-icons/io5";

/**
   * Define o layout das páginas do Portal.
   * @method SelectInputBox
   * @memberof module:Inputs
   * @param {String} id id do formulário
   * @param {Function} errors manipula as mensagens de erro
   * @param {Object} label rótulo do Input Box
   * @param {Object} placeholder placeholder do box
   * @param {Object} register define parâmetros de register 
   * @param {*} required marca a Box como um campo obrigatório (true)
   * ou opcional (false) (padrão: "Obrigatório" - força o campo como
   * obrigatório, com o texto "Obrigatório")
   * @param {Object} options opções disponíveis do checkbox, que são
   * passadas na forma de um array
   * @param {Boolean} isLoaded realiza a animação diretamente (true) ou
   * não. Caso seja colocado em false, deve ser transmitido um valor para
   * realizar o carregamento do Skeleton (padrão: true - ativa a animação
   * automaticamente)
   * @param {Function} onChange transmite um callback após a validação
   * do campo
   * @param {Object} value dados do formulário. Pode ser utilizado juntamente
   * com setValue para receber os valores por meio de função
   * @param {Function} setValue provê uma função que entrega dados do 
   * formulário, de acordo com seu id.
   * @returns {Component} componente estilizado com máscara
   */
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
        <SidebarItem>Gerenciamento</SidebarItem>
        <SidebarLabel icon={FiHome} title="Dashboard" description="rwerrwerw" />
        <SidebarLabel icon={FiCalendar} title="Calendar" active subMenu />
        <SidebarLabel icon={FiUser} title="Clients" subMenu />
        <SidebarItem>Monitoramento</SidebarItem>
        <SidebarLabel icon={IoPawOutline} title="Animals" subMenu />
        <SidebarLabel icon={FiDollarSign} title="Stocks" />
        <SidebarItem>Relatórios</SidebarItem>
        <SidebarLabel icon={FiBriefcase} title="Reports" />
        <SidebarLabel icon={FiSettings} title="Settings" />
      </Sidebar>
      {children}
    </>
  );
}