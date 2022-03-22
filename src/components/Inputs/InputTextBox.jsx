import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Skeleton,
  Textarea,
  Input,
} from "@chakra-ui/react";

export function InputTextBox({
  id,
  errors,
  label,
  type,
  placeholder,
  register,
  required = "Obrigatório",
  validate,
  isLoaded = true,
  onChange,
  value,
  setValue,
  ...props
}) {
  setValue ? setValue(id, value) : null;
  return (
    <Box>
      <FormControl id={id} isInvalid={errors[id]}>
        <FormLabel>{label}</FormLabel>
        <Skeleton isLoaded={isLoaded} fadeDuration={0.5}>
          <Input
            as={Textarea}
            type={type}
            placeholder={placeholder}
            {...register(id, {
              required: required,
              validate: validate,
              onChange: onChange,
            })}
            {...props}
          />
        </Skeleton>
        <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
}
