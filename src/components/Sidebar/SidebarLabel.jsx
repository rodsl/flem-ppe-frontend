import {
  Box,
  Collapse,
  Flex,
  Link,
  Menu,
  MenuItem,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import IconBox from "components/Icons/IconBox";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";


export function NavItem({ icon, title, active, description, subMenu, subActive }) {
    const { isOpen, onToggle, onClose } = useDisclosure();
    return (
      <Flex
        mb={2}
        flexDir="column"
        w="100%"
        alignItems="flex-start"
        boxShadow={active && "lg"}
        rounded="lg"
        bg={isOpen && "brand1.100"}
      >
        <Menu placement="right">
          <Link
            bg={active && "brand1.500"}
            py={2}
            px={3}
            rounded="lg"
            _hover={{ textDecor: "none", bg: "brand1.500", scale: "xl" }}
            w="100%"
            role="group"
            onClick={subMenu && onToggle}
            shadow={isOpen && "inner"}
          >
            <Flex w="100%">
              <Flex>
                <IconBox
                  _groupHover={{
                    bg: "brand1.300",
                    color: "white",
                    shadow: "lg",
                  }}
                  bg={active ? "brand1.300" : "white"}
                  color={active ? "white" : "brand1.400"}
                  h="30px"
                  w="30px"
                  fontSize="xl"
                >
                  {icon}
                </IconBox>
                <Text
                  ml={3}
                  fontWeight="bold"
                  fontSize="sm"
                  color={active ? "white" : "brand1.400"}
                  my="auto"
                  _groupHover={{ color: "white" }}
                >
                  {title}
                </Text>
              </Flex>
              {subMenu && (
                <>
                  <Spacer />
                  <IconBox
                    _groupHover={{
                      color: "white",
                    }}
                    color={active ? "white" : "brand1.400"}
                    h="30px"
                    w="30px"
                    fontSize="xl"
                  >
                    {isOpen ? FiChevronUp : FiChevronDown}
                  </IconBox>
                </>
              )}
            </Flex>
          </Link>
          <Box w="100%" borderBottomRadius={10}>
            <Collapse in={isOpen} animateOpacity>
              <MenuItem p={0} _focus={{ bg: "none" }}>
                <Link
                  role="group"
                  _hover={{ bg: "brand1.500", color: "white", shadow: "lg" }}
                  w="100%"
                  rounded="md"
                  bg={active ? "brand1.500" : ""}
                >
                  <Flex py={1} ms={7} rounded="md">
                    <IconBox
                      _groupHover={{
                        color: "white",
                      }}
                      color={active ? "white" : "brand1.400"}
                      h="30px"
                      w="30px"
                      fontSize="xl"
                    >
                      {icon}
                    </IconBox>
                    <Text
                      ml={2}
                      fontWeight="bold"
                      fontSize="sm"
                      color={active ? "white" : "brand1.400"}
                      _groupHover={{ color: "white" }}
                      my="auto"
                    >
                      {title}
                    </Text>
                  </Flex>
                </Link>
              </MenuItem>
            </Collapse>
          </Box>
        </Menu>
      </Flex>
    );
  }