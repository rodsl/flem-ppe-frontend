import {
  Box,
  Button,
  chakra,
  Collapse,
  Fade,
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
  InputRightElement,
  FormLabel,
  ScaleFade,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { DateTime } from "luxon";
import { Table } from "components/Table";
import { Overlay } from "components/Overlay";
import { InputBox } from "components/Inputs/InputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { useForm, useFormState } from "react-hook-form";
import { EmailEditor } from "components/EmailEditor";
import { axios } from "services/apiService";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { CheckboxInput } from "components/Inputs/CheckboxInput";
import ChakraTagInput from "components/Inputs/TagInput";
import { SwitchButton } from "components/Buttons/SwitchButton";
import { MaskedInputBox } from "components/Inputs/MaskedInputBox";
import { cepMask, cpfMask } from "masks-br";
import { maskCapitalize } from "utils/maskCapitalize";

export default function TemplateOficios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState();
  const [cepData, setCepData] = useState([]);
  const [eventosFromBd, setEventosFromBd] = useState([]);
  const [locaisEventosFromBd, setLocaisEventosFromBd] = useState([]);
  const [tiposEventoFromBd, setTiposEventoFromBd] = useState([]);
  const [municipiosFromBd, setMunicipiosFromBd] = useState([]);
  const [colaboradoresFromRh, setColaboradoresFromRh] = useState([]);
  const [beneficiariosFromRh, setBeneficiariosFromRh] = useState([]);
  const [emailAlerts, emailAlertsState] = useState(false);
  const [criarAcaoCR, setCriarAcaoCR] = useState(false);
  const [benefLote, setBenefLote] = useState(false);
  const [modalidade, setModalidade] = useState("");
  const [nomeEvento, setNomeEvento] = useState("");
  const tipoEventoFormSubmit = useDisclosure();
  const addEvento = useDisclosure();
  const formSubmit = useDisclosure();
  const localEventoFormSubmit = useDisclosure();
  const addLocalFormSubmit = useDisclosure();
  const addLoca = useDisclosure();
  const excluirTemplateOficio = useDisclosure();
  const addTipoEvento = useDisclosure();
  const addLocalEvento = useDisclosure();
  const buscaCep = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const toast = useToast();

  const columns = useMemo(
    () => [
      {
        Header: "Nome",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Data",
        accessor: "data",
        Cell: ({ value }) => (
          <Box minW={150}>
            {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED)}
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
        Header: "Local",
        accessor: "modalidade",
        Cell: ({ row: { original }, value }) => (
          <Box minW={200}>
            {value === "videoconferencia" && "Videoconferência"}
            {value === "presencial" && original.localEvento.nome}
          </Box>
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
                      addEvento.onOpen();
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
    []
  );

  const data = useMemo(() => eventosFromBd, [eventosFromBd]);

  const formAddEvento = useForm({
    mode: "onChange",
  });

  const formLocalEvento = useForm({
    mode: "onChange",
  });
  const formTipoEvento = useForm({
    mode: "onChange",
  });

  const { isValid: formAddEventoValidation } = useFormState({
    control: formAddEvento.control,
  });
  const { isValid: formLocalEventoValidation } = useFormState({
    control: formLocalEvento.control,
  });
  const { isValid: formTipoEventoValidation } = useFormState({
    control: formTipoEvento.control,
  });

  const onSubmitAddEvento = (formData, e) => {
    formSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      formData.acao_CrId = selectedRow.acao_CrId;
      return axios
        .put(`/api/${entity}/eventos`, formData)
        .then((res) => {
          if (res.status === 200) {
            formSubmit.onClose();
            addEvento.onClose();
            setSelectedRow(null);
            formAddEvento.reset({});
            toast({
              title: "Evento atualizado com sucesso",
              status: "success",
              duration: 5000,
              isClosable: false,
              position,
            });
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            formSubmit.onClose();
            toast({
              title: "Evento já existe",
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
      .post(`/api/${entity}/eventos`, formData)
      .then((res) => {
        if (res.status === 200) {
          formSubmit.onClose();
          addEvento.onClose();
          setSelectedRow(null);
          formAddEvento.reset({});
          toast({
            title: "Evento adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          formSubmit.onClose();
          toast({
            title: "Evento já existe",
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

  const onSubmitLocalEvento = (formData, e) => {
    e.preventDefault();
    localEventoFormSubmit.onOpen();
    axios
      .post(`/api/${entity}/eventos/locais`, formData)
      .then((res) => {
        if (res.status === 200) {
          localEventoFormSubmit.onClose();
          addLocalEvento.onClose();
          formLocalEvento.reset({});
          toast({
            title: "Local de Evento adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          localEventoFormSubmit.onClose();
          toast({
            title: `Local já existe`,
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

  const onSubmitTipoEvento = (formData, e) => {
    e.preventDefault();
    tipoEventoFormSubmit.onOpen();
    axios
      .post(`/api/${entity}/eventos/tipos`, formData)
      .then((res) => {
        if (res.status === 200) {
          tipoEventoFormSubmit.onClose();
          addTipoEvento.onClose();
          setSelectedRow(null);
          formTipoEvento.reset({});
          toast({
            title: "Tipo de evento adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          tipoEventoFormSubmit.onClose();
          toast({
            title: "Tipo já existe",
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
          toast({
            title: "Ofício excluído com sucesso",
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
      .get(`/api/${entity}/funcionarios`)
      .then((res) => {
        if (res.status === 200) {
          setColaboradoresFromRh(
            res.data.map(({ matriculaFlem, nome, cpf }) => ({
              value: matriculaFlem,
              label: `${matriculaFlem} - ` + maskCapitalize(nome),
              cpf: cpf,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios
      .get(`/api/${entity}/beneficiarios`)
      .then((res) => {
        if (res.status === 200) {
          setBeneficiariosFromRh(
            res.data.map(({ matriculaFlem, nome, cpf }) => ({
              value: matriculaFlem,
              label: `${matriculaFlem} - ` + maskCapitalize(nome),
              cpf: cpf,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTableData.onOpen();
    axios
      .get(`/api/${entity}/eventos`)
      .then((res) => {
        if (res.status === 200) {
          setEventosFromBd(res.data);
        }
      })
      .catch((error) => console.log(error))
      .finally(fetchTableData.onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addEvento.isOpen, excluirTemplateOficio.isOpen]);

  useEffect(() => {
    axios
      .get(`/api/${entity}/municipios`)
      .then((res) => {
        if (res.status === 200) {
          setMunicipiosFromBd(
            res.data.map((munic) => ({
              id: munic.id,
              value: munic.id,
              label: munic.nome,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addEvento.isOpen, addLoca.isOpen]);

  useEffect(() => {
    axios
      .get(`/api/${entity}/eventos/tipos`)
      .then((res) => {
        if (res.status === 200) {
          setTiposEventoFromBd(
            res.data.map((tipo) => ({
              id: tipo.id,
              value: tipo.id,
              label: tipo.nome,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addEvento.isOpen, addTipoEvento.isOpen]);

  useEffect(() => {
    axios
      .get(`/api/${entity}/eventos/locais`)
      .then((res) => {
        if (res.status === 200) {
          setLocaisEventosFromBd(
            res.data.map((eixo) => ({
              id: eixo.id,
              value: eixo.id,
              label: eixo.nome,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addEvento.isOpen, addLocalEvento.isOpen]);

  const cepInput = formLocalEvento.watch("cep");
  const filtroParticipantes = formAddEvento.watch("filtro");
  const nomeEventoForm = formAddEvento.watch("nome");
  const modalidadeForm = formAddEvento.watch("modalidade");
  const emailAlertsForm = formAddEvento.watch("emailAlerts");
  const criarAcaoCRForm = formAddEvento.watch("criarAcaoCR");
  const benefLoteInput = formAddEvento.watch("benefType");

  const consultaEndereco = async () => {
    const cep = formLocalEvento.getValues("cep");
    try {
      buscaCep.onOpen();
      const { data } = await axios.get(
        `https://brasilapi.com.br/api/cep/v2/${cep}`
      );
      setCepData(data);
      toast({
        title: "Endereço localizado",
        status: "success",
        duration: 5000,
        isClosable: false,
        position,
      });
    } catch (error) {
      setCepData(null);
      formLocalEvento.reset({
        cep,
      });
      toast({
        title: "Endereço não localizado",
        description: "Verifique o CEP ou preencha o endereço manualmente",
        status: "warning",
        duration: 5000,
        isClosable: false,
        position,
        containerStyle: {
          width: "300px",
        },
      });
    } finally {
      buscaCep.onClose();
    }
  };

  useEffect(() => {
    if (addLocalEvento.isOpen && cepInput?.length === 9 && !selectedRow) {
      consultaEndereco();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addLocalEvento.isOpen, cepInput]);

  useEffect(() => {
    emailAlertsState(emailAlertsForm);
    if (!emailAlertsForm) {
      formAddEvento.unregister("conteudoEmail");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailAlertsForm]);

  useEffect(() => {
    setCriarAcaoCR(criarAcaoCRForm);
    if (!criarAcaoCRForm) {
      formAddEvento.unregister("colabAcaoCR");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criarAcaoCRForm]);

  useEffect(() => {
    setNomeEvento(nomeEventoForm);
  }, [nomeEventoForm]);

  useEffect(() => {
    setModalidade(modalidadeForm);
    if (modalidadeForm === "videoconferencia") {
      formAddEvento.unregister("local");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidadeForm]);

  useEffect(() => {
    switch (filtroParticipantes) {
      case "municDemand":
        formAddEvento.unregister("benefAssoc");
        break;

      case "benef":
        formAddEvento.unregister("filtroMunicipios");
        formAddEvento.unregister("filtroDemandantes");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroParticipantes]);

  useEffect(() => {
    setBenefLote(benefLoteInput);
  }, [benefLoteInput]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading size="md">Eventos</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addEvento.onOpen}
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

      {/* Adicionar Evento Overlay  */}
      <Overlay
        onClose={() => {
          addEvento.onClose();
          formAddEvento.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        isOpen={
          addEvento.isOpen && !(addTipoEvento.isOpen || addLocalEvento.isOpen)
        }
        header={selectedRow ? "Editar Evento" : "Adicionar Evento"}
        closeButton
        size={emailAlerts ? "lg" : "md"}
        transition="max-width ease-in-out .2s"
      >
        <chakra.form
          onSubmit={formAddEvento.handleSubmit(onSubmitAddEvento)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox
              id="nome"
              label="Nome"
              formControl={formAddEvento}
              defaultValue={selectedRow?.nome}
            />
            <InputBox
              id="data"
              label="Data"
              type="datetime-local"
              formControl={formAddEvento}
              defaultValue={
                selectedRow?.data &&
                DateTime.fromISO(selectedRow.data)
                  .setZone("UTC-3")
                  .toFormat("yyyy-MM-dd'T'HH:mm")
              }
              validate={(dataSelecionada) =>
                DateTime.now()
                  .diff(DateTime.fromISO(dataSelecionada), "days")
                  .toObject().days < 1 || "Informe uma data válida"
              }
            />
            <CheckboxInput
              id="modalidade"
              label="Modalidade"
              formControl={formAddEvento}
              defaultValue={selectedRow?.modalidade}
              options={[
                { id: "presencial", label: "Presencial" },
                { id: "videoconferencia", label: "Videoconferência" },
              ]}
            />
            <Fade in={modalidade === "presencial"} unmountOnExit>
              <HStack justifyContent="space-between">
                <Box w="100%">
                  <SelectInputBox
                    id="local"
                    formControl={formAddEvento}
                    label="Local"
                    options={locaisEventosFromBd}
                    placeholder="Selecione..."
                    defaultValue={
                      selectedRow &&
                      locaisEventosFromBd.filter(
                        ({ value }) => value === selectedRow.local_EventoId
                      )
                    }
                  />
                </Box>
                <Box alignSelf="flex-start">
                  <Button
                    p={2}
                    mt={8}
                    shadow="md"
                    colorScheme="brand1"
                    onClick={addLocalEvento.onOpen}
                  >
                    <Icon as={FiPlus} boxSize={6} />
                  </Button>
                </Box>
              </HStack>
            </Fade>
            <HStack justifyContent="space-between">
              <Box w="100%">
                <SelectInputBox
                  id="tipo"
                  label="Tipo "
                  placeholder="Selecione..."
                  formControl={formAddEvento}
                  options={tiposEventoFromBd}
                  defaultValue={
                    selectedRow &&
                    tiposEventoFromBd.filter(
                      ({ value }) => value === selectedRow.tipo_eventoId
                    )
                  }
                />
              </Box>
              <Box alignSelf="flex-start">
                <Button
                  p={2}
                  mt={8}
                  shadow="md"
                  colorScheme="brand1"
                  onClick={addTipoEvento.onOpen}
                >
                  <Icon as={FiPlus} boxSize={6} />
                </Button>
              </Box>
            </HStack>
            <Divider pt={2} />
            <HStack justifyContent="space-between" py={2}>
              <Heading size="sm" textAlign="center" color="gray.500">
                Participantes
              </Heading>
              <CheckboxInput
                id="filtro"
                options={[
                  { id: "municDemand", label: "Municipios/Demandantes" },
                  { id: "benef", label: "Beneficiários" },
                ]}
                size="xs"
                formControl={formAddEvento}
                defaultValue={
                  selectedRow &&
                  Array.isArray(selectedRow.benefAssoc) &&
                  "benef"
                }
              />
            </HStack>
            <Fade
              in={filtroParticipantes === "municDemand"}
              pt={2}
              unmountOnExit
            >
              <Stack spacing={4} py={2}>
                <SelectInputBox
                  id="filtroMunicipios"
                  label="Filtrar por Municípios"
                  placeholder="Selecione..."
                  options={municipiosFromBd}
                  formControl={formAddEvento}
                />
                <SelectInputBox
                  id="filtroDemandantes"
                  label="Filtrar por Demandantes"
                  placeholder="Selecione..."
                  options={tiposEventoFromBd}
                  formControl={formAddEvento}
                />
              </Stack>
            </Fade>
            <Fade
              in={
                filtroParticipantes === "benef" ||
                (selectedRow &&
                  Array.isArray(selectedRow.benefAssoc) &&
                  "benef")
              }
              pt={2}
              unmountOnExit
            >
              <Box>
                <Flex justifyContent="space-between" flex="0 0 1%" mb={2}>
                  <FormLabel ps={0.5} m={0}>
                    Beneficiários Associados
                  </FormLabel>
                  <Box alignSelf="center">
                    <SwitchButton
                      id="benefType"
                      formControl={formAddEvento}
                      label="Selecionar em Lote"
                      size="sm"
                    />
                  </Box>
                </Flex>
                {!benefLote && (
                  <SelectInputBox
                    id="benefAssoc"
                    formControl={formAddEvento}
                    options={beneficiariosFromRh}
                    isMulti
                    defaultValue={
                      selectedRow &&
                      beneficiariosFromRh.filter((benef) =>
                        selectedRow.benefAssoc.find(
                          (selec) => selec.cpf === benef.cpf
                        )
                      )
                    }
                  />
                )}
                {benefLote && (
                  <ChakraTagInput
                    id="benefAssoc"
                    formControl={formAddEvento}
                    placeholder="Matrículas ou CPFs separados por vírgula"
                    mask={cpfMask}
                  />
                )}
              </Box>
            </Fade>
            <Divider pt={1} />
            <HStack justifyContent="space-between" py={2}>
              <Heading size="sm" textAlign="center" color="gray.500">
                Notificações e Ações
              </Heading>
            </HStack>
            <Box
              bg={criarAcaoCR && "gray.50"}
              p={criarAcaoCR && 2}
              shadow={criarAcaoCR && "inner"}
              rounded="lg"
              transition="all ease-in-out .2s"
            >
              <SwitchButton
                id="criarAcaoCR"
                label="Criar ação na CR?"
                formControl={formAddEvento}
                defaultChecked={
                  selectedRow && selectedRow?.acao_Cr[0]?.excluido === false
                }
              />
              <Fade in={criarAcaoCR} unmountOnExit>
                <Box py={4}>
                  <SelectInputBox
                    id="colabAcaoCR"
                    label="Atribuir ação a"
                    placeholder="Selecione..."
                    options={colaboradoresFromRh}
                    formControl={formAddEvento}
                    defaultValue={
                      selectedRow &&
                      selectedRow?.acao_Cr[0]?.excluido === false &&
                      colaboradoresFromRh.filter((benef) =>
                        selectedRow.acao_Cr[0]?.colabCr.find(
                          (selec) => selec.cpf === benef.cpf
                        )
                      )
                    }
                    bg="white"
                    isMulti
                  />
                </Box>
              </Fade>
            </Box>
            <Box
              bg={emailAlerts && "gray.50"}
              p={emailAlerts && 2}
              shadow={emailAlerts && "inner"}
              rounded="lg"
              transition="all ease-in-out .2s"
            >
              <SwitchButton
                id="emailAlerts"
                label="Notificar participantes por e-mail?"
                formControl={formAddEvento}
              />
              <Fade in={emailAlerts} unmountOnExit>
                <EmailEditor
                  id="conteudoEmail"
                  title={nomeEvento ? nomeEvento : "Nome do Evento"}
                  formControl={formAddEvento}
                  loadOnEditor={selectedRow?.conteudo}
                />
              </Fade>
            </Box>
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formSubmit.isOpen}
              isDisabled={!formAddEventoValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Adicionar local de evento Overlay */}
      <Overlay
        isOpen={addLocalEvento.isOpen}
        onClose={() => {
          addLocalEvento.onClose();
          formLocalEvento.reset({});
        }}
        closeButton
        header="Adicionar Local de Evento"
      >
        <chakra.form
          onSubmit={formLocalEvento.handleSubmit(onSubmitLocalEvento)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox id="nome" label="Nome" formControl={formLocalEvento} />
            <MaskedInputBox
              id="cep"
              label="CEP"
              placeholder="12345-678"
              formControl={formLocalEvento}
              validate={(value) =>
                value.length === 9 || "Informe um CEP válido"
              }
              setMask={cepMask}
              pr={8}
              inputrightelement={
                <Fade in={selectedRow && cepInput?.length === 9}>
                  <InputRightElement w="auto" pr={1.5}>
                    <Button h="1.75rem" size="sm" onClick={consultaEndereco}>
                      Atualizar Endereço
                    </Button>
                  </InputRightElement>
                </Fade>
              }
            />
            <Collapse
              in={cepInput && cepInput.length === 9}
              animateOpacity
              unmountOnExit
            >
              <Stack spacing={4}>
                <InputBox
                  id="logradouro"
                  formControl={formLocalEvento}
                  label="Logradouro"
                  isLoaded={!buscaCep.isOpen}
                  value={(cepData && cepData.street) || selectedRow?.logradouro}
                />
                <InputBox
                  id="complemento"
                  formControl={formLocalEvento}
                  label="Complemento"
                  required={false}
                />
                <InputBox
                  id="bairro"
                  formControl={formLocalEvento}
                  label="Bairro"
                  value={
                    selectedRow?.bairro || (cepData && cepData.neighborhood)
                  }
                  isLoaded={!buscaCep.isOpen}
                />
                <InputBox
                  id="cidade"
                  formControl={formLocalEvento}
                  label="Cidade"
                  value={selectedRow?.cidade || (cepData && cepData.city)}
                  isLoaded={!buscaCep.isOpen}
                />
                <InputBox
                  id="uf"
                  formControl={formLocalEvento}
                  label="UF"
                  value={selectedRow?.uf || (cepData && cepData.state)}
                  isLoaded={!buscaCep.isOpen}
                />
              </Stack>
            </Collapse>
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={addLocalFormSubmit.isOpen}
              isDisabled={!formLocalEventoValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/*  Adicionar tipo de evento Overlay  */}
      <Overlay
        isOpen={addTipoEvento.isOpen}
        onClose={() => {
          addTipoEvento.onClose();
          formTipoEvento.reset({});
        }}
        closeButton
        header="Adicionar Tipo de Evento"
      >
        <chakra.form
          onSubmit={formTipoEvento.handleSubmit(onSubmitTipoEvento)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox id="nome" label="Nome" formControl={formTipoEvento} />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={tipoEventoFormSubmit.isOpen}
              isDisabled={!formTipoEventoValidation}
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
            <Box>Excluir Material</Box>
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