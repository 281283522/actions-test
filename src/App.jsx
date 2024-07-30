import React, { useEffect } from 'react';
import Engine from '~/components/Engine';
import { ConfigProvider } from 'antd';
import zh from 'antd/locale/zh_CN';

function App(props) {
  document.documentElement.style.setProperty('--color-primary', '#4096ff');
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'PingFangSC-Regular',
          colorPrimary: '#4096ff'
        }
      }}
      locale={zh}
    >
      <Engine {...props} />
    </ConfigProvider>
  );
}

export default App;
