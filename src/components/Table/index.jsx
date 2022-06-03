import { useMemo, useState } from "react";
import {
  Flex,
  Table as ChakraTable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Box,
} from "@chakra-ui/react";
import { useTable, useFilters } from "react-table";
import { FilterInput } from "components/Table/FilterInput";

export function Table({ columns, data, updateMyData }) {
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
      updateMyData,
    },
    useFilters
  );

  // Render the UI for your table
  return (
    <Flex
      bg="white"
      rounded="lg"
      shadow="lg"
      p={4}
      w="100%"
      h="100%"
      overflowX="auto"
    >
      <ChakraTable
        {...getTableProps()}
        border={1}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <Thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();

            return (
              <Tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restColumn } = column.getHeaderProps();
                  return (
                    <Th
                      key={key}
                      {...restColumn}
                      isNumeric={key.includes("Ações")}
                    >
                      {column.canFilter
                        ? column.render("Filter")
                        : column.render("Header")}
                    </Th>
                  );
                })}
              </Tr>
            );
          })}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <Tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td
                    key={cell.id}
                    {...cell.getCellProps()}
                    isNumeric={cell.getCellProps().key.includes("Ações")}
                  >
                    {cell.render("Cell")}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          {footerGroups.map((footerGroup) => {
            const { key, ...restFooterGroupProps } =
              footerGroup.getFooterGroupProps();
            return (
              <Tr key={key} {...restFooterGroupProps}>
                {footerGroup.headers.map((column) => {
                  const { key, ...restColumn } = column.getFooterProps();
                  return (
                    column.render("Footer") && (
                      <Td key={key} {...restColumn}>
                        {column.render("Footer")}
                      </Td>
                    )
                  );
                })}
              </Tr>
            );
          })}
        </Tfoot>
      </ChakraTable>
    </Flex>
  );
}
