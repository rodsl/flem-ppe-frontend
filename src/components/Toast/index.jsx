import { Flex } from "@chakra-ui/react";

export const Toast = () => {
  return (
    <Flex
      bg="blue.600"
      ps={4}
      py={3}
      pe={8}
      color="white"
      rounded="md"
      boxShadow="xl"
    >
      <Icon as={FiInfo} me={2} boxSize={6} />
      <Box>
        <Heading size="sm" flex="1 1 0%" mb={1}>
          {" "}
          Falha na autenticação{" "}
        </Heading>
        <Text size="sm" flex="1 1 0%">
          {" "}
          Usuário e/ou senha inválidos{" "}
        </Text>
      </Box>
    </Flex>
  );
};
