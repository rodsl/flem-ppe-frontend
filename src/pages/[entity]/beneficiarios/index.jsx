/**
 * Página de Beneficiários.
 *  @module beneficiarios
 */

import { useRouter } from "next/router";
import { Component, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { signIn, signOut, getSession, useSession } from "next-auth/react";
import { DashboardLayout } from "components/Layout/DashboardLayout";
import { variants } from "styles/transitions";
import { Card } from "components/Cards";
import { Table } from "components/Table";
import { LineChart } from "components/Charts/LineChart";
import { IoWallet } from "react-icons/io5";
import { FiCalendar, FiEdit, FiMoreHorizontal } from "react-icons/fi";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { Table2 } from "components/Table/Table2";

/**
 * Componente de renderização da Página de Beneficiários
 * @method Beneficiarios
 * @memberof module:beneficiarios
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns {Component} página renderizada
 */
export default function Beneficiarios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;

  const session = useSession();
  console.log(session);

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
  }, [asPath]);

  const columns = useMemo(
    () => [
      {
        Header: "Tabela de beneficiários",
        Footer: false,
        columns: [
          {
            Header: "Nome Beneficiário",
            accessor: "nome_beneficiario",
            Footer: false,
          },
          {
            Header: "CPF",
            accessor: "cpf_beneficiario",
            Footer: false,
          },
          {
            Header: "Matrícula FLEM",
            accessor: "matricula_flem_beneficiario",
            Footer: false,
          },
          {
            Header: "Demandante",
            accessor: "demandante_vaga",
            Footer: false,
          },
          {
            Header: "Município Vaga",
            accessor: "municipio_vaga",
            Footer: false,
          },
          {
            Header: "Escritório Regional",
            accessor: "escritorio_regional",
            Footer: false,
          },
          {
            Header: "Status Beneficiário",
            accessor: "status_beneficiario",
            Footer: false,
          },
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
        ],
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        nome_beneficiario: "nome_beneficiario",
        cpf_beneficiario: "cpf_beneficiario",
        matricula_flem_beneficiario: "matricula_flem_beneficiario",
        demandante_vaga: "demandante_vaga",
        municipio_vaga: "municipio_vaga",
        escritorio_regional: "escritorio_regional",
        status_beneficiario: "status_beneficiario",
      },
      {
        nome_beneficiario: "nome_beneficiario",
        cpf_beneficiario: "cpf_beneficiario",
        matricula_flem_beneficiario: "matricula_flem_beneficiario",
        demandante_vaga: "demandante_vaga",
        municipio_vaga: "municipio_vaga",
        escritorio_regional: "escritorio_regional",
        status_beneficiario: "status_beneficiario",
      },
      {
        nome_beneficiario: "nome_beneficiario",
        cpf_beneficiario: "cpf_beneficiario",
        matricula_flem_beneficiario: "matricula_flem_beneficiario",
        demandante_vaga: "demandante_vaga",
        municipio_vaga: "municipio_vaga",
        escritorio_regional: "escritorio_regional",
        status_beneficiario: "status_beneficiario",
      },
      {
        nome_beneficiario: "nome_beneficiario",
        cpf_beneficiario: "cpf_beneficiario",
        matricula_flem_beneficiario: "matricula_flem_beneficiario",
        demandante_vaga: "demandante_vaga",
        municipio_vaga: "municipio_vaga",
        escritorio_regional: "escritorio_regional",
        status_beneficiario: "status_beneficiario",
      },
    ],
    []
  );

  return (
    <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
      <SimpleGrid>
        <Table columns={columns} data={data} />
      </SimpleGrid>
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

Beneficiarios.auth = false;
Beneficiarios.dashboard = true;
