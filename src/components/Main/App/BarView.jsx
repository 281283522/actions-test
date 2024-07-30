import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Input, Space, Dropdown } from 'antd';
import { TypeIcon } from '../TypeIcon/TypeIcon';
import styles from './BarView.module.css';
import { CloseOutlined } from '@ant-design/icons';
import { usePageContext } from './App';

const BarView = function () {
  const {
    barAr,
    setBarAr,
    active,
    setActive,
    activeFile,
    setActiveFile
  } =
    usePageContext();
  const [ boxId, setBoxId ] = useState(
    `boxId_${+new Date()}_${Math.floor(Math.random() * 10000000)}`
  );
  const boxRef = useRef(null);
  const targetDomRef = useRef(null);
  useEffect(() => {
    boxRef.current = document.getElementById(boxId);
    targetDomRef.current = document.getElementById(`barItem_${activeFile?.id}`);
    if (boxRef.current && targetDomRef.current) {
      const {
        width: pWidth,
        left: pLeft
      } =
        boxRef.current.getBoundingClientRect();
      const {
        width: cWidth,
        left: cLeft
      } =
        targetDomRef.current.getBoundingClientRect();
      const pCenter = pLeft + pWidth / 2;
      const cCenter = cLeft + cWidth / 2;
      boxRef.current.scrollLeft = boxRef.current.scrollLeft + cCenter - pCenter;
    }
  }, [ activeFile ]);

  return (
    <div
      className={styles.barBox}
      id={boxId}
    >
      {barAr.map((item, index) => {
        return (
          <Dropdown
            key={item.id}
            menu={{
              items: [
                {
                  key: 'close',
                  label: '关闭当前'
                },
                barAr?.length > 1 && {
                  key: 'closeOther',
                  label: '关闭其他'
                },
                index > 0 && {
                  key: 'closeLeft',
                  label: '关闭左侧'
                },
                index < barAr.length - 1 && {
                  key: 'closeRight',
                  label: '关闭右侧'
                },
                barAr.length > 1 && {
                  key: 'closeAll',
                  label: '关闭全部'
                }
              ].filter((item) => item),
              onClick: async ({
                key,
                domEvent
              }) => {
                domEvent.stopPropagation();
                domEvent.preventDefault();
                let ar = barAr;
                switch (key) {
                case 'close':
                  ar.splice(index, 1);
                  break;
                case 'closeOther':
                  ar = [ item ];
                  break;
                case 'closeLeft':
                  ar = ar.slice(index, ar.length);
                  break;
                case 'closeRight':
                  ar = ar.slice(0, index + 1);
                  break;
                case 'closeAll':
                  ar = [];
                  break;
                }
                setBarAr([ ...ar ]);
              }
            }}
            trigger={[ 'contextMenu' ]}
          >
            <div
              id={`barItem_${item?.id}`}
              className={`${styles.item} ${
                activeFile?.id === item.id
                  ? styles.active
                  : ''
              }`}
              onClick={() => {
                setActiveFile(item);
                setActive(item);
              }}
            >
            <TypeIcon item={item} />
              {item.text}
              <span
                className={styles.close}
                style={{
                  visibility: activeFile?.id === item.id
                    ? 'inherit'
                    : ''
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  barAr.splice(index, 1);
                  setBarAr([ ...barAr ]);
                }}
              >
              <CloseOutlined />
            </span>
          </div>
          </Dropdown>
        );
      })}
    </div>
  );
};

export default BarView;
