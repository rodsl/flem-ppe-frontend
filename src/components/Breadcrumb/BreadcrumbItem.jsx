import { Icon, Link } from "@chakra-ui/react";
import NextLink from "next/link";

/**
 * Item de Breadcrumb que compõe visualmente cada objeto dentro da
 * Breadcrumb Bar.
 * @method BreadcrumbItem
 * @memberof module:Breadcrumb
 * @param {Component} children propriedades filhas do componente. Herda
 * dinamicamente o caminho a ser exibido no Breadcrumb como label,
 * baseado no caminho da url acessada.
 * @param {Object} icon o ícone do breadcrumb. Na ausência, entrará uma
 * label como children
 * @param {String} href o url a relacionar para rota ao clicar, dando
 * funcionalidade ao children
 * @param {*} isCurrentPage Afeta a cor caso o Breadcrumb Item não
 * seja reflexivo a página atual exibida
 * @param {*} props  propriedades de estilo do componente
 * @returns o Item de Breadcrumb montado. Se um ícone estiver definido,
 * exibirá o ícone com as propriedades passadas. Caso contrário, exibirá
 * o componente filho definido em children
 */
export const BreadcrumbItem = ({
  children,
  icon,
  href,
  isCurrentPage,
  ...props
}) => {
  console.log(props);
  return (
    <NextLink href={href} passHref>
      <Link
        fontWeight="medium"
        fontSize="sm"
        color={isCurrentPage ? "brand1.700" : "brand1.500"}
        {...props}
        textTransform="capitalize"
      >
        {icon ? <Icon as={icon} pt={"5px"} boxSize={5} /> : children}
      </Link>
    </NextLink>
  );
};
