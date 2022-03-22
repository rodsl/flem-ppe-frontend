import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { signIn, signOut, getSession, useSession } from "next-auth/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { FiCheck, FiMoreHorizontal, FiPlus, FiX } from "react-icons/fi";
import { Table } from "components/Table";
import { Overlay } from "components/Overlay";
import { InputBox } from "components/Inputs/InputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { useForm } from "react-hook-form";
import { InputTextBox } from "components/Inputs/InputTextBox";

export default function Cadastro({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();

  const {
    isOpen: addMaterialIsOpen,
    onOpen: addMaterialOnOpen,
    onClose: addMaterialOnClose,
  } = useDisclosure();

  const columns = useMemo(
    () => [
      {
        Header: "Material",
        accessor: "nome_material",
        // Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "descrição",
        accessor: "descricao",
        // Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
        Footer: false,
      },
      {
        Header: "Ações",
        // Cell: (props) => (
        //   <IconButton
        //     icon={<FiMoreHorizontal />}
        //     onClick={() => console.log(props?.row?.original)}
        //     variant="outline"
        //     colorScheme="brand1"
        //   />
        // ),
        Footer: false,
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        nome_material: "Camisa Polo",
        descricao:
          "A camisa foi confecionada no modelo camisa polo em malha piquet PA, 60% poliéster e 40% algodão, na cor branca, com serigrafia (processo de impressão aplicável em tecido, frente, costas e mangas): marca da Carteira de Trabalho do lado esquerdo do peito, marca do governo da Bahia na manga do lado esquerdo e da Fundação Luís Eduardo Magalhães na maga do lado direito. Na parte de trás, centralizado horizontalmente e na parte superior: MAIS FORÇA PARA A JUVENTUDE VENCER",
      },
      {
        nome_material: "Jaleco",
        descricao: null,
      },
      {
        nome_material: "Avental",
        descricao: null,
      },
      {
        nome_material: "Crachá",
        descricao: null,
      },
      {
        nome_material: "Vale Alimentação",
        descricao: null,
      },
      {
        nome_material: "Vale Refeição",
        descricao: null,
      },
      {
        nome_material: "Vale Transporte",
        descricao: null,
      },
      {
        nome_material: "Máscara COVID 19",
        descricao: "Máscara a ser utilizada na prevenção do COVID19",
      },
    ],
    []
  );

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = (formData) => {
    console.log(formData)
  }

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
  }, [asPath]);

  return (
    <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
      <Flex justifyContent="space-between" alignItems="center" pb={5}>
        <Heading size="md">Materiais</Heading>
        <Button
          colorScheme="brand1"
          shadow="md"
          leftIcon={<FiPlus />}
          onClick={addMaterialOnOpen}
        >
          Adicionar
        </Button>
      </Flex>
      <Table data={data} columns={columns} />
      <Overlay
        onClose={addMaterialOnClose}
        // isOpen={true}
        isOpen={addMaterialIsOpen}
        header="Adicionar Material "
        closeButton
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <InputBox
              id="nome_material"
              register={register}
              errors={errors}
              label="Nome do Material"
              colorScheme="brand1"
            />
            <InputTextBox
              id="descricao"
              register={register}
              errors={errors}
              label="Descrição"
              colorScheme="brand1"
              required={false}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button colorScheme="brand1"
            type="submit"
            >Cadastrar</Button>
          </HStack>
        </form>
      </Overlay>
    </AnimatePresenceWrapper>
  );
}

export async function getServerSideProps(context) {
  const {
    params: { entity },
  } = context;
  const entities = ["ba", "to", "rj"];

  // const posts = await api.getContentList({
  //   referenceName: "posts",
  //   languageCode: "en-us"
  // });
  // const page = posts.items.find((post) => {
  //   return post.fields.slug === ctx.params.slug.join("/");
  // });

  const entityCheck = entities.find((ent) => ent === entity || undefined);

  return {
    props: {
      entity: entityCheck || null,
    },
  };
}

Cadastro.auth = false;
Cadastro.dashboard = true;
