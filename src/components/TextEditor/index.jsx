import {
  Box,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import "@deevotechvn/quill-mention/dist/quill.mention.min.css";
import { useEffect } from "react";
import { Logo } from "components/Logo";

export function TextEditor({
  setContent,
  id,
  label,
  formControl: {
    trigger,
    formState: { errors },
    register,
    setValue,
  },
  type = "text",
  placeholder,
  required = "Obrigatório",
  validate,
  isLoaded = true,
  onChange,
  value,
  loadOnEditor,
  ...props
}) {
  const atValues = [
    {
      id: "nome_beneficiario",
      value: "Nome do Beneficiário",
    },
    {
      id: "codigo_oficio",
      value: "Codigo do Oficio",
    },
    {
      id: "unidade_lotacao",
      value: "Unidade de Lotação",
    },
    {
      id: "logr_unidade_lotacao",
      value: "Logradouro da Unidade de Lotação",
    },
    {
      id: "bairr_unidade_lotacao",
      value: "Bairro da Unidade de Lotação",
    },
    {
      id: "munic_vaga",
      value: "Município da Vaga",
    },
    {
      id: "ponto_focal_unidade",
      value: "Ponto Focal da Unidade",
    },
    {
      id: "sigl_demandante",
      value: "Sigla do Demandante",
    },
    {
      id: "form_beneficiario",
      value: "Formação do Beneficiário",
    },
  ];

  async function suggestPeople(searchTerm) {
    return atValues.filter((person) => {
      console.log(searchTerm.toLowerCase());
      return person.value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(
          searchTerm
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
        );
    });
  }

  const { quill, quillRef, Quill } = useQuill({
    formats: [
      "bold",
      "italic",
      "underline",
      "strike",
      "align",
      "list",
      "indent",
      "size",
      "header",
      "link",
      "image",
      "video",
      "color",
      "background",
      "clean",
      "mention",
    ],
    modules: {
      mention: {
        allowedChars: /.*$/,
        mentionDenotationChars: ["@"],
        attributes: { bold: true },
        source: async function (searchTerm, renderList) {
          const matchedPeople = await suggestPeople(searchTerm);
          renderList(matchedPeople);
        },
      },
    },
  });

  if (Quill && !quill) {
    // For execute this line only once.
    const { Mention, MentionBlot } = require("@deevotechvn/quill-mention"); // Install with 'yarn add quill-magic-url'
    Quill.register("modules/mention", Mention);
    Quill.register(MentionBlot);
  }

  quill &&
    quill.on("text-change", (delta) => {
      setValue(id, quill.getContents());
      trigger(id);
    });

  useEffect(() => {
    if (quill && loadOnEditor) {
      quill.setContents(JSON.parse(loadOnEditor));
    }
  }, [quill, loadOnEditor]);

  return (
    // <Input
    //   as={Box}
    //   {...register("template", {
    //     onChange: (e) => console.log(e.target.value),
    //     setValue: setValue,
    //   })}
    //   type="text"
    //   id="template"
    //   className="page"
    //   ref={quillRef}
    //   w="100%"
    //   h="92%"
    //   fontSize={14}
    //   sx={{ border: "none !important" }}
    //   shadow="none"
    //   p={0}
    // />

    // <Box>
    <Box>
      <FormControl id={id} isInvalid={errors[id]} w="100%" h="100%">
        <FormLabel>{label}</FormLabel>
        <Flex justifyContent="center">
          <Box
            shadow="md"
            w="210mm"
            minH="296.5mm"
            border="1px"
            borderColor="gray.200"
            rounded="lg"
            px={14}
            py={4}
          >
            <VStack h="100%" spacing={0}>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                h="10%"
                w="100%"
                px={1}
              >
                <Logo h={30} my={10} />
                <Image
                  src="http://www.itororoja.com.br/wp-content/uploads/2018/04/30657010_2085363125039982_1581435021703512064_n.jpg"
                  h={90}
                />
              </Flex>
              <Skeleton isLoaded={isLoaded} fadeDuration={0.5} w="100%" h="90%">
                <Input
                  as={Box}
                  type={type}
                  placeholder={placeholder}
                  {...register(id, {
                    validate: (e) =>
                      quill.getLength() > 2 || "Digite um template válido",
                  })}
                  {...props}
                  className="page"
                  ref={quillRef}
                  w="100%"
                  h="91%"
                  fontSize={14}
                  p={0}
                  shadow="none"
                  sx={{
                    border:
                      "2px dashed var(--chakra-colors-gray-200) !important",
                  }}
                />
              </Skeleton>
              <FormErrorMessage pb={2} fontWeight="bold" alignSelf="flex-start">
                {errors[id]?.message}
              </FormErrorMessage>
              <Box w="100%" h="5%">
                <Box>
                  <Text fontSize={9}>
                    <chakra.span fontWeight="bold">Endereço: </chakra.span>
                    Rua Visconde de Itaborahy, 845, Amaralina, Salvador - BA
                    41900-000
                  </Text>
                  <Text fontSize={9}>
                    <chakra.span fontWeight="bold">Contato: </chakra.span>
                    (71) 3103-7500
                  </Text>
                </Box>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </FormControl>
    </Box>
  );
}
