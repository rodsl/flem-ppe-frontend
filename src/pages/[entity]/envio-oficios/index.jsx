import {
  Box,
  Button,
  chakra,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Image,
  IconButton,
  Stack,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  VStack,
  Divider,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Modal,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useConst, useEffect, useMemo, useRef, useState } from "react";
import { signIn, signOut, getSession, useSession } from "next-auth/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import {
  FiBold,
  FiCheck,
  FiEdit,
  FiItalic,
  FiMoreHorizontal,
  FiPlus,
  FiTrash2,
  FiUnderline,
  FiX,
} from "react-icons/fi";
import { Table } from "components/Table";
import { Overlay } from "components/Overlay";
import { InputBox } from "components/Inputs/InputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { useForm, useFormState } from "react-hook-form";
import { InputTextBox } from "components/Inputs/InputTextBox";
import { Logo } from "components/Logo";
import { TextEditor } from "components/TextEditor";
import { axios } from "services/apiService";
import { MenuIconButton } from "components/Menus/MenuIconButton";

export default function TemplateOficios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState();
  const [templatesFromBd, setTemplatesFromBd] = useState();
  const [tiposFromBd, setTiposFromBd] = useState();
  const addTemplateOficio = useDisclosure();
  const formSubmit = useDisclosure();
  const tipoOficioFormSubmit = useDisclosure();
  const addTipoOficio = useDisclosure();
  const excluirTemplateOficio = useDisclosure();

  const columns = useMemo(
    () => [
      {
        Header: "Título do Ofício",
        accessor: "titulo",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "tipo",
        accessor: "tipo.sigla",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
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
                      addTemplateOficio.onOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      excluirTemplateOficio.onOpen();
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

  const data = useMemo(() => templatesFromBd, [templatesFromBd]);

  const formTemplateOficio = useForm({
    mode: "onChange",
  });

  const formTipoOficio = useForm({
    mode: "onChange",
  });

  const { isValid: formTipoOficioValidation } = useFormState({
    control: formTipoOficio.control,
  });

  const onSubmit = (formData, e) => {
    formSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return axios
        .put(`/api/${entity}/oficios`, formData)
        .then((res) => {
          if (res.status === 200) {
            formSubmit.onClose();
            addTemplateOficio.onClose();
            setSelectedRow(null);
            reset({});
          }
        })
        .catch((error) => console.log(error))
        .finally(() => formSubmit.onClose());
    }
    axios
      .post(`/api/${entity}/oficios`, formData)
      .then((res) => {
        if (res.status === 200) {
          formSubmit.onClose();
          addTemplateOficio.onClose();
          setSelectedRow(null);
          reset({});
        }
      })
      .catch((error) => console.log(error))
      .finally(() => formSubmit.onClose());
  };

  const onSubmitTipoOficio = (formData, e) => {
    e.preventDefault();
    tipoOficioFormSubmit.onOpen();
    axios
      .post(`/api/${entity}/oficios/tipos`, formData)
      .then((res) => {
        if (res.status === 200) {
          tipoOficioFormSubmit.onClose();
          addTipoOficio.onClose();
          setSelectedRow(null);
          formTipoOficio.reset({});
        }
      })
      .catch((error) => console.log(error));
  };

  const deleteTemplateOficio = (formData) => {
    formSubmit.onOpen();
    axios
      .delete(`/api/${entity}/oficios`, {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluirTemplateOficio.onClose();
          formSubmit.onClose();
          setSelectedRow(null);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  useEffect(() => {
    axios
      .get(`/api/${entity}/oficios`)
      .then((res) => {
        if (res.status === 200) {
          setTemplatesFromBd(res.data);
        }
      })
      .catch((error) => console.log(error));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addTemplateOficio.isOpen,
    addTemplateOficio.isOpen,
    excluirTemplateOficio.isOpen,
  ]);

  useEffect(() => {
    axios
      .get(`/api/${entity}/oficios/tipos`)
      .then((res) => {
        if (res.status === 200) {
          setTiposFromBd(res.data);
        }
      })
      .catch((error) => console.log(error));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTemplateOficio.isOpen, addTipoOficio.isOpen]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading size="md">Envio de Ofícios</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addTemplateOficio.onOpen}
          >
            Adicionar
          </Button>
        </Flex>
        <Table data={data} columns={columns} />
      </AnimatePresenceWrapper>

      {/* Adicionar template de oficio Overlay  */}
      <Overlay
        onClose={() => {
          addTemplateOficio.onClose();
          formTemplateOficio.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        isOpen={addTemplateOficio.isOpen && !addTipoOficio.isOpen}
        header={
          selectedRow
            ? "Editar Template de Ofício"
            : "Adicionar Template de Ofício"
        }
        closeButton
        size="full"
      >
        <chakra.form
          onSubmit={formTemplateOficio.handleSubmit(onSubmit)}
          w="100%"
        >
          <Stack spacing={4}>
            <HStack justifyContent="space-between">
              <Box w="100%">
                <SelectInputBox
                  id="tipo"
                  register={formTemplateOficio.register}
                  errors={formTemplateOficio.formState.errors}
                  label="Tipo do Template"
                  colorScheme="brand1"
                  options={
                    tiposFromBd &&
                    tiposFromBd.map((tipo) => ({
                      id: tipo.id,
                      value: tipo.id,
                      label: `${tipo.sigla} - ${tipo.descricao}`,
                    }))
                  }
                  placeholder="Selecione..."
                  defaultValue={selectedRow?.tipo.id}
                />
              </Box>
              <Box alignSelf="flex-start">
                <Button
                  p={2}
                  mt={8}
                  shadow="md"
                  colorScheme="brand1"
                  onClick={addTipoOficio.onOpen}
                >
                  <Icon as={FiPlus} boxSize={6} />
                </Button>
              </Box>
            </HStack>
            <InputBox
              id="titulo"
              register={formTemplateOficio.register}
              errors={formTemplateOficio.formState.errors}
              label="Título do Template"
              colorScheme="brand1"
              defaultValue={selectedRow?.titulo}
            />
            <InputTextBox
              id="descricao"
              register={formTemplateOficio.register}
              errors={formTemplateOficio.formState.errors}
              label="Descrição"
              colorScheme="brand1"
              defaultValue={selectedRow?.descricao}
              required={false}
            />
            <TextEditor
              id="conteudo"
              register={formTemplateOficio.register}
              errors={formTemplateOficio.formState.errors}
              label="Template"
              colorScheme="brand1"
              setValue={formTemplateOficio.setValue}
              loadOnEditor={selectedRow?.conteudo}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formSubmit.isOpen}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Adicionar tipo de oficio Overlay  */}
      <Overlay
        isOpen={addTipoOficio.isOpen}
        onClose={() => {
          addTipoOficio.onClose();
          formTipoOficio.reset({});
        }}
        closeButton
        header="Adicionar Tipo de Ofício"
      >
        <chakra.form
          onSubmit={formTipoOficio.handleSubmit(onSubmitTipoOficio)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox
              id="sigla"
              register={formTipoOficio.register}
              errors={formTipoOficio.formState.errors}
              onChange={(e) =>
                formTipoOficio.setValue("sigla", e.target.value.toUpperCase())
              }
              label="Sigla"
              colorScheme="brand1"
              maxLength={{
                value: "2",
                message: "A sigla deve conter 2 letras",
              }}
              minLength={{
                value: "2",
                message: "A sigla deve conter 2 letras",
              }}
            />
            <InputBox
              id="descricao"
              register={formTipoOficio.register}
              errors={formTipoOficio.formState.errors}
              label="Descrição"
              colorScheme="brand1"
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={tipoOficioFormSubmit.isOpen}
              isDisabled={!formTipoOficioValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir template de oficio Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluirTemplateOficio.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluirTemplateOficio.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Material</Box>{" "}
            <Icon
              as={FiTrash2}
              color="white"
              bg="red.500"
              rounded="lg"
              shadow="lg"
              boxSize={10}
              p={2}
            />
          </ModalHeader>
          <Divider />
          <ModalBody pb={6}>
            <VStack my={3} spacing={6}>
              <Heading size="md">Deseja excluir o seguinte template?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.titulo}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteTemplateOficio(selectedRow);
                    setSelectedRow(null);
                  }}
                  isLoading={formSubmit.isOpen}
                  loadingText="Aguarde"
                >
                  Excluir
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    excluirTemplateOficio.onClose();
                    setSelectedRow(null);
                  }}
                >
                  Cancelar
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
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

TemplateOficios.auth = false;
TemplateOficios.dashboard = true;
