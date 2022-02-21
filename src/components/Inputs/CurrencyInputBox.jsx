import {
    Box,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
  } from "@chakra-ui/react";
  import CurrencyFormat from "react-currency-format";
  import { Controller } from "react-hook-form";
  
  function ChakraCurrencyInput (props) {
    return (
      <CurrencyFormat {...props} customInput={Input}/>
    )
  }
  
  export function CurrencyInputBox({
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
              <ChakraCurrencyInput
              {...field}
              {...props}
              />
            )}
          />
          <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
        </FormControl>
      </Box>
    );
  }
  