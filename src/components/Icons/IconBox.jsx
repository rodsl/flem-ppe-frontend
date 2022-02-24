import { Flex, Icon } from "@chakra-ui/react";

export default function IconBox(props) {
  const { children, fontSize, ...rest } = props;

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={"12px"}
      {...rest}
    >
      <Icon as={children} fontSize={fontSize}>
      </Icon>
    </Flex>
  );
}
