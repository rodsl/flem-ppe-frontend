import {
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Select,
    Skeleton,
  } from "@chakra-ui/react";
  
  /**
   * Cria uma Inpux Box de senha.
   * @method SelectInputBox
   * @memberof module:Inputs
   * @param {String} id id do formulário
   * @param {Function} errors manipula as mensagens de erro
   * @param {Object} label rótulo do Input Box
   * @param {Object} placeholder placeholder do box
   * @param {Object} register define parâmetros de register 
   * @param {*} required marca a Box como um campo obrigatório (true)
   * ou opcional (false) (padrão: "Obrigatório" - força o campo como
   * obrigatório, com o texto "Obrigatório")
   * @param {Object} options opções disponíveis do checkbox, que são
   * passadas na forma de um array
   * @param {Boolean} isLoaded realiza a animação diretamente (true) ou
   * não. Caso seja colocado em false, deve ser transmitido um valor para
   * realizar o carregamento do Skeleton (padrão: true - ativa a animação
   * automaticamente)
   * @param {Function} onChange transmite um callback após a validação
   * do campo
   * @param {Object} value dados do formulário. Pode ser utilizado juntamente
   * com setValue para receber os valores por meio de função
   * @param {Function} setValue provê uma função que entrega dados do 
   * formulário, de acordo com seu id.
   * @returns {Component} componente estilizado com máscara
   */
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
  