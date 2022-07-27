import { useEffect, useMemo, useState } from "react";
import {
  Flex,
  Table as ChakraTable,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Input,
  Stack,
  IconButton,
  Tfoot,
  useDisclosure,
  Icon,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { useTable, useFilters } from "react-table";
import { axios } from "services/apiService";
import { FilterInput } from "components/Table/FilterInput";

function Table({ columns, data }) {
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  function DefaultColumnFilter({
    column: { filterValue, Header, preFilteredRows, setFilter, ...rest },
  }) {
    const count = preFilteredRows.length;
    console.log(rest.Header);
    return (
      <>
        <FilterInput
          value={filterValue || ""}
          onChange={(e) => {
            setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
          }}
          cleanFilter={() => setFilter("")}
          placeholder={`Pesquisar ${count} registro${count > 1 ? "s" : ""}...`}
          filterTitle={Header}
        >
          <Box>{Header}</Box>
        </FilterInput>
      </>
    );
  }

  const filterTypes = useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters
  );

  // Render the UI for your table
  return (
    <ChakraTable
      {...getTableProps()}
      border={1}
      style={{ borderCollapse: "collapse", width: "100%" }}
    >
      <Thead>
        {headerGroups.map((group) => (
          <Tr key={group.id} {...group.getHeaderGroupProps()}>
            {group.headers.map((column) => (
              <Th key={column.id} {...column.getHeaderProps()}>
                {column.canFilter
                  ? column.render("Filter")
                  : column.render("Header")}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <Tr key={row.id} {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <Td key={cell.id} {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
      <Tfoot>
        {footerGroups.map((group) => (
          <Tr key={group.id} {...group.getFooterGroupProps()}>
            {group.headers.map((column) => (
              <Td key={column.id} {...column.getFooterProps()}>
                {column.render("Footer")}
              </Td>
            ))}
          </Tr>
        ))}
      </Tfoot>
    </ChakraTable>
  );
}

export default function App() {
  const columns = useMemo(
    () => [
      {
        Header: "Sub Heading 1a",
        accessor: "firstcolumn",
      },
      {
        Header: "Sub Heading 1b",
        accessor: "secondcolumn",
      },
      {
        Header: "Sub Heading 1c",
        accessor: "thirdcolumn",
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        firstcolumn: "Row 1 Column 1",
        secondcolumn: "Row 1 Column 2",
        thirdcolumn: "Row 1 Column 3",
      },
      {
        firstcolumn: "Row 2 Column 1",
        secondcolumn: "Row 2 Column 2",
        thirdcolumn: "Row 2 Column 3",
      },
      {
        firstcolumn: "Row 3 Column 1",
        secondcolumn: "Row 3 Column 2",
        thirdcolumn: "Row 3 Column 3",
      },
      {
        firstcolumn: "Row 4 Column 1",
        secondcolumn: "Row 4 Column 2",
        thirdcolumn: "Row 4 Column 3",
      },
      {
        firstcolumn: "Row 5 Column 1",
        secondcolumn: "Row 5 Column 2",
        thirdcolumn: "Row 5 Column 3",
      },
      {
        firstcolumn: "Row 6 Column 1",
        secondcolumn: "Row 6 Column 2",
        thirdcolumn: "Row 6 Column 3",
      },
      {
        firstcolumn: "Row 7 Column 1",
        secondcolumn: "Row 7 Column 2",
        thirdcolumn: "Row 7 Column 3",
      },
      {
        firstcolumn: "Row 8 Column 1",
        secondcolumn: "Row 8 Column 2",
        thirdcolumn: "Row 8 Column 3",
      },
      {
        firstcolumn: "Row 9 Column 1",
        secondcolumn: "Row 9 Column 2",
        thirdcolumn: "Row 9 Column 3",
      },
      {
        firstcolumn: "Row 10 Column 1",
        secondcolumn: "Row 10 Column 2",
        thirdcolumn: "Row 10 Column 3",
      },
      {
        firstcolumn: "Row 11 Column 1",
        secondcolumn: "Row 11 Column 2",
        thirdcolumn: "Row 11 Column 3",
      },
      {
        firstcolumn: "Row 12 Column 1",
        secondcolumn: "Row 12 Column 2",
        thirdcolumn: "Row 12 Column 3",
      },
    ],
    []
  );

  return <Table columns={columns} data={data} />;
}
