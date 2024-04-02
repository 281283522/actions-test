import React, { useEffect, useState, createContext, useContext } from "react";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { CustomNode } from "../CustomNode/CustomNode";
import { CustomDragPreview } from "../CustomDragPreview/CustomDragPreview";
import SampleData from "../sample_data.json";
import test from "../test.json";
import styles from "./App.module.css";
import BarView from "./BarView";
import CodeEdit from "../CodeEdit/CodeEdit";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

const ContextObj = createContext();

export const usePageContext = () => {
  const context = useContext(ContextObj);
  if (!context) {
    throw Error("使用有误");
  }
  return context;
};

function transformArray(inputArray) {
  const transformedArray = [];
  for (const item of inputArray) {
    const { path, isDir, isFile, name, contents } = item;
    let ar = path.split("/");
    ar.pop();
    const parent = ar.join("/");
    const transformedItem = {
      id: path,
      parent: parent || 0,
      droppable: isDir,
      text: name,
      contents: contents,
    };
    transformedArray.push(transformedItem);
  }
  return transformedArray;
}

const getLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : undefined;
};
function App() {
  const [treeData, setTreeData] = useState(transformArray(test));
  const [targetItem, setTargetItem] = useState(null);
  const [initialOpen, setInitialOpen] = useState([]);
  const [dirViewIsOpen, setDirViewIsOpen] = useState(true);
  const [browserViewIsOpen, setBrowserViewIsOpen] = useState(true);
  const [commandsViewIsOpen, setCommandsViewIsOpen] = useState(true);
  const [allotmentDefaultSizes, setAllotmentDefaultSizes] = useState(() => {
    let sizes = localStorage.getItem("allotmentDefaultSizes");
    if (sizes) {
      return JSON.parse(sizes);
    }
    return {
      a: [],
      b: [],
    };
  });
  const [active, setActive] = useState(
    getLocalStorage("active") || {
      id: "thumbnail.png",
      parent: 0,
      droppable: false,
      text: "thumbnail.png",
    }
  );
  const [activeFile, setActiveFile] = useState(
    getLocalStorage("activeFile") || {
      id: "thumbnail.png",
      parent: 0,
      droppable: false,
      text: "thumbnail.png",
    }
  );
  const [barAr, setBarAr] = useState(
    getLocalStorage("barAr") || [
      {
        id: ".gitignore",
        parent: 0,
        droppable: false,
        text: ".gitignore",
      },
      {
        id: "README.md",
        parent: 0,
        droppable: false,
        text: "README.md",
      },
      {
        id: "jjb.config.json",
        parent: 0,
        droppable: false,
        text: "jjb.config.json",
      },
      {
        id: "package.json",
        parent: 0,
        droppable: false,
        text: "package.json",
      },
      {
        id: "thumbnail.png",
        parent: 0,
        droppable: false,
        text: "thumbnail.png",
      },
    ]
  );
  const allotmentChange = (key, arr) => {
    allotmentDefaultSizes[key] = arr;
    setAllotmentDefaultSizes(allotmentDefaultSizes);
    localStorage.setItem(
      "allotmentDefaultSizes",
      JSON.stringify(allotmentDefaultSizes)
    );
  };
  const handleDrop = (newTree) => setTreeData(newTree);

  useEffect(() => {
    localStorage.setItem("active", JSON.stringify(active));
    localStorage.setItem("activeFile", JSON.stringify(activeFile));
    localStorage.setItem("barAr", JSON.stringify(barAr));
  }, [active, activeFile, barAr, targetItem]);

  useEffect(() => {
    let index = treeData.findIndex((item) => item.id === active?.id);
    if (index === -1) {
      setActive(null);
    }
  }, [treeData]);

  const values = {
    barAr,
    setBarAr,
    treeData,
    active,
    setActive,
    activeFile,
    setActiveFile,
    setTreeData,
    targetItem,
    setTargetItem,
    initialOpen,
    setInitialOpen,
    dirViewIsOpen,
    setDirViewIsOpen,
    browserViewIsOpen,
    setBrowserViewIsOpen,
    commandsViewIsOpen,
    setCommandsViewIsOpen,
    allotmentDefaultSizes,
    setAllotmentDefaultSizes,
  };
  return (
    <ContextObj.Provider value={values}>
      <div
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <Allotment
          vertical={true}
          defaultSizes={allotmentDefaultSizes?.a}
          onChange={(arr) => {
            allotmentChange("a", arr);
          }}
        >
          <Allotment.Pane>
            <Allotment
              defaultSizes={allotmentDefaultSizes?.b}
              onChange={(arr) => {
                allotmentChange("b", arr);
              }}
            >
              <Allotment.Pane visible={dirViewIsOpen}>
                <div
                  style={{
                    flex: "0 1 300px",
                    minWidth: "300px",
                    height: "100vh",
                    overflow: "auto",
                    background: "rgb(24 24 24)",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  <DndProvider
                    backend={MultiBackend}
                    options={getBackendOptions()}
                  >
                    <div className={styles.app}>
                      <Tree
                        tree={treeData}
                        rootId={0}
                        render={(node, { depth, isOpen, onToggle }) => (
                          <CustomNode
                            // barAr={barAr}
                            // setBarAr={setBarAr}
                            // activeFile={activeFile}
                            // setActiveFile={setActiveFile}
                            // active={active}
                            // setActive={setActive}
                            // targetItem={targetItem}
                            // setTargetItem={setTargetItem}
                            // treeData={treeData}
                            // setTreeData={setTreeData}
                            // initialOpen={initialOpen}
                            // setInitialOpen={setInitialOpen}
                            node={node}
                            depth={depth}
                            isOpen={isOpen}
                            onToggle={onToggle}
                          />
                        )}
                        dragPreviewRender={(monitorProps) => (
                          <CustomDragPreview monitorProps={monitorProps} />
                        )}
                        onDrop={handleDrop}
                        initialOpen={initialOpen}
                        onChangeOpen={(ar) => {
                          setInitialOpen(ar);
                        }}
                        classes={{
                          root: styles.treeRoot,
                          draggingSource: styles.draggingSource,
                          dropTarget: styles.dropTarget,
                        }}
                      />
                    </div>
                  </DndProvider>
                </div>
              </Allotment.Pane>
              <Allotment.Pane>
                <div
                  style={{
                    flex: "1 1 0%",
                    height: "100vh",
                    overflow: "auto",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      background: "#37373d",
                      width: "100%",
                      color: "white",
                    }}
                  >
                    <BarView />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "40px",
                      height: "calc(100% - 40px)",
                      overflow: "auto",
                      width: "100%",
                    }}
                  >
                    <CodeEdit />
                  </div>
                </div>
              </Allotment.Pane>
              <Allotment.Pane visible={browserViewIsOpen}>
                浏览器窗口
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
          <Allotment.Pane visible={commandsViewIsOpen}>
            <div>Pane 1</div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </ContextObj.Provider>
  );
}

export default App;
