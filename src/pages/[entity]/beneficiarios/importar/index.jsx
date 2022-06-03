import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { signIn, signOut, getSession, useSession } from "next-auth/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import {
  FiFileText,
  FiMoreHorizontal,
} from "react-icons/fi";
import { Table } from "components/Table";
import axios from "axios";
import { DateTime } from "luxon";
import {MaskedCellInput} from "components/Table/components/MaskedCellInput";
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
  const [selectedRow, setSelectedRow] = useState();
  const [sheet, setSheet] = useState({});
  const {
    isOpen: addMaterialIsOpen,
    onOpen: addMaterialOnOpen,
    onClose: addMaterialOnClose,
  } = useDisclosure();

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
  }, [asPath]);

  useEffect(() => {
    axios
      .get("/api/files/sheets", {
        params: {
          filename,
        },
      })
      .then(({ status, data }) => setSheet({ ...data.sheet }))
      .catch((err) => console.log(err));
    return () => {};
  }, []);

  useEffect(() => {
    const [headers] = Object.keys(sheet).map((key) => sheet[key][0]);
    setColumnHeaders(
      headers &&
        Object.keys(headers)
          .filter(
            (header) => header !== "n_Vaga" && header !== "eixoDeFormacao"
          )
          .map((header) => {
            var result = header.replace(/([A-Z])/g, " $1");
            var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
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
        dataDaConvocacao: DateTime.fromISO(row.dataDaConvocacao)
          .setLocale("pt-BR")
          .toFormat("dd/MM/yyyy"),
        dataDeNascimento: DateTime.fromISO(row.dataDeNascimento)
          .setLocale("pt-BR")
          .toFormat("dd/MM/yyyy"),
        envioFundacao: DateTime.fromISO(row.envioFundacao)
          .setLocale("pt-BR")
          .toFormat("dd/MM/yyyy"),
        telefone01:
          row.telefone01.formatted,
        telefone02:
          row.telefone02.formatted, 
      }));
    setRowsData(rows);
    return () => {};
  }, [sheet]);

  const columns = useMemo(() => {
    const raca_cor =
    columnHeaders &&
    columnHeaders
      .filter((columnHeader) => columnHeader.accessor === "raca_cor")
      .map((columnHeader) => ({
        ...columnHeader,
        Header: "Etnia",
        Cell: (props) => <SelectCellInput {...props} mask={celularMask} />
      }));

    const telefone01 =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "telefone01")
        .map((columnHeader) => ({
          ...columnHeader,
          Header: "Telefone 01",
          Cell: (props) => <MaskedCellInput {...props} mask={celularMask} />
        }));

    const telefone02 =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "telefone02")
        .map((columnHeader) => ({
          ...columnHeader,
          Header: "Telefone 02",
          Cell: (props) => <MaskedCellInput {...props} mask={celularMask} />
        }));

    const columnHeadersCustomCell = telefone01 && telefone02 && raca_cor && [...telefone01, ...telefone02, ...raca_cor];
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

  return (
    <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
      <Flex justifyContent="space-between" alignItems="center" pb={5}>
        <Heading size="md">Importar Beneficiários</Heading>
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
      </Flex>
      {/* <Box>{JSON.stringify(data)}</Box> */}
      {columns && data && (
        <Table columns={columns} data={data} updateMyData={updateMyData} />
      )}
      {!columns &&
        "Não identificamos os campos necessários no arquivo para realizar a importação. Por favor, verifique o arquivo e tente novamente."}
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

Importar.auth = false;
Importar.dashboard = true;
