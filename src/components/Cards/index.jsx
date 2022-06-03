/**
 * Componente de Cards do Dashboard
 * @module Cards
 */

import { Flex, Heading } from "@chakra-ui/react";
import IconBox from "components/Icons/IconBox";
import { Component } from "react";


/*************** WIP ******************/
/**
 * Cria um card do Dashboard.
 * @method Card
 * @memberof module:Cards
 * @param {Object} icon Ícone decorativo
 * @param {Component} children componente-filho do card
 * @returns componente de card.
 *
 */
export function Card({ icon, children, ...props }) {
  return (
    <Flex
      {...props}
      p={5}
      bg="white"
      w="100%"
      alignItems="center"
      rounded="lg"
      shadow="sm"
      justifyContent="space-between"
    >
      <Flex
        w="100%"
        flexDir="column"
        alignItems="flex-start"
        justifyContent="center"
        flex="1 1 0%"
      >
        <Heading as="h3" color="gray.400" size="sm" pb={1}>
          Todays Money
        </Heading>
        <Flex alignItems="center">
          <Heading as="h3" color="gray.700" size="md">
            $53,000
          </Heading>
          <Heading as="h3" color="green.400" size="sm">
            +55%
          </Heading>
        </Flex>
        {children && (
          <Flex pt={2} pe={2} maxW="80%">
            {children}
          </Flex>
        )}
      </Flex>
      <IconBox
        h={children ? "100%" : "45px"}
        w={children ? "70%" : "45px"}
        fontSize="2xl"
        bg="brand1.400"
        color="white"
      >
        {icon}
      </IconBox>
    </Flex>
  );
}
