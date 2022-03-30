import {
  Flex,
  Table as ChakraTable,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Input,
  Stack,
  IconButton,
  Tfoot,
  useDisclosure,
  Icon,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { FiEdit3, FiFilter, FiTool } from "react-icons/fi";
import { FilterInput } from "./FilterInput";

export function Table() {
  const thNome = useDisclosure();

  return (
    <Flex
      bg="white"
      rounded="lg"
      shadow="lg"
      p={4}
      w="100%"
      h="100%"
      overflowX="auto"
    >
      <ChakraTable variant="simple" shadow="2xl">
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <Thead>
          <Tr>
            <Th onMouseEnter={thNome.onToggle} onMouseLeave={thNome.onToggle}>
              <FilterInput isOpen={thNome.isOpen}>
                <Flex alignItems="center">
                  Nome
                  <Icon
                    as={FiFilter}
                    boxSize={3}
                    ms={1}
                    color={!thNome.isOpen && "transparent"}
                    // fill="currentcolor"
                  />
                </Flex>
              </FilterInput>
            </Th>
            <Th>CPF</Th>
            <Th>Matícula FLEM</Th>
            <Th>Demandante</Th>
            <Th>Município</Th>
            <Th>Escritório Regional</Th>
            <Th>Status</Th>
            <Th isNumeric>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Nome</Td>
            <Td>CPF</Td>
            <Td>Matícula FLEM</Td>
            <Td>Demandante</Td>
            <Td>Município</Td>
            <Td>Escritório Regional</Td>
            <Td>Status</Td>
            <Td isNumeric>
              <Stack direction="row" spacing={4} justifyContent="flex-end">
                <IconButton
                  aria-label="Add to friends"
                  icon={<FiEdit3 />}
                  variant="outline"
                  colorScheme="brand1"
                  _focus={{
                    boxShadow: "0 0 0 3px var(--chakra-colors-brand1-300)",
                  }}
                />
                <IconButton
                  aria-label="Add to friends"
                  icon={<FiTool />}
                  variant="outline"
                  colorScheme="orange"
                  _focus={{
                    boxShadow: "0 0 0 3px var(--chakra-colors-orange-300)",
                  }}
                />
              </Stack>
            </Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Nome</Th>
            <Th>CPF</Th>
            <Th>Matícula FLEM</Th>
            <Th>Demandante</Th>
            <Th>Município</Th>
            <Th>Escritório Regional</Th>
            <Th>Status</Th>
            <Th isNumeric>Ações</Th>
          </Tr>
        </Tfoot>
      </ChakraTable>
    </Flex>
  );
}
