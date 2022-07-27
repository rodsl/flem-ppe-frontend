import {
  Box,
  Button,
  useRadioGroup,
  useRadio,
  useToken,
  Flex,
  FormErrorMessage,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect } from "react";

function RadioCard({ colorScheme, children, size, ...props }) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const [color] = useToken("colors", [colorScheme]);
  return (
    <Box as="label" w="100%">
      <input {...input} />
      <Button
        as={Box}
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: `${color}.600`,
          color: "white",
          borderColor: `${color}.600`,
        }}
        px={5}
        py={3}
        variant="outline"
        colorScheme={colorScheme}
        w="100%"
        size={size}
      >
        {children}
      </Button>
    </Box>
  );
}

export function CheckboxInput({
  colorScheme = "brand1",
  defaultValue,
  formControl: {
    trigger,
    formState: { errors },
    register,
    setValue,
  },
  label,
  required = true,
  id,
  options,
  size,
  w,
  ...props
}) {
  const handleOnChange = (e) => {
    setValue(id, e);
    trigger(id);
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue,
    onChange: handleOnChange,
  });

  const group = getRootProps();
  const field = register(id, {
    required,
    validate: (v) => true,
  });

  useEffect(() => {
    if (defaultValue) {
      setValue(id, defaultValue);
      trigger(id);
    }
  }, []);

  return (
    <Box px={0.5}>
      <FormControl id={id} isInvalid={errors[id]}>
        {label && <FormLabel>{label}</FormLabel>}
        <Flex
          direction="row"
          {...group}
          spacing={1}
          flexWrap={true}
          w={w ||"100%"}
        >
          {options.map(({ id, label }) => {
            const radio = getRadioProps({ value: id });
            return (
              <RadioCard
                key={id + label}
                size={size}
                {...radio}
                colorScheme={colorScheme}
              >
                {label}
              </RadioCard>
            );
          })}
        </Flex>
        <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
}
