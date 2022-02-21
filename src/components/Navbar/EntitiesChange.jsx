import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  useBreakpointValue,
  Button,
} from "@chakra-ui/react";

export function EntitiesChange({
  options = null,
  value = null,
  setValue = null,
  title = null,
  ...props
}) {
  const size = useBreakpointValue({ base: "xs", sm: "xs", md: "md" });
  return (
    <>
      {Array.isArray(options) && (
        <Menu closeOnSelect={true}>
          <MenuButton as={Button} colorScheme="brand1" size={size} {...props}>
            {(Array.isArray(options) &&
              options.find((option) => option.value === value)?.label) ||
              "Selecione..."}
          </MenuButton>
          <MenuList minWidth="240px">
            <MenuOptionGroup defaultValue={value} title={title} type="radio">
              {Array.isArray(options) &&
                options.map((option) => (
                  <MenuItemOption
                    value={option.value}
                    onClick={(e) => setValue(e.currentTarget.value)}
                    key={`entity[${option.value}]`}
                  >
                    {option.label}
                  </MenuItemOption>
                ))}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      )}
    </>
  );
}
