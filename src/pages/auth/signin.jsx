import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  useBreakpointValue,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { getCsrfToken } from "next-auth/react";
import { InputBox } from "components/Inputs/InputBox";
import { PasswordInputBox } from "components/Inputs/PasswordInputBox";
import { Logo } from "components/Logo";
import { BrandBg } from "components/Logo/BrandBG";
import { useForm } from "react-hook-form";
import { apiService } from "services/apiService";

export default function Signin({ csrfToken, ...props }) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    apiService("auth/callback/credentials", options)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => {
        console.log(err)
      });
  };

  return (
    <Box
      bg={mode(
        useBreakpointValue({
          base: "white",
          sm: "transparent",
        }),
        "gray.800"
      )}
    >
      <Box
        position="fixed"
        bottom="350px"
        right="-350px"
        zIndex="hide"
        opacity={useBreakpointValue({
          base: "0.15",
          md: "0.4",
        })}
      >
        <BrandBg h="90vh" />
      </Box>
      <Container
        maxW="lg"
        py={{
          base: "12",
          md: "24",
        }}
        px={{
          base: "0",
          sm: "8",
        }}
        minH={["100vh", ""]}
      >
        <Stack spacing={4} mb={8}>
          <Flex h={[8, 16]} justifyContent="center">
            <Logo />
          </Flex>
          <Flex flexDir="column" alignContent="center">
            <Heading align="center" mb={6} color="gray.700">
              Portal PPE
            </Heading>
            <Heading
              align="center"
              color="gray.500"
              size={useBreakpointValue({
                base: "sm",
                md: "md",
              })}
              px={4}
            >
              Portal de Administração e Monitoramento do Programa Primeiro
              Emprego
            </Heading>

            <Heading
              align="center"
              size={useBreakpointValue({
                base: "sm",
                md: "md",
              })}
              mt={[3, 6]}
            >
              Faça o logon com suas credenciais
            </Heading>
          </Flex>
        </Stack>
        <Box
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={mode(
            "white",
            useBreakpointValue({
              base: "inherit",
              sm: "gray.700",
            })
          )}
          boxShadow={{
            base: "none",
            sm: "md",
          }}
          borderRadius={{
            base: "none",
            sm: "xl",
          }}
        >
          <Stack spacing="6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="5">
                <InputBox
                  id="username"
                  type="text"
                  errors={errors}
                  label="Usuário"
                  register={register}
                />

                <PasswordInputBox
                  id="password"
                  errors={errors}
                  register={register}
                />
              </Stack>
              <HStack justify="flex-end" my={4}>
                {/* <Checkbox defaultIsChecked>Remember me</Checkbox> */}
                <Button variant="link" colorScheme="blue" size="sm">
                  Esqueceu a senha?
                </Button>
              </HStack>
              <Stack spacing="6">
                <Button variant="solid" type="submit" colorScheme="brand1">
                  Entrar
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Container>
      <form method="post" action="/api/auth/callback/credentials">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Username
          <input name="username" type="text" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </Box>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
