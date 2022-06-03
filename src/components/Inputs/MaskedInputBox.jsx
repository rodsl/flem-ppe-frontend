import {
    Box,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
  } from "@chakra-ui/react";
  import { Controller } from "react-hook-form";
  

   /**
   * Cria uma Inpux Box com máscara definida.
   * @method MaskedInputBox
   * @memberof module:Inputs
   * @param {String} id id do formulário
   * @param {Object} control controle de fortmulário
   * @param {Object} errors manipula as mensagens de erro
   * @param {String} label label do formulário
   * @param {Object} validate validação
   * @param {Object} setValueAs define o valor do formulário
   * @param {Boolean} setMask define se deseja utilizar máscara sobre
   * o valor inserido no campo (true) ou não (false)
   * @returns {Component} componente estilizado com máscara
   */
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
