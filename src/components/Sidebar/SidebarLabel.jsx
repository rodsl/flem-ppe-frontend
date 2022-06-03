
import { Heading } from '@chakra-ui/react';


/**
   * Monta a label separadora das categorias da Sidebar.
   * @method SidebarLabel
   * @memberof module:Sidebar
   * @param {Object} children componente-filho do objeto
   * @returns {Component} label estilizada.
   * 
   */
export function NavLabel({ children, ...props }) {
    return (
      <Heading
        as="h3"
        size="xs"
        color="brand1.600"
        textTransform="uppercase"
        py={2}
        {...props}
      >
        {children}
      </Heading>
    );
  }