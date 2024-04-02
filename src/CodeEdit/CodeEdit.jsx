import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Input, Space } from "antd";
import { TypeIcon } from "../TypeIcon/TypeIcon";
// import styles from "./CodeEdit.module.css";
// console.log(styles, '---')
import Monaco from "../Monaco/Monaco";
import { CloseOutlined } from "@ant-design/icons";
import { usePageContext } from "../App/App";
function detectFileLanguage(fileName = "file") {
  const lowerCaseFileName = fileName.toLowerCase();
  switch (lowerCaseFileName.split(".").pop()) {
    case "js":
    case "jsx":
      return "JavaScript";
      break;
    case "py":
      return "Python";
      break;
    case "java":
      return "Java";
      break;
    case "html":
    case "htm":
      return "HTML";
      break;
    case "css":
      return "CSS";
      break;
    case "less":
      return "CSS";
    case "json":
      return "JSON";
      break;
    default:
      return "";
      break;
  }
}

const CodeEdit = function (props) {
  const { activeFile, treeData, setTreeData } = usePageContext();

  const [editObj, setEditObj] = useState({});
  const [isImg, setIsImg] = useState(false);
  useEffect(() => {
    const obj = treeData.find((i) => i?.id === activeFile?.id);
    setEditObj(obj);
    setIsImg(/\.(jpg|jpeg|png|gif)$/.test(obj?.text));
  }, [treeData, activeFile]);
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {isImg ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
            position: "relative",
            backgroundColor: "#f0f0f0",
            backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        >
          <img
            src={editObj?.contents}
            alt=""
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            height: "100%",
          }}
        >
          <Monaco
            language={detectFileLanguage(editObj?.text).toLowerCase()}
            value={editObj?.contents}
            onChange={(value, event) => {
              const _treeData = treeData.map((item) => {
                if (item.id === editObj.id) {
                  item.contents = value;
                }
                return item;
              });
              setTreeData(_treeData);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CodeEdit;
