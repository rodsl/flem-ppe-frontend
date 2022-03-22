import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";

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
