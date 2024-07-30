import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import {
  Tree,
  MultiBackend,
  getBackendOptions
} from '@minoru/react-dnd-treeview';
import { CustomNode } from '../CustomNode/CustomNode';
import { CustomDragPreview } from '../CustomDragPreview/CustomDragPreview';
import styles from './App.module.css';
import BarView from './BarView';
import CodeEdit from '../CodeEdit/CodeEdit';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { Spin, Menu, Dropdown, Button } from 'antd';
import ToolBar from '~/components/ToolBar';
import TreeEdit from '~/components/Main/TreeEdit/TreeEdit';
import HeaderBar from '~/components/HeaderBar';
import { getDirTreeByCtx } from '~/shared/utils';

const ContextObj = createContext();

export const usePageContext = () => {
  const context = useContext(ContextObj);
  if (!context) {
    throw Error('使用有误');
  }
  return context;
};

function transformArray (inputArray) {
  const transformedArray = [];
  for (const item of inputArray) {
    const {
      path,
      isDir,
      isFile,
      name,
      contents,
      children
    } = item;
    let ar = path.split('/');
    ar.pop();
    const parent = ar.join('/');
    const transformedItem = {
      id: path,
      parent: parent || 0,
      droppable: isDir,
      text: name,
      contents: contents
    };
    transformedArray.push(transformedItem);
  }
  return transformedArray;
}

const getLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value
    ? JSON.parse(value)
    : undefined;
};

function MainApp (props) {
  const treeDataEditIngRef = useRef(false);
  const treeDomRef = useRef(null);
  const menuBoxRef = useRef(null);
  const loopIngRef = useRef(false);
  const [ treeData, setTreeData ] = useState([]);
  const [ showMenu, setShowMenu ] = useState(false);
  const [ targetItem, setTargetItem ] = useState(null);
  const [ initialOpen, setInitialOpen ] = useState([]);
  const [ dirViewIsOpen, setDirViewIsOpen ] = useState(true);
  const [ browserViewIsOpen, setBrowserViewIsOpen ] = useState(true);
  const [ commandsViewIsOpen, setCommandsViewIsOpen ] = useState(true);
  const [ codeEditMap, setCodeEditMap ] = useState({});
  const [ allotmentDefaultSizes, setAllotmentDefaultSizes ] = useState(() => {
    let sizes = localStorage.getItem('allotmentDefaultSizes');
    if (sizes) {
      return JSON.parse(sizes);
    }
    return {
      a: [],
      b: []
    };
  });
  const [ active, setActive ] = useState({
    // id: 'thumbnail.png',
    // parent: 0,
    // droppable: false,
    // text: 'thumbnail.png'
  });
  const [ activeFile, setActiveFile ] = useState({
    // id: 'thumbnail.png',
    // parent: 0,
    // droppable: false,
    // text: 'thumbnail.png'
  });
  const [ barAr, setBarAr ] = useState([
    // {
    //   id: '.gitignore',
    //   parent: 0,
    //   droppable: false,
    //   text: '.gitignore'
    // },
  ]);
  useEffect(() => {
    let map = {};
    barAr.forEach(item => {
      map[ item.id ] = <CodeEdit
        key={item.id}
      />;
    });
    setCodeEditMap(map);
  }, [ barAr ]);

  useEffect(() => {
    props?.onResize && props?.onResize();
  }, [ JSON.stringify(allotmentDefaultSizes) ]);

  const loop = async () => {
    try {
      let ctx = window.webCtx;
      if (ctx) {
        if (treeDataEditIngRef.current) {
          return;
        }
        if (treeDataEditIngRef.current && !loopIngRef.current) {
          console.log('处理中');
          return;
        }
        loopIngRef.current = true;
        let res = await getDirTreeByCtx(ctx);
        let ar = transformArray(res || []);
        setTreeData(ar);
        loopIngRef.current = false;
        // setTimeout(() => {
        //   loop();
        // }, 3000);
        requestAnimationFrame(loop);
      } else {
        requestAnimationFrame(loop);
      }
    } catch (e) {
      console.log(e);
      requestAnimationFrame(loop);
    }
  };
  useEffect(() => {
    loop();
  }, []);

  useEffect(() => {
    let ref = menuBoxRef?.current;
    const handleMouseOut = (event) => {
      if (ref) {
        let {
          clientHeight,
          clientWidth
        } = ref;
        let {
          x,
          y
        } = event;
        let {
          x: X = 0,
          y: Y = 0
        } = showMenu || {};
        if (x < X || x >= (X + clientWidth) || y < Y || y >= (Y + clientHeight)) {
          setShowMenu(null);
        }
      }
    };
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [ showMenu ]);
  useEffect(() => {
    let ref = treeDomRef?.current;
    ref && ref.addEventListener('contextmenu', function (event) {
      if (event.target?.parentNode === treeDomRef.current) {
        event.preventDefault();
        setShowMenu({
          x: event.clientX,
          y: event.clientY
        });
      } else {
        setShowMenu(null);
      }
    });
  }, []);
  useEffect(() => {
    localStorage.setItem('active', JSON.stringify(active || {}));
    localStorage.setItem('activeFile', JSON.stringify(activeFile || {}));
    localStorage.setItem('barAr', JSON.stringify(barAr || []));
  }, [ active, activeFile, barAr, targetItem ]);
  useEffect(() => {
    let index = treeData.findIndex((item) => item.id === active?.id);
    if (index === -1) {
      setActive(null);
    }
  }, [ treeData ]);

  const fixData = (type, id, newId) => {

    //   mv dragSourceId, dropTargetId
    //   rename dragSourceId, newId
    //   delete id
    if (type === 'delete' && active?.id) {
      if (id === active?.id || `${active.id}/`.indexOf(id) === 0) {
        setActive(null);
      }
      let _barAr = barAr.filter((item) => {
        if (id === item?.id) {
          setActiveFile(null);
          return false;
        }
        if (item.id.indexOf(`${id}/`) === 0) {
          return false;
        }
        return item?.id !== id;
      });
      setBarAr(_barAr);
    }
    // if (type === 'rename') {
    //   const newItem = treeData.find((item) => item.id === newId);
    //   if (!newItem) {
    //     requestAnimationFrame(() => {
    //       fixData(type, id, newId);
    //     });
    //   } else {
    //     let _barAr = [];
    //     let _activeFile = activeFile;
    //     barAr.map((barItem) => {
    //       if (id === barItem?.id) {
    //         _activeFile = newItem;
    //         _barAr.push(newItem);
    //       } else {
    //         let barId = barItem?.id;
    //         if (barId.indexOf(`${id}/`) === 0) {
    //           let regx = new RegExp(`^${new RegExp(id)}`);
    //           let _id = barId.replace(regx, newId);
    //           _barAr.push(treeData.find((item) => item.id === _id));
    //         } else {
    //           _barAr.push(barItem);
    //         }
    //       }
    //     });
    //     console.log(_barAr, '--->', treeData);
    //     setActiveFile(_activeFile);
    //     setBarAr(_barAr);
    //   }
    // }
  };
  const handleDrop = (newTree, params) => {
    const {
      dragSourceId,
      dropTargetId
    } = params;
    shellAction('mv', [ dragSourceId, dropTargetId ]);
    fixData('mv', dragSourceId, dropTargetId);
  };

  const readFile = async (file, node) => {
    const { name } = file;
    let fileContents = await file.arrayBuffer();
    let id = node.id;
    id = id.split('/');
    id.push(name);
    window.webCtx.fs.writeFile(id.join('/'), new Uint8Array(fileContents));
  };
  const shellAction = props.shellAction;
  const values = {
    onResize: props.onResize,
    fixData,
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
    shellAction
  };
  const allotmentChange = (key, arr) => {
    allotmentDefaultSizes[ key ] = arr;
    setAllotmentDefaultSizes(allotmentDefaultSizes);
    localStorage.setItem(
      'allotmentDefaultSizes',
      JSON.stringify(allotmentDefaultSizes)
    );
  };

  const {
    iframe,
    terminal
  } = props;

  return <ContextObj.Provider value={values}>
    <Spin spinning={props.loading}>
      {targetItem && <TreeEdit />}
      <div className={styles.engin}>
        <ToolBar
          {...props.toolBarProps}
          onTerminalChange={() => setCommandsViewIsOpen(!commandsViewIsOpen)}
        />
      <div className={styles.enginBody}>
        <HeaderBar
          {...props.headerBarProps}
          onPreviewChange={() => setBrowserViewIsOpen(!browserViewIsOpen)}
        />
        <div
          className={styles.enginContent}
        >
    <div
      style={{
        height: 'calc(100vh - 50px)',
        width: 'calc(100vw - 50px)'
      }}
    >
        <Allotment
          vertical={true}
          proportionalLayout={false}
          defaultSizes={allotmentDefaultSizes?.a}
          onChange={(arr) => {
            allotmentChange('a', arr);
          }}
        >
          <Allotment.Pane>
            <Allotment
              proportionalLayout={false}
              defaultSizes={allotmentDefaultSizes?.b}
              onChange={(arr) => {
                allotmentChange('b', arr);
              }}
            >
              <Allotment.Pane
                visible={dirViewIsOpen}
                minSize={200}
              >

                  <div
                    style={{
                      flex: '0 1 300px',
                      height: '100%',
                      overflow: 'auto',
                      background: 'rgb(24 24 24)',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  >
                <DndProvider
                  backend={MultiBackend}
                  options={getBackendOptions()}
                >
                <div
                  className={styles.app}
                  ref={treeDomRef}
                >
                  {showMenu && <div
                    style={{
                      position: 'fixed',
                      left: showMenu?.x,
                      top: showMenu?.y,
                      zIndex: 99999,
                      borderRadius: '8px'
                    }}
                    ref={menuBoxRef}
                  >
                    <Menu
                      style={{
                        borderRadius: '8px'
                      }}
                      mode="vertical"
                      items={[
                        {
                          key: 'file',
                          label: '新建文件'
                        },
                        {
                          key: 'dir',
                          label: '新建目录'
                        }
                      ]}
                      onClick={({
                        key,
                        domEvent
                      }) => {
                        domEvent.stopPropagation();
                        domEvent.preventDefault();
                        setTargetItem({
                          node: {
                            id: '/'
                          },
                          type: key
                        });
                      }}
                    />
                  </div>}
                  <Tree
                    tree={treeData}
                    rootId={0}
                    render={(node, {
                      depth,
                      isOpen,
                      onToggle
                    }) => {
                      return <div
                        onDragEnter={(e) => {
                          node?.droppable === true && e.target.classList.add(styles.dropTarget);
                        }}
                        onDragLeave={(e) => {
                          node?.droppable === true && e.target.classList.remove(styles.dropTarget);
                        }}
                        onDrop={(e) => {
                          // e?.defaultPrevented === true //外部拖拽
                          node?.droppable === true && e.target.classList.remove(styles.dropTarget);
                          if (!node?.droppable) {
                            return;
                          }
                          const files = e.dataTransfer.files;
                          if (files?.length) {
                            [ ...files ].forEach((file) => {
                              const { type } = file;
                              if (/(image|text|json)/gi.test(type)) {
                                readFile(file, node);
                              }
                            });
                          }
                        }}
                      >
                        <CustomNode
                          treeDataEditIngRef={treeDataEditIngRef}
                          node={node}
                          depth={depth}
                          isOpen={isOpen}
                          shellAction={shellAction}
                          onToggle={onToggle}
                        />
                      </div>;
                    }}
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
                      dropTarget: styles.dropTarget
                    }}
                  />
                </div>
              </DndProvider>
                </div>
              </Allotment.Pane>
              <Allotment.Pane
                minSize={200}
              >
                <div
                  style={{
                    flex: '1 1 0%',
                    height: '100vh',
                    overflow: 'auto',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      background: '#37373d',
                      width: '100%',
                      color: 'white'
                    }}
                  >
                    <BarView />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '40px',
                      height: (() => {
                        let num = 40;
                        let h = allotmentDefaultSizes?.a || [];
                        h = h?.[ 1 ] || 0;
                        return `calc(100% - ${num + h + 49}px)`;
                      })(),
                      width: '100%',
                      overflow: 'auto'
                    }}
                  >
                    {codeEditMap[ activeFile?.id ]}
                    {/*<CodeEdit*/}
                    {/*  key={activeFile?.id}*/}
                    {/*/>*/}
                  </div>
                </div>
              </Allotment.Pane>
              <Allotment.Pane visible={browserViewIsOpen}>
                {iframe}
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
          <Allotment.Pane
            visible={commandsViewIsOpen}
            minSize={50}
          >
              {terminal}
          </Allotment.Pane>
        </Allotment>
      </div>
        </div>
      </div>
    </div>
    </Spin>
    </ContextObj.Provider>;
}

export default MainApp;
