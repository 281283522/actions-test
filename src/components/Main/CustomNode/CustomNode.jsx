import React from 'react';
import { useDragOver } from '@minoru/react-dnd-treeview';
import { TypeIcon } from '../TypeIcon/TypeIcon';
import { CaretRightOutlined } from '@ant-design/icons';
import { Dropdown, Modal } from 'antd';
import styles from './CustomNode.module.css';
import { usePageContext } from '../App/App';

export const CustomNode = (props) => {
  const {
    fixData,
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
    setInitialOpen
  } = usePageContext();
  const { isOpen } = props;
  const {
    id,
    droppable,
    data
  } = props.node;
  const indent = props.depth * 12;
  const handleToggle = (e) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };
  const dragOverProps = useDragOver(id, isOpen, props.onToggle);
  const shellAction = props.shellAction;

  return <Dropdown
    menu={{
      items: [
        droppable && {
          key: 'file',
          label: '新建文件'
        },
        droppable && {
          key: 'dir',
          label: '新建目录'
        },
        {
          key: 'rename',
          label: '重命名'
        },
        {
          key: 'delete',
          label: '删除'
        }
      ].filter((item) => item),
      onClick: async ({
        key,
        domEvent
      }) => {
        domEvent.stopPropagation();
        domEvent.preventDefault();
        if (key === 'delete') {
          props?.node?.id && shellAction('rm', [ '-rf', props?.node?.id ]);
          fixData(key, props?.node?.id);
        } else {
          setTargetItem({
            node: props.node,
            type: key
          });
        }
      }
    }}
    trigger={[ 'contextMenu' ]}
  >
      {/*{...dragOverProps}*/}
    <div
      onDragEnter={e => {
        dragOverProps.onDragEnter(e);
      }}
      onDragLeave={e => {
        dragOverProps.onDragLeave(e);
      }}
      onDrop={e => {
        dragOverProps.onDrop(e);
      }}
      className={styles.root}
      style={{
        paddingInlineStart: indent,
        ...(targetItem?.node?.id === props.node?.id
          ? {
            backgroundColor: '#515151'
          }
          : {}),
        ...(active?.id === props.node?.id
          ? {
            backgroundColor: '#515151',
            color: 'white'
          }
          : {})
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
            setBarAr([ ...ar ]);
          }
        }
      }}
    ><div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 6,
        paddingLeft: 8
      }}
    >
          <CaretRightOutlined
            style={{
              visibility: droppable
                ? 'visible'
                : 'hidden',
              transform: isOpen
                ? 'rotate(90deg)'
                : 'rotate(0deg)'
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
              width: '100%'
            }}
          >
            {props.node.text}
          </div>
        </div></div>
      </Dropdown>;
};
