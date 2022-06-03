import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Portal,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Dropzone } from "components/Dropzone";
import { useCallback, useState } from "react";
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

// const Container = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 20px;
//   border-width: 2px;
//   border-radius: 2px;
//   border-color: ${props => getColor(props)};
//   border-style: dashed;
//   background-color: #fafafa;
//   color: #bdbdbd;
//   outline: none;
//   transition: border .24s ease-in-out;
// `;

export default function StyledDropzone() {
  const [uploadProgress, setUploadProgress] = useState();
  const onSubmit = async (data) => {
    console.log(data);
    const formData = new FormData();
    // Object.keys(files).map((key, idx) => formData.append(key, files[key]));
    formData.append("file", data[0]);

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
        setUploadProgress(Math.round((event.loaded * 100) / event.total))
      },
    };
    axios
      .post("/api/upload", formData, config)
      .then((res) => console.log(res))
      .catch((res) => console.log(res));
  };

  return (
    <>
      <Dropzone onSubmit={onSubmit} onUploadProgress={uploadProgress} />
    </>
  );
}
