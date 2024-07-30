import React, { useEffect, useRef, useState } from 'react';
import { Input, Modal } from 'antd';
import { usePageContext } from '~/components/Main/App/App';

function TreeEdit () {
  const {
    fixData,
    barAr,
    setBarAr,
    activeFile,
    setActiveFile,
    active,
    setActive,
    treeData,
    targetItem,
    setTargetItem,
    initialOpen,
    setInitialOpen,
    shellAction
  } = usePageContext();
  const {
    type,
    node
  } = targetItem;
  const [ error, setError ] = useState(false);
  const [ value, setValue ] = useState('');
  const [ id, setId ] = useState();

  useEffect(() => {
    const {
      id,
      text
    } = node;
    if (type === 'rename') {
      setValue(text);
    }
  }, [ targetItem ]);

  useEffect(() => {
    const node = targetItem?.node;
    if (!value) {
      return;
    }
    let valueOverride = value.trim();
    let id = node?.id;

    let droppable = false;
    if (type === 'rename') {
      id = id.split('/');
      id.pop();
      id.push(valueOverride);
      droppable = node?.droppable;
    } else {
      id = id.split('/');
      id.push(valueOverride);
      if (type === 'dir') {
        droppable = true;
      } else {
        droppable = false;
      }
    }
    if (node?.id === '/') {
      id = [ valueOverride ];
    }
    id = id.join('/');
    setId(id);
    let len = treeData.filter((i) => i.id === id && i.droppable === droppable && (type === 'rename'
      ? i.text !== node?.text
      : true));
    setError(len?.length);
  }, [ value ]);

  const handleBlur = () => {
    setTargetItem(null);
  };
  const onSubmit = async () => {
    switch (type) {
    case 'dir':
      shellAction('mkdir', [ id ]);
      break;
    case 'file':
      shellAction('touch', [ id ]);
      break;
    case 'rename':
      shellAction('mv', [ node.id, id ]);
      fixData('rename', node.id, id);
      break;
    }
    if ([ 'dir', 'file' ].includes(type)) {
      let _ids = id.split('/');
      _ids.pop();
      initialOpen.push(_ids.join('/'));
      setInitialOpen([ ...initialOpen ]);
    }
    setTargetItem(null);
  };
  const handleKeyDown = (event) => {
    if (error) {
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      handleBlur();
    }
  };

  let title = '';
  switch (type) {
  case 'file':
    title = '新建文件';
    break;
  case 'dir':
    title = '新建目录';
    break;
  case 'rename':
    title = '重命名';
    break;
  case '删除':
    title = '删除';
    break;
  default:
    break;
  }
  return <Modal
    open
    title={title}
    width={300}
    height={400}
    onCancel={() => setTargetItem(null)}
    footer={null}
  >
<form
  onSubmit={(event) => {
    event.preventDefault();
  }}
  style={{
    position: 'relative',
    width: '100%'
  }}
>
      <label>
        <Input
          style={{
            maxWidth: '100%',
            border: `1px solid ${error
              ? 'red'
              : 'inherit'}`
          }}
          onBlur={handleBlur}
          maxLength={35}
          autoFocus={true}
          name="name"
          type="text"
          value={value}
          onInput={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      </label>
  {error
    ? (
      <div
        style={{
          display: 'block',
          width: '100%',
          color: 'red',
          fontSize: '12px',
          padding: '5px 0px',
          background: 'wheat',
          borderRadius: '3px',
          marginTop: '5px'
        }}
      >
          <span
            style={{
              padding: '10px'
            }}
          >
            {type === 'dir'
              ? '目录'
              : '文件'}已存在
          </span>
        </div>
    )
    : null}
    </form>
  </Modal>;
}

export default TreeEdit;