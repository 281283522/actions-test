import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Input } from "antd";

export const SingleInputForm = (props) => {
  const {
    onSubmit,
    onBlur,
    treeData,
    targetObj,
    isDirectory,
    files,
    currentPath = "/",
  } = props;
  console.log(props?.targetObj, "000");
  const [value, setValue] = useState(
    props?.targetObj?.type === "rename"
      ? props?.targetObj?.node?.text
        ? `${props?.targetObj?.node?.text}`
        : ""
      : ""
  );
  const formRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let valueOverride = value.trim();
    let id = props?.targetObj?.node?.id;
    id = id.split("/");
    id.pop();
    id.push(valueOverride);
    id = id.join("/");
    let index = treeData.filter((i) => i.id === id);
    let text = props?.targetObj?.node?.text;
    if (text.trim() !== valueOverride) {
      setError(index?.length > 0);
    } else {
      setError(false);
    }
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleBlur = () => {
    onBlur();
  };
  const handleKeyDown = (event) => {
    if (error) {
      return;
    }
    let valueOverride = value.trim();
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit(valueOverride);
      setValue();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      handleBlur();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <label>
        <Input
          style={{
            maxWidth: "100%",
            border: `1px solid ${error ? "red" : "inherit"}`,
          }}
          onBlur={handleBlur}
          maxLength={35}
          autoFocus={true}
          name="name"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </label>
      {error ? (
        <div
          style={{
            display: "block",
            width: "100%",
            color: "red",
            fontSize: "12px",
            padding: "10px 0",
            position: "absolute",
            background: "wheat",
            borderRadius: "3px",
          }}
        >
          <span
            style={{
              padding: "10px",
            }}
          >
            文件或目录已存在
          </span>
        </div>
      ) : null}
    </form>
  );
};
