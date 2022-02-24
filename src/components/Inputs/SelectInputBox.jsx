import {
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Select,
    Skeleton,
  } from "@chakra-ui/react";
  
  export function SelectInputBox({
    id,
    errors,
    label,
    placeholder,
    register,
    required = "Obrigatório",
    options,
    isLoaded = true,
    onChange,
    value,
    setValue,
  }) {
    setValue ? setValue (id, value) : null
    return (
      <Box>
        <FormControl id={id} isInvalid={errors[id]}>
          <FormLabel>{label}</FormLabel>
          <Skeleton isLoaded={isLoaded} fadeDuration={0.5}>
          <Select
            placeholder={placeholder}
            {...register(id, {
              required: required,
              onChange: onChange,
            })}
          >
            {Array.isArray(options) &&
              options.map((option) => (
                <option key={option.id + option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </Select>
          </Skeleton>
          <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
        </FormControl>
      </Box>
    );
  }
  