import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { signIn, signOut, getSession, useSession } from "next-auth/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import {
  FiBold,
  FiCheck,
  FiItalic,
  FiMoreHorizontal,
  FiPlus,
  FiUnderline,
  FiX,
} from "react-icons/fi";
import { Table } from "components/Table";
import { Overlay } from "components/Overlay";
import { InputBox } from "components/Inputs/InputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { useForm } from "react-hook-form";
import { InputTextBox } from "components/Inputs/InputTextBox";

import { TextEditor } from "components/TextEditor";
import { axios } from "services/apiService";

export default function Oficios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState();
  const [templatesFromBd, setTemplatesFromBd] = useState();
  const {
    isOpen: addMaterialIsOpen,
    onOpen: addMaterialOnOpen,
    onClose: addMaterialOnClose,
  } = useDisclosure();
  const formSubmit = useDisclosure();

  const columns = useMemo(
    () => [
      {
        Header: "Título do Ofício",
        accessor: "titulo_oficio",
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
          <IconButton
            icon={<FiMoreHorizontal />}
            onClick={() => setSelectedRow(props?.row?.original)}
            variant="outline"
            colorScheme="brand1"
          />
        ),
        Footer: false,
      },
    ],
    []
  );

  const data = useMemo(() => templatesFromBd, [templatesFromBd]);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm();

  const onSubmit = (formData, e) => {
    formSubmit.onOpen();
    e.preventDefault();
    console.log(formData);
    axios
      .post(`/api/${entity}/oficios`, formData)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          formSubmit.onClose();
          addMaterialOnClose();
          reset({});
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
  }, [asPath]);

  useEffect(() => {
    axios
      .get(`/api/${entity}/oficios`)
      .then((res) => {
        if (res.status === 200) {
          setTemplatesFromBd(res.data);
          console.log(res.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading size="md">Ofícios</Heading>
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
      </AnimatePresenceWrapper>
      <Overlay
        onClose={() => {
          addMaterialOnClose();
          reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        // isOpen={true}
        isOpen={addMaterialIsOpen}
        header={
          selectedRow
            ? "Editar Template de Ofício"
            : "Adicionar Template de Ofício"
        }
        closeButton
        size="full"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <InputBox
              id="titulo_oficio"
              register={register}
              errors={errors}
              label="Título do Ofício"
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
            <TextEditor
              id="template"
              register={register}
              errors={errors}
              label="Template"
              colorScheme="brand1"
              setValue={setValue}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formSubmit.isOpen}
              loadingText="Salvando"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </form>
      </Overlay>
    </>
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

Oficios.auth = false;
Oficios.dashboard = true;
