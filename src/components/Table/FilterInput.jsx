import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Icon,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";

export function FilterInput({
  children,
  cleanFilter,
  filterTitle,
  onChange,
  placeholder,
  value,
  ...props
}) {
  return (
    <>
      <Popover trigger="hover" autoFocus={false}>
        {({ isOpen, onClose }) => (
          <>
            <PopoverTrigger>
              <Flex cursor="pointer" alignItems="center">
                {children}
                <Icon
                  as={FiFilter}
                  boxSize={3}
                  ms={1}
                  color={!isOpen && !value && "transparent"}
                  fill={value && "currentColor"}
                />
              </Flex>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Filtrar por {filterTitle} </PopoverHeader>
              <PopoverBody>
                <Input
                  onChange={onChange}
                  placeholder={placeholder}
                  value={value}
                />
              </PopoverBody>
              <PopoverFooter d="flex" justifyContent="flex-end">
                <ButtonGroup size="sm">
                  <Button
                    variant="outline"
                    colorScheme="red"
                    onClick={cleanFilter}
                    disabled={!value}
                    _focus={{
                      boxShadow: "0 0 0 3px var(--chakra-colors-red-300)",
                    }}
                  >
                    Limpar
                  </Button>
                </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
          </>
        )}
      </Popover>
    </>
  );
}
