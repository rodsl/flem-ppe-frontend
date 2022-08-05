import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  useDisclosure,
  VStack,
  Divider,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Modal,
  Fade,
  useToast,
  useBreakpointValue,
  ScaleFade,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import {
  FiEdit,
  FiEye,
  FiMoreHorizontal,
  FiSend,
  FiTrash2,
} from "react-icons/fi";
import { Table } from "components/Table";
import { Overlay } from "components/Overlay";
import { InputBox } from "components/Inputs/InputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { axios } from "services/apiService";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { EmailEditor } from "components/EmailEditor";
import ChakraTagInput from "components/Inputs/TagInput";
import { cpfMask } from "masks-br";
import { useCustomForm } from "hooks/useCustomForm";
import { TextViewer } from "components/TextViewer";
import { maskCapitalize } from "utils/maskCapitalize";
import { DateTime } from "luxon";

export default function TemplateOficios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState();
  const [oficiosFromBd, setOficiosFromBd] = useState();
  const [templatesFromBd, setTemplatesFromBd] = useState();
  const [emailsRemetentesFromBd, setEmailsRemetentesFromBd] = useState([]);
  const [nomeEvento, setNomeEvento] = useState("");
  const viewTemplate = useDisclosure();
  const formSubmit = useDisclosure();
  const enviarOficioModal = useDisclosure();
  const enviarOficioSubmit = useDisclosure();
  const excluirOficioModal = useDisclosure();
  const formEnvioOficio = useCustomForm();
  const fetchTableData = useDisclosure();
  const toast = useToast();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });

  const columns = useMemo(
    () => [
      {
        Header: "código",
        accessor: "codOficio",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "adicionado em",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <Box>
            {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT)}h
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "assunto",
        accessor: "assunto",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "remetente",
        accessor: "remetenteOficio",
        Cell: ({ value }) => (
          <Box minW={200}>
            {value.nome} - {value.email}
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "Beneficiários associados",
        accessor: "benefAssoc",
        Cell: ({ value }) => (
          <Box minW={200}>
            {value.map((benef, idx, arr) => {
              if (idx < 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={benef.id}>
                    {maskCapitalize(benef.nome)}
                  </Text>
                );
              }
              if (idx === 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={benef.id} as="i">
                    e outros {arr.length - idx}...
                  </Text>
                );
              }
            })}
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "enviado?",
        accessor: "enviosOficios",
        Cell: ({ value, row: { original } }) => (
          <Box minW={200}>
            {value.length === 0 && "Não"}
            {value.length === original.benefAssoc.length && "Sim"}
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "Ações",
        Cell: ({ row: { original } }) => (
          <MenuIconButton
            isDisabled={
              original.benefAssoc.length === original.enviosOficios.length
            }
            icon={<FiMoreHorizontal />}
            menuItems={[
              {
                menuGroupLabel: null,
                menuGroupButtons: [
                  {
                    text: "Editar",
                    icon: <FiEdit />,
                    onClick: () => {
                      setSelectedRow(original);
                      formEnvioOficio.openOverlay();
                    },
                  },
                  {
                    text: "Enviar",
                    icon: <FiSend />,
                    onClick: () => {
                      setSelectedRow(original);
                      enviarOficioModal.onOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(original);
                      excluirComunicado.onOpen();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const data = useMemo(() => oficiosFromBd, [oficiosFromBd]);

  const onSubmit = (formData, e) => {
    formEnvioOficio.setLoading();
    e.preventDefault();
    if (selectedRow) {
      return axios
        .put(`/api/${entity}/oficios/gerenciar`, formData, {
          params: { id: selectedRow.id },
        })
        .then((res) => {
          if (res.status === 200) {
            formEnvioOficio.setLoaded();
            formEnvioOficio.closeOverlay();
            setSelectedRow(null);
            toast({
              title: "Ofício atualizado com sucesso",
              status: "success",
              duration: 5000,
              isClosable: false,
              position,
            });
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            formEnvioOficio.setLoaded();
            toast({
              title: "Título já existe",
              status: "error",
              duration: 5000,
              isClosable: false,
              position,
            });
          } else {
            throw new Error(error.response.data);
          }
        });
    }
    axios
      .post(`/api/${entity}/oficios/gerenciar`, formData)
      .then((res) => {
        if (res.status === 200) {
          formEnvioOficio.setLoaded();
          formEnvioOficio.closeOverlay();
          setSelectedRow(null);
          toast({
            title: "Ofício adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          formEnvioOficio.setLoaded();
          toast({
            title: "Título já existe",
            status: "error",
            duration: 5000,
            isClosable: false,
            position,
          });
        } else {
          throw new Error(error);
        }
      });
  };

  const deleteTemplateOficio = (formData) => {
    excluirOficioSubmit.onOpen();
    axios
      .delete(`/api/${entity}/oficios/gerenciar`, {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluirOficioModal.onClose();
          excluirOficioSubmit.onClose();
          setSelectedRow(null);
        }
      })
      .catch((error) => console.log(error));
  };

  const onSubmitEnviarOficio = (formData) => {
    enviarOficioSubmit.onOpen();
    axios
      .post(`/api/${entity}/oficios/enviar`, formData)
      .then((res) => {
        if (res.status === 200) {
          enviarOficioSubmit.onClose();
          enviarOficioModal.onClose();
          setSelectedRow(null);
          toast({
            title: "Ofício pronto para envio.",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        throw new Error(error.response.data);
      })
      .finally(() => enviarOficioSubmit.onClose());
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
    fetchTableData.onOpen();
    axios
      .get(`/api/${entity}/oficios/gerenciar`)
      .then((res) => {
        if (res.status === 200) {
          setOficiosFromBd(res.data);
        }
      })
      .catch((error) => console.log(error))
      .finally(fetchTableData.onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formEnvioOficio.overlayIsOpen,
    enviarOficioModal.isOpen,
    excluirOficioModal.isOpen,
  ]);

  useEffect(() => {
    axios
      .get(`/api/${entity}/oficios`)
      .then((res) => {
        if (res.status === 200) {
          const templatesOptions = res.data.map((template) => ({
            id: template.id,
            value: template.id,
            label: `${template.tipo.sigla} - ${template.titulo}`,
            conteudo: template.conteudo,
          }));
          setTemplatesFromBd(templatesOptions);
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios
      .get(`/api/${entity}/comunicados/remetentes`)
      .then((res) => {
        if (res.status === 200) {
          setEmailsRemetentesFromBd(
            res.data.map(({ id, email, nome }) => ({
              value: id,
              id,
              label: `${nome} - ${email}`,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formWatchAssunto = formEnvioOficio.control.watch("assunto");
  const formWatchTemplate = formEnvioOficio.control.watch("templateOficio");

  useEffect(() => {
    setNomeEvento(formWatchAssunto);
  }, [formWatchAssunto]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading size="md">Envio de Ofícios</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiSend />}
            onClick={formEnvioOficio.openOverlay}
          >
            Novo Envio
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
      </AnimatePresenceWrapper>

      {/* Adicionar template de oficio Overlay  */}
      <Overlay
        onClose={() => {
          formEnvioOficio.closeOverlay();
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        size="lg"
        isOpen={formEnvioOficio.overlayIsOpen}
        header={selectedRow ? "Editar Envio de Ofício" : "Enviar Ofício"}
        closeButton
      >
        <chakra.form onSubmit={formEnvioOficio.handleSubmit(onSubmit)} w="100%">
          <Stack spacing={4}>
            <SelectInputBox
              id="templateOficio"
              formControl={formEnvioOficio.control}
              label="Template de Ofício"
              colorScheme="brand1"
              options={templatesFromBd}
              placeholder="Selecione..."
              defaultValue={
                selectedRow
                  ? templatesFromBd &&
                    templatesFromBd.filter(
                      ({ id }) => id === selectedRow.templateOficio_Id
                    )
                  : null
              }
              inputRightElement={
                <IconButton
                  variant="ghost"
                  colorScheme="brand1"
                  aria-label="Ver"
                  h={9}
                  w={4}
                  icon={<FiEye />}
                  isDisabled={!formWatchTemplate}
                  onClick={viewTemplate.onOpen}
                />
              }
            />
            <SelectInputBox
              id="emailRemetente"
              formControl={formEnvioOficio.control}
              label="E-mail Rementente"
              colorScheme="brand1"
              options={emailsRemetentesFromBd}
              placeholder="Selecione..."
              defaultValue={
                selectedRow
                  ? emailsRemetentesFromBd &&
                    emailsRemetentesFromBd.filter(
                      ({ id }) => id === selectedRow.remetenteOficio_Id
                    )
                  : null
              }
            />
            <InputBox
              id="assunto"
              label="Assunto"
              formControl={formEnvioOficio.control}
              defaultValue={selectedRow?.assunto}
            />
          </Stack>
          <Fade in={nomeEvento && nomeEvento.length >= 1} unmountOnExit>
            <Stack spacing={4}>
              <EmailEditor
                id="conteudoEmail"
                title={"Corpo do E-mail "}
                formControl={formEnvioOficio.control}
                loadOnEditor={selectedRow?.conteudoEmail}
              />
              <ChakraTagInput
                id="benefAssoc"
                formControl={formEnvioOficio.control}
                label="Beneficiários"
                placeholder="Matrículas ou CPFs separados por vírgula"
                mask={cpfMask}
                defaultValues={selectedRow?.benefAssoc.map(
                  ({ matriculaFlem }) => ({
                    value: matriculaFlem,
                    label: matriculaFlem,
                    isInvalid: false,
                  })
                )}
              />
            </Stack>
          </Fade>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formEnvioOficio.isLoading}
              isDisabled={!formEnvioOficio.validation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* View template de oficio Overlay  */}
      <Overlay
        onClose={viewTemplate.onClose}
        size="full"
        isOpen={viewTemplate.isOpen}
        header="Visualizar Template"
        placement="left"
        closeButton
      >
        <TextViewer
          loadOnEditor={
            templatesFromBd &&
            formWatchTemplate &&
            templatesFromBd.find(
              (template) => template.id === formWatchTemplate
            ).conteudo
          }
        />
      </Overlay>

      {/* Excluir ofício Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluirOficioModal.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluirOficioModal.onClose}
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
                    excluirOficioModal.onClose();
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

      {/* Enviar ofício Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={enviarOficioModal.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={enviarOficioModal.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Enviar Comunicado</Box>
            <Icon
              as={FiSend}
              color="white"
              bg="brand1.500"
              rounded="lg"
              shadow="lg"
              boxSize={10}
              p={2}
            />
          </ModalHeader>
          <Divider />
          <ModalBody pb={6}>
            <VStack my={3} spacing={6}>
              <Heading size="md">Deseja enviar o seguinte ofício?</Heading>
              <Text fontSize="xl" align="center">
                #{selectedRow?.codOficio} - {selectedRow?.assunto}
              </Text>
              <HStack>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={() => {
                    onSubmitEnviarOficio(selectedRow);
                  }}
                  isLoading={enviarOficioSubmit.isOpen}
                  loadingText="Aguarde"
                >
                  Enviar
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    enviarOficioModal.onClose();
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
