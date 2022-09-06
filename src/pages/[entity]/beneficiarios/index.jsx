import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  chakra,
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
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Table } from "components/Table";
import { FiEye, FiMoreHorizontal, FiPlus } from "react-icons/fi";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { axios, filesAPIUpload } from "services/apiService";
import { Dropzone } from "components/Dropzone";
import { useCustomForm } from "hooks";

export default function Beneficiarios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const [uploadProgress, setUploadProgress] = useState(null);
  const [controller, setController] = useState(null);
  const formUpload = useCustomForm();
  const [benefFromBd, setBenefFromBd] = useState([]);

  const onSubmit = async (data) => {
    formUpload.setLoading();
    const formData = new FormData();

    data.anexos.map((file, idx) => formData.append(`files`, file));

    const config = {
      signal: controller.signal,
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
        setUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
    };

    filesAPIUpload
      .post(`/uploadFile`, formData, config)
      .then(({ status, data }) => {
        if (status === 200) {
          router.push(
            `${router.asPath}/importar?fileId=${data[0].id}`,
            router.asPath + "/importar"
          );
        }
      })
      .catch((err) => {
        if (err.message === "canceled") {
          setController(new AbortController());
          return onToggle();
        }
        return console.log(err);
      })
      .finally(formUpload.setLoaded);
  };

  const onSubmit3 = async (formData, e) => {
    e.preventDefault();
    formAddOficio.setLoading();

    const anexos = new FormData();
    formData.anexos.map((file, idx) => anexos.append(`files`, file));

    const fileUpload = async (data, params) => {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        signal: controller.signal,
        onUploadProgress: (event) => {
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
        params,
      };
      const response = await axios.post(`/api/upload`, data, config);
      return response;
    };

    if (selectedRow) {
      return axios
        .put(`/api/${entity}/oficios/gerenciar`, formData, {
          params: { id: selectedRow.id },
        })
        .then((res) => {
          if (res.status === 200) {
            fileUpload(anexos, { referencesTo: res.data.id }).then(
              async (res) => {
                await axios.put(
                  `/api/${entity}/oficios/anexos`,
                  { anexosId: res.data.files },
                  { params: { id: res.data.referencesTo } }
                );
                setSelectedRow(null);
                formAddOficio.setLoaded();
                formAddOficio.closeOverlay();
                toast({
                  title: "Ofício adicionado com sucesso",
                  status: "success",
                  duration: 5000,
                  isClosable: false,
                  position,
                });
              }
            );
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            formAddOficio.setLoaded();
            toast({
              title: "Ofício já existe",
              status: "error",
              duration: 5000,
              isClosable: false,
              position,
            });
          } else {
            throw new Error(error.response.data);
          }
        });
    }

    axios
      .post(`/api/${entity}/oficios/gerenciar`, formData)
      .then((res) => {
        if (res.status === 200) {
          fileUpload(anexos, { referencesTo: res.data.id }).then(
            async (res) => {
              await axios.put(
                `/api/${entity}/oficios/anexos`,
                { anexosId: res.data.files },
                { params: { id: res.data.referencesTo } }
              );
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Nome Beneficiário",
        accessor: "nome",
        Footer: false,
      },
      {
        Header: "CPF",
        accessor: "cpf",
        Footer: false,
      },
      {
        Header: "Matrícula FLEM",
        accessor: "matriculaFlem",
        Footer: false,
      },
      {
        Header: "Demandante",
        Cell: ({
          row: {
            original: { vaga: vagas },
          },
        }) => {
          const vaga = vagas.reverse()[0];
          return (
            <Box minW={200}>
              {vaga && `${vaga.demandante.sigla} - ${vaga.demandante.nome}`}
            </Box>
          );
        },
        Footer: false,
      },
      // {
      //   Header: "Município Vaga",
      //   accessor: "municipio_vaga",
      //   Footer: false,
      // },
      // {
      //   Header: "Escritório Regional",
      //   accessor: "escritorio_regional",
      //   Footer: false,
      // },
      {
        Header: "Município Vaga",
        Cell: ({
          row: {
            original: { vaga: vagas },
          },
        }) => {
          const vaga = vagas.reverse()[0];
          return (
            <Box minW={200}>
              {vaga && vaga?.municipio?.nome}
            </Box>
          );
        },
        Footer: false,
      },
      {
        Header: "Situação Vaga",
        Cell: ({
          row: {
            original: { vaga: vagas },
          },
        }) => {
          const vaga = vagas.reverse()[0];
          return (
            <Box minW={200}>
              {vaga && `${vaga?.situacaoVaga?.tipoSituacao?.nome} - ${vaga?.situacaoVaga?.nome}`}
            </Box>
          );
        },
        Footer: false,
      },
      {
        Header: "Escritório Regional",
        Cell: ({
          row: {
            original: { vaga: vagas },
          },
        }) => {
          const vaga = vagas.reverse()[0];
          return (
            <Box minW={200}>
              {vaga && vaga?.municipio?.escritorioRegional?.nome}
            </Box>
          );
        },
        Footer: false,
      },
      {
        Header: "Ações",
        props: { teste: "true" },
        Cell: ({
          row: {
            original: { id },
          },
        }) => (
          <IconButton
            icon={<FiEye />}
            onClick={() => router.push(`/${entity}/beneficiarios/${id}`)}
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

  const data = useMemo(() => benefFromBd, [benefFromBd]);

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  useEffect(() => {
    axios.get(`/api/${entity}/beneficiarios`).then(({ data }) => {
      console.log(data);
      setBenefFromBd(data);
    });
    // .then(({ data }) => setBenefFromBd(data));
  }, []);

  useEffect(() => {
    setController(new AbortController());
  }, []);

  return (
    <>
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
      </AnimatePresenceWrapper>

      {/* Upload planilha de importação modal */}
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
            <Stack
              as={chakra.form}
              onSubmit={formUpload.handleSubmit(onSubmit)}
              w="100%"
              spacing={4}
            >
              <Dropzone
                id="anexos"
                onUploadProgress={uploadProgress}
                setUploadProgress={setUploadProgress}
                uploadController={controller}
                formControl={formUpload.control}
                validate={(v) => v?.length || "Adicione um arquivo"}
              />
              <Button
                colorScheme="brand1"
                type="submit"
                loadingText="Aguarde..."
                shadow="md"
                isDisabled={!formUpload.validation}
                isLoading={formUpload.isLoading}
              >
                Upload
              </Button>
            </Stack>
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

Beneficiarios.auth = false;
Beneficiarios.dashboard = true;
