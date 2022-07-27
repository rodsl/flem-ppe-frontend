import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { Table } from "components/Table";
import { FiMoreHorizontal, FiPlus } from "react-icons/fi";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { axios } from "services/apiService";
import { Dropzone } from "components/Dropzone";

export default function Beneficiarios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const [uploadProgress, setUploadProgress] = useState(null);
  const [controller, setController] = useState(null);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).map((key, idx) => formData.append(`files`, data[key]));
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      signal: controller.signal,
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
        setUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
    };
    axios
      .post(`/api/${entity}/beneficiarios/files/upload`, formData, config)
      .then(({ status, data }) => {
        if (status === 200) {
          router.push(
            `${router.asPath}/importar?file=${data.file}`,
            router.asPath + "/importar"
          );
        }
      })
      .catch((err) => {
        if (err.message === "canceled") {
          setController(new AbortController());
          return onToggle();
        }
        return console.log(err.message);
      });
  };
  const columns = useMemo(
    () => [
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

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  useEffect(() => {
    setController(new AbortController());
  }, []);

  return (
    <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
      <Flex justifyContent="space-between" alignItems="center" pb={5}>
        <Heading size="md">Beneficiários</Heading>
        <Button
          colorScheme="brand1"
          shadow="md"
          leftIcon={<FiPlus />}
          onClick={onToggle}
        >
          Importar
        </Button>
      </Flex>
      <SimpleGrid>
        <Table columns={columns} data={data} />
      </SimpleGrid>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onToggle}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Importar Beneficiários</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Dropzone
              onSubmit={onSubmit}
              onUploadProgress={uploadProgress}
              setUploadProgress={setUploadProgress}
              uploadController={controller}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
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
