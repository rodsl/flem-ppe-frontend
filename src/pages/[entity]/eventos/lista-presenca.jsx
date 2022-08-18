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
  Image,
  Table,
  TableContainer,
  Tbody,
  Tr,
  Td,
  Th,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { BsClipboardCheck } from "react-icons/bs";
import { DateTime } from "luxon";
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
import { Logo } from "components/Logo";

export default function TemplateOficios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [eventoData, setEventoData] = useState([]);
  const { idEvento } = router.query;

  useEffect(() => {
    if (idEvento) {
      axios
        .get(`/api/${entity}/eventos`, { params: { idEvento } })
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setEventoData(res.data);
          }
        })
        .catch((error) => console.log(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idEvento]);

  const eventoData2 = {
    id: "cl6qvk8ye05923guciqpzzi0y",
    nome: "Evento de Teste 1",
    data: "2022-08-12T21:00:00.000Z",
    modalidade: "presencial",
    excluido: false,
    createdAt: "2022-08-12T19:41:13.430Z",
    updatedAt: "2022-08-12T19:41:29.487Z",
    local_EventoId: "cl6qtlz5u04193gucp23pdi62",
    tipo_eventoId: "cl6qtx4j705663guc5up0shdi",
    localEvento: {
      id: "cl6qtlz5u04193gucp23pdi62",
      nome: "Local Teste 1",
      cep: "00000-000",
      logradouro: "R. Teste2",
      complemento: "Teste2",
      bairro: "Teste1",
      cidade: "Teste",
      uf: "RJ",
      email: null,
      num_contato: null,
      excluido: false,
      createdAt: "2022-08-12T18:46:34.818Z",
      updatedAt: "2022-08-12T18:48:32.163Z",
    },
    tipoEvento: {
      id: "cl6qtx4j705663guc5up0shdi",
      nome: "Tipo 1",
      excluido: false,
      createdAt: "2022-08-12T18:55:14.995Z",
      updatedAt: "2022-08-12T18:55:14.995Z",
    },
    benefAssoc: [
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0471xr24sc3sobjr",
        nome: "ABRAAO CALAZANS AGUIAR DOS SANTOS",
        cpf: "85977750501",
        matriculaFlem: 11460,
        matriculaSaeb: 11460,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.711Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
      {
        id: "cl6fomt5p0473xr24u5jltji4",
        nome: "ACSA DOS SANTOS CERQUEIRA",
        cpf: "09057834502",
        matriculaFlem: 9625,
        matriculaSaeb: 9625,
        excluido: false,
        createdAt: "2022-08-04T23:41:47.677Z",
        updatedAt: "2022-08-04T23:41:47.712Z",
        formacao: "Técnico em alguma coisa",
        vaga: {
          demandante: "SEC",
          municipio: "Salvador",
        },
      },
    ],
    acao_Cr: [],
  };

  return (
    <>
      <chakra.div
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="page-header"
        style={{ textAlign: "center" }}
        // px={14}
        // pt={14}
      >
        <Logo h={30} my={12} />
        <br />
        <button
          type="button"
          onClick={() => window.print()}
          style={{ background: "pink" }}
        >
          PRINT ME!
        </button>
        <Image
          src="https://www.planserv.ba.gov.br/wp-content/uploads/2022/07/Brasa%E2%95%A0ao-Horizontal_Cor.png"
          h={50}
        />
      </chakra.div>

      <chakra.div className="page-footer">
        {/* <Flex px={14}>
          <Box>
            <Text fontSize={9} pt={2}>
              <chakra.span fontWeight="bold">Endereço: </chakra.span> Rua
              Visconde de Itaborahy, 845, Amaralina, Salvador - BA 41900-000
            </Text>
            <Text fontSize={9}>
              <chakra.span fontWeight="bold">Contato: </chakra.span> (71)
              3103-7500
            </Text>
          </Box>
        </Flex> */}
      </chakra.div>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <td>
              {/* <!--place holder for the fixed-position header--> */}
              <div className="page-header-space"></div>
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              {/* <!--*** CONTENT GOES HERE ***--> */}
              <chakra.div
                className="page"
                // px={14}
              >
                <TableContainer>
                  <Table
                    w="full"
                    sx={{ tableLayout: "auto" }}
                    variant="simple"
                    size="sm"
                  >
                    <chakra.thead>
                      <tr>
                        <th colSpan="100%">
                          <Flex py={4} direction="column">
                            <Heading size="md" color="gray.700" pb={2}>
                              Projeto Primeiro Emprego
                            </Heading>
                            <Stack
                              spacing={1.5}
                              bg="gray.100"
                              px={2}
                              py={4}
                              rounded="md"
                              my={2}
                            >
                              <Heading size="xs" color="gray.600">
                                Lista de Presença: {eventoData.nome}
                              </Heading>
                              <Heading size="xs" color="gray.600">
                                Modalidade:{" "}
                                {maskCapitalize(eventoData.modalidade)}
                              </Heading>
                              {eventoData.modalidade === "presencial" && (
                                <Heading size="xs" color="gray.600">
                                  {` Local: ${eventoData.localEvento.nome} - ${
                                    eventoData.localEvento.logradouro
                                  }, ${
                                    eventoData.localEvento.complemento !== "" &&
                                    eventoData.localEvento.complemento !== null
                                      ? `${eventoData.localEvento.complemento}, `
                                      : null
                                  } ${eventoData.localEvento.bairro}, ${
                                    eventoData.localEvento.cidade
                                  } - ${eventoData.localEvento.uf} ${
                                    eventoData.localEvento.cep
                                  }`}
                                </Heading>
                              )}
                              <Heading size="xs" color="gray.600">
                                Data:{" "}
                                {DateTime.fromISO(
                                  eventoData.data
                                ).toLocaleString(DateTime.DATETIME_SHORT)}
                                h
                              </Heading>
                            </Stack>
                          </Flex>
                        </th>
                      </tr>
                      <Tr>
                        <Th>Matrícula</Th>
                        <Th>Nome / Demandante</Th>
                        <Th>Formação</Th>
                        <Th>Assinatura</Th>
                      </Tr>
                    </chakra.thead>
                    <Tbody>
                      {Array.isArray(eventoData.benefAssoc) &&
                        eventoData.benefAssoc.map((benef) => (
                          <Tr key={JSON.stringify(benef)}>
                            <Td>{benef.matriculaFlem}</Td>
                            <Td>
                              <Box>{maskCapitalize(benef.nome)}</Box>
                              <Text fontSize={12} pt={1}>
                                {benef.vaga?.demandante} /{" "}
                                {benef.vaga?.municipio}
                              </Text>
                            </Td>
                            <Td>{maskCapitalize(benef.formacao)}</Td>
                            <Td minW={300} borderColor="gray.400" />
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </chakra.div>
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td>
              {/* <!--place holder for the fixed-position footer--> */}
              <div className="page-footer-space"></div>
            </td>
          </tr>
        </tfoot>
      </table>
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
TemplateOficios.dashboard = false;
