/**
 * Página de Materiais
 * @module materiais
 */

import {
  Box,
  Button,
  Center,
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Spinner,
  Stack,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { signIn, signOut, getSession, useSession } from "next-auth/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import {
  FiCheck,
  FiEdit,
  FiMoreHorizontal,
  FiPlus,
  FiTrash2,
  FiUnlock,
  FiX,
} from "react-icons/fi";
import { Table } from "components/Table";
import { Overlay } from "components/Overlay";
import { InputBox } from "components/Inputs/InputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { useForm, useFormState } from "react-hook-form";
import { InputTextBox } from "components/Inputs/InputTextBox";
import { MenuIconButton } from "components/Menus/MenuIconButton";

/**
 * Renderiza o cadastro de materiais
 * @method Cadastro
 * @memberof module:materiais
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns página renderizada
 */
export default function Cadastro({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const {
    isOpen: addMaterialIsOpen,
    onOpen: addMaterialOnOpen,
    onClose: addMaterialOnClose,
  } = useDisclosure();
  const {
    isOpen: excluirMaterialIsOpen,
    onOpen: excluirMaterialOnOpen,
    onClose: excluirMaterialOnClose,
  } = useDisclosure();
  const formSubmit = useDisclosure();

  const columns = useMemo(
    () => [
      {
        Header: "Material",
        accessor: "nome_material",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "descrição",
        accessor: "descricao",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
        Footer: false,
      },
      {
        Header: "Ações",
        Cell: (props) => (
          // <IconButton
          //   icon={<FiMoreHorizontal />}
          //   onClick={() => setSelectedRow(props?.row?.original)}
          //   variant="outline"
          //   colorScheme="brand1"
          // />
          <MenuIconButton
            icon={<FiMoreHorizontal />}
            menuItems={[
              {
                menuGroupLabel: null,
                menuGroupButtons: [
                  {
                    text: "Editar",
                    icon: <FiEdit />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      setValue(
                        "nome_material",
                        props.row.original.nome_material
                      );
                      setValue("descricao", props.row.original.descricao);
                      addMaterialOnOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      excluirMaterialOnOpen();
                    },
                  },
                ],
              },
            ]}
            colorScheme="brand1"
          />
        ),
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

  const formAddMaterial = useForm({
    mode: "onChange",
  });

  const { isValid: formAddMaterialValidation } = useFormState({
    control: formAddMaterial.control,
  });

  const onSubmit = (formData) => {
    console.log(formData);
  };

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <ScaleFade in={fetchTableData.isOpen} initialScale={0.9} unmountOnExit>
        <Center h="90vh">
          <Spinner
            boxSize={20}
            color="brand1.500"
            thickness="4px"
            speed=".5s"
            emptyColor="gray.200"
          />
        </Center>
      </ScaleFade>
      <ScaleFade in={!fetchTableData.isOpen} initialScale={0.9} unmountOnExit>
        <Table data={data} columns={columns} />
      </ScaleFade>
      <Overlay
        onClose={() => {
          addMaterialOnClose();
          if (selectedRow) {
            formAddMaterial.reset({});
            setSelectedRow(null);
          }
        }}
        isOpen={addMaterialIsOpen}
        header={selectedRow ? "Editar Material" : "Adicionar Material"}
        closeButton
      >
        <chakra.form onSubmit={formAddMaterial.handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <InputBox
              id="nome_material"
              label="Nome do Material"
              formControl={formAddMaterial}
            />
            <InputTextBox
              id="descricao"
              label="Descrição"
              formControl={formAddMaterial}
              required={false}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formSubmit.isOpen}
              isDisabled={!formAddMaterialValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>
    </AnimatePresenceWrapper>
  );
}

/**
 * @method getServerSideProps
 * @param {*} context
 * @returns
 */
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
