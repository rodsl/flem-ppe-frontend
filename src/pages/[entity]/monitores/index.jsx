import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  HStack,
  Icon,
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
  useBreakpointValue,
  useToast,
  ScaleFade,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { Table } from "components/Table";
import { Overlay } from "components/Overlay";
import { InputBox } from "components/Inputs/InputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { useForm, useFormState } from "react-hook-form";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { axios } from "services/apiService";
import { InputTextBox } from "components/Inputs/InputTextBox";

export default function AcoesCR({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [demandantesFromBd, setAcoesCRFromBd] = useState([]);
  const [colaboradoresFromRh, setColaboradoresFromRh] = useState([]);
  const addAcao = useDisclosure();
  const demandanteFormSubmit = useDisclosure();
  const excluir = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const toast = useToast();

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "codAcao",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Ação",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Descrição",
        accessor: "descricao",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Atribuído a",
        accessor: "atribuido",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Beneficiários associados",
        accessor: "benefAssoc",
        Cell: ({ value }) => <Box minW={200}>{value[0].nome}</Box>,
        Footer: false,
      },
      {
        Header: "Status conclusão",
        accessor: "status",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
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
                      addAcao.onOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      excluir.onOpen();
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

  const data = useMemo(() => demandantesFromBd, [demandantesFromBd]);

  const formAcao = useForm({
    mode: "onChange",
  });

  const { isValid: formSituacaoVagaValidation } = useFormState({
    control: formAcao.control,
  });

  const onSubmit = (formData, e) => console.log(formData);

  const onSubmitDemandante = (formData, e) => {
    demandanteFormSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return axios
        .put(`/api/${entity}/acoes-cr`, formData)
        .then((res) => {
          if (res.status === 200) {
            demandanteFormSubmit.onClose();
            addAcao.onClose();
            setSelectedRow(null);
            formAcao.reset({});
            toast({
              title: "Demandante aualizado com sucesso",
              status: "success",
              duration: 5000,
              isClosable: false,
              position,
            });
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            demandanteFormSubmit.onClose();
            toast({
              title: "Demandante já existe",
              status: "error",
              duration: 5000,
              isClosable: false,
              position,
            });
          } else {
            throw new Error(error);
          }
        });
    }
    axios
      .post(`/api/${entity}/acoes-cr`, formData)
      .then((res) => {
        if (res.status === 200) {
          demandanteFormSubmit.onClose();
          addAcao.onClose();
          setSelectedRow(null);
          formAcao.reset({});
          toast({
            title: "Demandante adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          demandanteFormSubmit.onClose();
          toast({
            title: "Demandante já existe",
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

  const deleteDemandante = (formData) => {
    demandanteFormSubmit.onOpen();
    axios
      .delete(`/api/${entity}/demandantes`, {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluir.onClose();
          demandanteFormSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Demandante excluído com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
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
      .get(`/api/${entity}/acoes-cr`)
      .then((res) => {
        if (res.status === 200) {
          setAcoesCRFromBd(res.data);
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addAcao.isOpen, excluir.isOpen]);

  useEffect(() => {
    fetchTableData.onOpen();
    axios
      .get(`/api/${entity}/funcionarios`, {
        params: {
          id_departamento: 125,
          id_situacao: 1,
          condition: "AND",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setColaboradoresFromRh(res.data);
        }
      })
      .catch((error) => console.log(error))
      .finally(fetchTableData.onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading size="md">Monitores</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addAcao.onOpen}
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
      </AnimatePresenceWrapper>

      {/* Adicionar demandante Overlay  */}
      <Overlay
        onClose={() => {
          addAcao.onClose();
          formAcao.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        isOpen={addAcao.isOpen}
        header={selectedRow ? "Editar Ação" : "Adicionar Ação"}
        closeButton
      >
        <chakra.form
          onSubmit={formAcao.handleSubmit(onSubmitDemandante)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox
              id="nome"
              label="Nome"
              formControl={formAcao}
              defaultValue={selectedRow?.nome}
            />
            <InputTextBox
              id="descricao"
              label="Descrição da Ação"
              formControl={formAcao}
              defaultValue={selectedRow?.descricao}
            />
            <SelectInputBox
              id="colabAcaoCR"
              label="Atribuir ação a"
              formControl={formAcao}
              defaultValue={selectedRow?.nome}
              required={false}
            />
            <SelectInputBox
              id="benefAssoc"
              label="Beneficiários Associados"
              formControl={formAcao}
              defaultValue={selectedRow?.nome}
              required={false}
              isMulti
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={demandanteFormSubmit.isOpen}
              isDisabled={!formSituacaoVagaValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir demandante Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluir.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluir.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Demandante</Box>
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
              <Heading size="md">Deseja excluir o seguinte demandante?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.sigla} - {selectedRow?.nome}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteDemandante(selectedRow);
                  }}
                  isLoading={demandanteFormSubmit.isOpen}
                  loadingText="Aguarde"
                >
                  Excluir
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    excluir.onClose();
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

AcoesCR.auth = false;
AcoesCR.dashboard = true;
