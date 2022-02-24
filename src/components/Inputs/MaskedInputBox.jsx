import {
    Box,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
  } from "@chakra-ui/react";
  import { Controller } from "react-hook-form";
  
  export function MaskedInputBox({
    id,
    control,
    errors,
    label,
    validate,
    setValueAs,
    setMask,
    pattern,
    ...props
  }) {
    return (
      <Box>
        <FormControl id={id} isInvalid={errors[id]}>
          <FormLabel>{label}</FormLabel>
          <Controller
            name={id}
            control={control}
            rules={{
              required: "Obrigatório",
              validate: validate,
              setValueAs: setValueAs,
            }}
            render={({ field }) => (
              <Input
                {...field}
                onChange={
                  setMask
                    ? (e) => field.onChange(setMask(e.target.value))
                    : (e) => field.onChange(e.target.value)
                }
                value={setMask ? setMask(field.value) : field.value}
                {...props}
              />
            )}
          />
          <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
        </FormControl>
      </Box>
    );
  }  