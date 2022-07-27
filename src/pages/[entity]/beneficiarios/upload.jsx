import { axios } from "services/apiService";
import { Dropzone } from "components/Dropzone";
import { useState } from "react";

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

export default function StyledDropzone() {
  const [uploadProgress, setUploadProgress] = useState();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("file", data[0]);
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
        setUploadProgress(Math.round((event.loaded * 100) / event.total));
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
