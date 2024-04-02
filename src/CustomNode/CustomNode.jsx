import React from "react";
import { useDragOver } from "@minoru/react-dnd-treeview";
import { TypeIcon } from "../TypeIcon/TypeIcon";
import { CaretRightOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { SingleInputForm } from "../SingleInputForm/SingleInputForm";
import styles from "./CustomNode.module.css";
import { usePageContext } from "../App/App";

export const CustomNode = (props) => {
  const {
    barAr,
    setBarAr,
    activeFile,
    setActiveFile,
    active,
    setActive,
    targetItem,
    setTargetItem,
    treeData,
    setTreeData,
    initialOpen,
    setInitialOpen,
  } = usePageContext();
  const { isOpen } = props;
  const { id, droppable, data } = props.node;
  const indent = props.depth * 12;
  const handleToggle = (e) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };
  const dragOverProps = useDragOver(id, isOpen, props.onToggle);
  return (
    <div
      {...dragOverProps}
      className={styles.root}
      style={{
        paddingInlineStart: indent,
        ...(targetItem?.node?.id === props.node?.id
          ? {
              backgroundColor: "#515151",
            }
          : {}),
        ...(active?.id === props.node?.id
          ? {
              backgroundColor: "#515151",
              color: "white",
            }
          : {}),
      }}
      onClick={(e) => {
        setActive(props.node);
        if (props.node.droppable) {
          handleToggle(e);
        } else {
          let ar = barAr;
          let index = ar.findIndex((i) => i?.id === props.node?.id);
          setActiveFile(props.node);
          if (index === -1) {
            ar.push(props.node);
            setBarAr([...ar]);
          }
        }
      }}
    >
      <Dropdown
        menu={{
          items: [
            droppable && {
              key: "file",
              label: "新建文件",
            },
            droppable && {
              key: "dir",
              label: "新建目录",
            },
            {
              key: "rename",
              label: "重命名",
            },
            {
              key: "delete",
              label: "删除",
            },
          ].filter((item) => item),
          onMouseEnter: () => {
            setTargetItem({
              node: props.node,
            });
          },
          onClick: ({ key, domEvent }) => {
            domEvent.stopPropagation();
            domEvent.preventDefault();
            setTargetItem({
              node: props.node,
              type: key,
            });
            switch (key) {
              case "file":
              case "dir":
                const index = treeData.findIndex(
                  (item) => item.id === props.node?.id
                );
                const text = key === "dir" ? "新建目录" : "新建文件";
                const newItem = {
                  id: `${props.node?.id}/${text}`,
                  parent: props.node?.id,
                  droppable: key === "dir",
                  text: text,
                };
                setTargetItem({
                  node: newItem,
                  type: key,
                });
                treeData.splice(index, 0, newItem);
                if (!initialOpen.includes(props.node?.id)) {
                  initialOpen.push(props.node?.id);
                  setInitialOpen(initialOpen);
                }
                setTreeData(treeData);
                break;
              case "rename":
                break;
              case "delete":
                setTargetItem(null);
                const newTreeData = treeData.filter(
                  (item) => item.id !== props.node.id
                );
                setTreeData(newTreeData);
                break;
            }
          },
        }}
        trigger={["contextMenu"]}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            paddingLeft: 8,
          }}
        >
          <CaretRightOutlined
            style={{
              visibility: droppable ? "visible" : "hidden",
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
          <TypeIcon
            item={props.node}
            isOpen={isOpen}
            droppable={droppable}
            fileType={data?.fileType}
          />
          <div
            className={styles.labelGridItem}
            style={{
              width: "100%",
            }}
          >
            {(() => {
              if (
                ["file", "dir", "rename"].includes(targetItem?.type) &&
                targetItem?.node?.id === props.node?.id
              ) {
                return (
                  <SingleInputForm
                    treeData={treeData}
                    targetObj={targetItem}
                    onSubmit={(text) => {
                      const bacObj = {};
                      const _treeData = treeData.map((item) => {
                        if (item.id === targetItem?.node?.id) {
                          bacObj.oldId = item.id;
                          item.text = text;
                          let id = item.id;
                          id = id.split("/");
                          id.pop();
                          id.push(text);
                          item.id = id.join("/");
                          bacObj.newId = item.id;
                        }
                        return item;
                      });
                      const { newId, oldId } = bacObj;
                      const treeAr = _treeData.map((item) => {
                        const { id, parent } = item;
                        if (parent === oldId) {
                          item.parent = newId;
                          item.id = item.id.replace(
                            new RegExp(`^${oldId}`),
                            `${newId}`
                          );
                        } else {
                          if (new RegExp(`^${oldId}/`).test(id)) {
                            item.parent = item.parent.replace(
                              new RegExp(`^${oldId}/`),
                              `${newId}/`
                            );
                            item.id = item.id.replace(
                              new RegExp(`^${oldId}/`),
                              `${newId}/`
                            );
                          }
                        }
                        return item;
                      });
                      const openAr = initialOpen.map((item) => {
                        if (item === oldId) {
                          return newId;
                        } else if (new RegExp(`^${oldId}/`).test(item)) {
                          return item.replace(
                            new RegExp(`^${oldId}/`),
                            `${newId}/`
                          );
                        } else {
                          return item;
                        }
                      });
                      setInitialOpen(openAr);
                      setTreeData(treeAr);
                      setTargetItem(null);
                    }}
                    onBlur={() => {
                      setTargetItem(null);
                    }}
                  />
                );
              }
              return props.node.text;
            })()}
          </div>
        </div>
      </Dropdown>
    </div>
  );
};
