import {
  background,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from "@chakra-ui/react";
import { forwardRef, useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export const PasswordInputBox = forwardRef(
  (
    {
      id,
      errors,
      register,
      required = "Obrigatório",
      validate,
      onChange,
      ...props
    },
    ref
  ) => {
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef(null);
    const mergeRef = useMergeRefs(inputRef, ref);

    const onClickReveal = () => {
      onToggle();

      if (inputRef.current) {
        inputRef.current.focus({
          preventScroll: true,
        });
      }
    };

    return (
      <Box>
        <FormControl id={id} isInvalid={errors[id]}>
          <FormLabel>Senha</FormLabel>
          <InputGroup>
            <InputRightElement>
              <IconButton
                variant="link"
                aria-label={isOpen ? "Mask password" : "Reveal password"}
                icon={isOpen ? <HiEyeOff /> : <HiEye />}
                onClick={onClickReveal}
                _focus={{ background: "transparent" }}
              />
            </InputRightElement>
            <Input
              ref={mergeRef}
              type={isOpen ? "text" : "password"}
              autoComplete="current-password"
              {...register(id, {
                required: required,
                validate: validate,
                onChange: onChange,
              })}
              {...props}
            />
          </InputGroup>
          <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
        </FormControl>
      </Box>
    );
  }
);
PasswordInputBox.displayName = "PasswordField";
