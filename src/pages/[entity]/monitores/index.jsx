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
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { useForm, useFormState } from "react-hook-form";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { axios, bdRhService } from "services/apiService";
import { maskCapitalize } from "utils/maskCapitalize";
import _ from "lodash";

export default function Monitores({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [monitoresFromBd, setMonitoresFromBd] = useState([]);
  const [colaboradoresFromRh, setColaboradoresFromRh] = useState([]);
  const [escritoriosFromBd, setEscritoriosFromBd] = useState([]);
  const [demandantesFromBd, setDemandantesFromBd] = useState([]);
  const addMonitor = useDisclosure();
  const monitorFormSubmit = useDisclosure();
  const excluirMonitor = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const fetchRhApiData = useDisclosure();
  const toast = useToast();

  const formMonitor = useForm({
    mode: "onChange",
  });

  const { isValid: formMonitorValidation } = useFormState({
    control: formMonitor.control,
  });

  const columns = useMemo(
    () => [
      {
        Header: "Matrícula",
        accessor: "matricula",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Monitor",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{maskCapitalize(value)}</Box>,
        Footer: false,
      },
      {
        Header: "Escritórios Atribuídos",
        accessor: "escritoriosRegionais",
        Cell: ({ value }) => (
          <Box minW={200}>
            {value.map((colab, idx, arr) => {
              if (idx < 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={colab.id}>
                    {maskCapitalize(colab.nome)}
                  </Text>
                );
              }
              if (idx === 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={colab.id} as="i">
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
        Header: "Demandantes Atribuídos",
        accessor: ({ demandantes }) =>
          demandantes.map(({ id, sigla, nome }) => ({
            id,
            nome: `${sigla} - ${nome}`,
          })),
        Cell: ({ value }) => (
          <Box minW={200}>
            {value.map(({ id, nome }, idx, arr) => {
              if (idx < 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={id}>
                    {maskCapitalize(nome)}
                  </Text>
                );
              }
              if (idx === 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={id} as="i">
                    e outros {arr.length - idx}...
                  </Text>
                );
              }
            })}
          </Box>
          // <>{JSON.stringify(value)}</>
        ),
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
                      addMonitor.onOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      excluirMonitor.onOpen();
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

  const data = useMemo(() => monitoresFromBd, [monitoresFromBd]);

  const colaboradoresOptions = useMemo(
    () =>
      _.isArray(colaboradoresFromRh) &&
      colaboradoresFromRh.map(({ matriculaDominio, nome }) => ({
        value: matriculaDominio.toString(),
        label: `${matriculaDominio} - ${maskCapitalize(nome)}`,
        isDisabled: monitoresFromBd.find(
          ({ matricula }) => matricula === matriculaDominio
        ),
      })),
    [monitoresFromBd]
  );

  const demandantesOptions = useMemo(
    () =>
      demandantesFromBd
        .filter(({ vagas }) => {
          const escritoriosRegionaisIds = vagas.map(
            ({ municipio: { escritorio_RegionalId } }) => escritorio_RegionalId
          );
          const idsEscritoriosSelecionados = formMonitor
            .getValues("erAssoc")
            ?.map(({ value }) => value);

          return !_.isEmpty(
            escritoriosRegionaisIds?.filter((id) =>
              idsEscritoriosSelecionados?.includes(id)
            )
          );
        })
        .map(({ id, nome, sigla }) => ({
          value: id,
          label: `${sigla} - ${nome}`,
        })),
    [formMonitor.watch("erAssoc")]
  );

  const onSubmitMonitor = (formData, e) => {
    monitorFormSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return axios
        .put(`/api/${entity}/monitores`, formData)
        .then((res) => {
          if (res.status === 200) {
            monitorFormSubmit.onClose();
            addMonitor.onClose();
            setSelectedRow(null);
            formMonitor.reset({});
            toast({
              title: "Monitor(a) aualizado(a) com sucesso",
              status: "success",
              duration: 5000,
              isClosable: false,
              position,
            });
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            monitorFormSubmit.onClose();
            toast({
              title: "Monitor(a) já existe",
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

    formData.monitor = colaboradoresFromRh.find(
      ({ matriculaDominio }) => matriculaDominio === parseInt(formData.monitor)
    );
    axios
      .post(`/api/${entity}/monitores`, formData)
      .then((res) => {
        if (res.status === 200) {
          monitorFormSubmit.onClose();
          addMonitor.onClose();
          setSelectedRow(null);
          formMonitor.reset({});
          toast({
            title: "Monitor(a) adicionado(a) com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          monitorFormSubmit.onClose();
          toast({
            title: "Monitor(a) já existe",
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

  const deleteMonitor = (formData) => {
    monitorFormSubmit.onOpen();
    axios
      .delete(`/api/${entity}/monitores`, {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluirMonitor.onClose();
          monitorFormSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Monitor(a) excluído(a) com sucesso",
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
    fetchTableData.onOpen();
    axios
      .get(`/api/${entity}/monitores`)
      .then((res) => {
        if (res.status === 200) {
          setMonitoresFromBd(res.data);
        }
      })
      .catch((error) => console.log(error))
      .finally(fetchTableData.onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMonitor.isOpen, excluirMonitor.isOpen]);

  useEffect(() => {
    fetchRhApiData.onOpen();
    const deptosToGetColab = [125, 131];
    bdRhService
      .get(`/funcionarios`, {
        params: {
          codDepto: JSON.stringify(deptosToGetColab),
          ativo: true,
        },
      })
      .then(({ data: { query } }) => setColaboradoresFromRh(query))
      .catch((err) => {
        console.log(err);
      })
      .finally(fetchRhApiData.onClose);
    axios
      .get(`/api/${entity}/escritorios-regionais`)
      .then((res) => {
        if (res.status === 200) {
          setEscritoriosFromBd(
            res.data.map(({ id, nome }) => ({
              value: id,
              label: nome,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
    axios
      .get(`/api/${entity}/demandantes`)
      .then((res) => {
        if (res.status === 200) {
          setDemandantesFromBd(res.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <AnimatePresenceWrapper
        router={router}
        isLoaded={!fetchTableData.isOpen && !fetchRhApiData.isOpen}
      >
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Monitores</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addMonitor.onOpen}
          >
            Adicionar
          </Button>
        </Flex>
        <Table data={data} columns={columns} />
      </AnimatePresenceWrapper>

      {/* Adicionar/Editor monitor Overlay  */}
      <Overlay
        onClose={() => {
          addMonitor.onClose();
          formMonitor.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        isOpen={addMonitor.isOpen}
        header={selectedRow ? "Editar Monitor" : "Adicionar Monitor"}
        closeButton
      >
        <chakra.form
          onSubmit={formMonitor.handleSubmit(onSubmitMonitor)}
          w="100%"
        >
          <Stack spacing={4}>
            <SelectInputBox
              id="monitor"
              label="Colaborador"
              formControl={formMonitor}
              options={colaboradoresOptions}
              defaultValue={
                !_.isEmpty(selectedRow) &&
                !_.isEmpty(colaboradoresOptions) &&
                colaboradoresOptions.find(
                  ({ value }) => parseInt(value) === selectedRow.matricula
                )
              }
              isDisabled={selectedRow}
              required={!selectedRow}
            />
            <SelectInputBox
              id="erAssoc"
              label="Escritórios Regionais Associados"
              formControl={formMonitor}
              options={escritoriosFromBd}
              defaultValue={
                selectedRow &&
                escritoriosFromBd.filter(({ value }) =>
                  selectedRow.escritoriosRegionais.find(
                    ({ id }) => id === value
                  )
                )
              }
              required={false}
              isMulti
            />
            <SelectInputBox
              id="demandantesAssociados"
              label="Demandantes Associados"
              formControl={formMonitor}
              options={demandantesOptions}
              defaultValue={
                selectedRow &&
                demandantesOptions.filter(({ value }) =>
                  selectedRow.demandantes.find(({ id }) => id === value)
                )
              }
              required={false}
              isMulti
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={monitorFormSubmit.isOpen}
              isDisabled={!formMonitorValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir monitor Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluirMonitor.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluirMonitor.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Monitor(a)</Box>
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
              <Heading size="md">Deseja excluir o seguinte Monitor(a)?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.matricula} - {maskCapitalize(selectedRow?.nome)}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteMonitor(selectedRow);
                  }}
                  isLoading={monitorFormSubmit.isOpen}
                  loadingText="Aguarde"
                >
                  Excluir
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    excluirMonitor.onClose();
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

Monitores.auth = true;
Monitores.dashboard = true;
