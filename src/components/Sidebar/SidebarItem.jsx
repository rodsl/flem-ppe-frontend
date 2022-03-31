import { Heading } from '@chakra-ui/react';
import { Component } from 'react';

/**
   * Monta um item de Sidebar, que constitui a categoria 
   * principal da sidebar.
   * @memberof module:Sidebar
   * @param {Component} children estruturas filho da composição
   * @param {Object} props demais propriedades da composição
   * 
   */
export function SidebarItem({ children, ...props }) {
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