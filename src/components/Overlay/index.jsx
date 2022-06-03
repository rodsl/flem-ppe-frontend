/**
 * Componente de overlay.
 *  @module Overlay
 */

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";

/**
   * Monta o Overlay.
   * @method Overlay
   * @memberof module:Overlay
   * @param {Object} closeButton define o botão de fechamento do Overlay
   * @param {Object} isOpen ação quando aberto
   * @param {Object} onClose ação quando fechado
   * @param {Object} size define o tamanho do corpo do Overlay (padrão: "md")
   * @param {Object} header define o header de identificação do Overlay (padrão: "Overlay Header")
   * @param {Object} children componente-filho do objeto
   * @returns {Component} overlay estilizado.
   * 
   */
export function Overlay({
  closeButton,
  isOpen,
  onClose,
  size = "md",
  header = "Overlay Header",
  children,
}) {
  return (
    <>
      <Drawer onClose={onClose} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent shadow="2xl">
          {closeButton && (
            <DrawerCloseButton />
          )}
          <DrawerHeader>{header}</DrawerHeader>
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
