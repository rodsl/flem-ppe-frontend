import {
    Box,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Skeleton
  } from "@chakra-ui/react";
  
  export function InputBox({
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
    setValue ? setValue (id, value) : null
    return (
      <Box>
        <FormControl id={id} isInvalid={errors[id]}>
          <FormLabel>{label}</FormLabel>
          <Skeleton isLoaded={isLoaded} fadeDuration={0.5}>
          <Input
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
  