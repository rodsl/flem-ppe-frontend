import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Portal,
  Progress,
  Stack,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiTrash } from "react-icons/fi";

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "gray.300";
};

export function Dropzone({
  colorScheme = "brand1",
  onSubmit,
  onUploadProgress,
  setUploadProgress,
  uploadController,
}) {
  const [myFiles, setMyFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles]
  );

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    onDrop,
    noClick: true,
  });

  const removeFile = (file) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const removeAll = () => {
    setMyFiles([]);
    setUploadProgress(null);
  };

  useEffect(() => {
    return () => {
      removeAll();
    };
  }, []);

  const files = myFiles.map((file) => (
    <Tag
      colorScheme={colorScheme}
      shadow="inner"
      rounded="full"
      variant="outline"
      border="1px"
      m={1}
      key={file.name + file.size}
    >
      <TagLabel display="flex" alignItems="center" ms={1}>
        {file.name}{" "}
        <IconButton
          colorScheme={colorScheme}
          icon={<FiTrash />}
          onClick={removeFile(file)}
          variant="ghost"
          rounded="full"
          size="xs"
          p={1}
          ms={1}
          _focus={{ bg: "transparent" }}
        />
      </TagLabel>
    </Tag>
  ));
  return (
    <>
      <Box
        p={4}
        alignItems="center"
        border="dashed 2px"
        bg="gray.200"
        color="gray.400"
        borderColor={() => getColor({ isFocused, isDragAccept, isDragReject })}
        rounded="lg"
        outline="none"
        transition="all .24s ease-in-out"
        {...getRootProps()}
        onClick={() => (myFiles.length > 0 ? null : open())}
      >
        <Flex flexDir="column" alignItems="center">
          <input {...getInputProps()} />
          {files.length === 0 && (
            <Text align="center">
              Arraste e solte os arquivos aqui, ou clique para selecionar
            </Text>
          )}
          {files.length > 0 && <Text>Arquivos para Upload</Text>}
          <Box>{files.length > 0 && <>{files}</>}</Box>
        </Flex>
        {onUploadProgress && (
          <Progress
            value={onUploadProgress}
            h={6}
            my={4}
            hasStripe={onUploadProgress && onUploadProgress < 100}
            isAnimated={onUploadProgress && onUploadProgress < 100}
            isIndeterminate={!onUploadProgress && onUploadProgress < 100}
            colorScheme={
              (onUploadProgress && onUploadProgress < 100 && "brand1") ||
              (onUploadProgress && onUploadProgress === 100 && "green")
            }
            rounded="full"
            shadow="inner"
            position="relative"
          >
            <Flex
              position="absolute"
              bottom={0}
              top={0}
              zIndex="1000"
              w="100%"
              justifyContent="center"
            >
              <Flex alignItems="center">
                {onUploadProgress && (
                  <Badge
                    colorScheme={
                      (onUploadProgress &&
                        onUploadProgress < 100 &&
                        "brand1") ||
                      (onUploadProgress && onUploadProgress === 100 && "green")
                    }
                    rounded="full"
                    shadow="inner"
                  >
                    {onUploadProgress}%
                  </Badge>
                )}
              </Flex>
            </Flex>
          </Progress>
        )}
      </Box>
      {files.length > 0 && onUploadProgress < 100 && (
        <Flex justifyContent="flex-end" pt={4}>
          <Button
            colorScheme={onUploadProgress ? "red" : "brand1"}
            variant="outline"
            onClick={() => {
              if (onUploadProgress) {
                uploadController.abort("cancelled");
              } else {
                onSubmit(myFiles);
              }
            }}
          >
            {!onUploadProgress ? "Upload" : "Cancelar"}
          </Button>
        </Flex>
      )}
    </>
  );
}
