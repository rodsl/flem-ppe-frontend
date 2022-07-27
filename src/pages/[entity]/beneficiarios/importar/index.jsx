import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
  Stack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { signIn, signOut, getSession, useSession } from "next-auth/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiFileText,
  FiMoreHorizontal,
} from "react-icons/fi";
import { Table } from "components/Table";
import { axios } from "services/apiService";
import { DateTime } from "luxon";
import { MaskedCellInput } from "components/Table/components/MaskedCellInput";
import { celularMask } from "masks-br";
import { CellInput } from "components/Table/components/CellInput";
import { SelectCellInput } from "components/Table/components/SelectCellInput";

export default function Importar({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const { file: filename } = router.query;
  const session = useSession();
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [listaDemandantes, setListaDemandantes] = useState();
  const [sheet, setSheet] = useState({});
  const [tableError, setTableError] = useState();

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
      .get(`/api/${entity}/beneficiarios/files/sheets`, {
        params: {
          filename,
        },
      })
      .then(({ status, data }) => setSheet({ ...data.sheet }))
      .catch((err) => console.log(err));

    axios
      .get(`/api/${entity}/demandantes`)
      .then(({ status, data: { demand } }) => setListaDemandantes(demand))
      .catch((err) => console.log(err));
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const [headers] = Object.keys(sheet).map((key) => sheet[key][0]);
    setColumnHeaders(
      headers &&
        Object.keys(headers)
          .filter(
            (header) =>
              header !== "n_Vaga" &&
              header !== "found" &&
              header !== "eixoDeFormacao"
          )
          .map((header) => {
            const result = header.replace(/([A-Z])/g, " $1");
            const finalResult =
              result.charAt(0).toUpperCase() + result.slice(1);
            return {
              Header: finalResult.replace(/_/g, " "),
              accessor: header,
              Footer: false,
            };
          })
    );

    const [rawRows] = Object.keys(sheet).map((key) => sheet[key]);

    const rows =
      rawRows &&
      rawRows.map((row) => ({
        ...row,
        dataDaConvocacao: DateTime.fromFormat(
          row.dataDaConvocacao.toString(),
          "dd/MM/yyyy"
        )
          .setLocale("pt-BR")
          .toFormat("dd/MM/yyyy"),
        dataDeNascimento: DateTime.fromFormat(
          row.dataDeNascimento.toString(),
          "dd/MM/yyyy"
        )
          .setLocale("pt-BR")
          .toFormat("dd/MM/yyyy"),
        telefone01: row.telefone01.formatted,
        telefone02: row.telefone02.formatted,
        raca_cor: row.raca_cor.toLowerCase(),
      }));
    setRowsData(rows && rows.filter((row) => row.found === false));
    return () => {};
  }, [sheet]);

  const columns = useMemo(() => {
    const demandante =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "demandante")
        .map((columnHeader) => ({
          ...columnHeader,
          Cell: (props) => (
            <>
              <Popover returnFocusOnClose={false} trigger="click">
                {({ isOpen, onClose }) => (
                  <>
                    {props.value.includes("*") || props.value === "" ? (
                      <PopoverTrigger>
                        <Box bg="red.200" p={2} rounded="lg">
                          {props.value.replace("*", "")}
                        </Box>
                      </PopoverTrigger>
                    ) : (
                      <Box>{props.value}</Box>
                    )}
                    <PopoverContent w="full">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Demandante não encontrado!</PopoverHeader>
                      <PopoverBody m={2}>
                        <Stack spacing={4}>
                          <Box>
                            Valor informado: {props.value.replace("*", "")}
                          </Box>
                          <HStack justifyContent="space-between">
                            <Text>Alterar para:</Text>
                            <Box w="75%">
                              <SelectCellInput
                                {...props}
                                defaultValue={props.value}
                                placeholder="Selecione..."
                              >
                                {Array.isArray(listaDemandantes) &&
                                  listaDemandantes.map((demand) => (
                                    <option
                                      key={demand.sigla}
                                      value={`${demand.sigla} - ${demand.demandante}`}
                                    >
                                      {`${
                                        demand.sigla
                                      } - ${demand.demandante.slice(0, 30)}${
                                        demand.demandante.length >= 30
                                          ? "..."
                                          : ""
                                      }`}
                                    </option>
                                  ))}
                              </SelectCellInput>
                            </Box>
                          </HStack>
                          <Box alignSelf="flex-end">
                            <Button
                              isDisabled={props.value === ""}
                              onClick={onClose}
                            >
                              Confirmar
                            </Button>
                          </Box>
                        </Stack>
                      </PopoverBody>
                    </PopoverContent>
                  </>
                )}
              </Popover>
            </>
          ),
        }));

    const cursoDeFormacao =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "cursoDeFormacao")
        .map((columnHeader) => ({
          ...columnHeader,
          Cell: (props) => <CellInput {...props} />,
        }));

    const raca_cor =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "raca_cor")
        .map((columnHeader) => ({
          ...columnHeader,
          Header: "Etnia",
          Cell: (props) => {
            return (
              <SelectCellInput
                {...props}
                defaultValue={props.value}
                placeholder="Selecione..."
              >
                <option value="amarela">Amarela</option>
                <option value="branca">Branca</option>
                <option value="indigena">Indígena</option>
                <option value="parda">Parda</option>
                <option value="preta">Preta</option>
                <option value="não informada">Não Informada</option>
              </SelectCellInput>
            );
          },
        }));

    const telefone01 =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "telefone01")
        .map((columnHeader) => ({
          ...columnHeader,
          Header: "Telefone 01",
          Cell: (props) => <MaskedCellInput {...props} mask={celularMask} />,
        }));

    const telefone02 =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "telefone02")
        .map((columnHeader) => ({
          ...columnHeader,
          Header: "Telefone 02",
          Cell: (props) => <MaskedCellInput {...props} mask={celularMask} />,
        }));

    const columnHeadersCustomCell = demandante &&
      cursoDeFormacao &&
      telefone01 &&
      telefone02 &&
      raca_cor && [
        ...demandante,
        ...cursoDeFormacao,
        ...telefone01,
        ...telefone02,
        ...raca_cor,
      ];
    const newColumnHeaders =
      columnHeaders &&
      columnHeaders.map(
        (obj) =>
          (columnHeadersCustomCell &&
            columnHeadersCustomCell.find((p) => p.accessor === obj.accessor)) ||
          obj
      );

    return (
      newColumnHeaders && [
        ...newColumnHeaders,
        {
          Header: "Ações",
          props: { teste: "true" },
          Cell: (props) => (
            <IconButton
              icon={<FiMoreHorizontal />}
              onClick={() => console.log(props?.row?.original)}
              variant="outline"
              colorScheme="brand1"
              _focus={{
                boxShadow: "0 0 0 3px var(--chakra-colors-brand1-300)",
              }}
            />
          ),
          Footer: false,
        },
      ]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnHeaders]);

  const data = useMemo(() => rowsData, [rowsData]);

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setRowsData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const checkTableData = () =>
    data && setTableError(JSON.stringify(data).includes("*"));

  useEffect(() => {
    checkTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading size="md">Importar Beneficiários</Heading>
          <HStack spacing={2}>
            {" "}
            <Button
              colorScheme="brand1"
              shadow="md"
              leftIcon={<FiFileText />}
              as={Box}
              _focus={{ boxShadow: "none" }}
              _hover={{ boxShadow: "none" }}
              _active={{ boxShadow: "none" }}
            >
              {router.query.file}
            </Button>
            <Button
              colorScheme={tableError ? "red" : "brand1"}
              leftIcon={tableError ? <FiAlertCircle /> : <FiCheckCircle />}
              onClick={() => {
                if (tableError) {
                  checkTableData();
                }
              }}
            >
              {tableError ? "Verificar Pendências" : "Importar"}
            </Button>
          </HStack>
        </Flex>
        {columns && data && (
          <Table columns={columns} data={data} updateMyData={updateMyData} />
        )}
        {!columns &&
          "Não identificamos os campos necessários no arquivo para realizar a importação. Por favor, verifique o arquivo e tente novamente."}
      </AnimatePresenceWrapper>
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

Importar.auth = false;
Importar.dashboard = true;
