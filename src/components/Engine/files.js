// 文件模型参考
export const files = {
  '.eslintrc.cjs': {
    file: {
      contents:
        'module.exports = {\n  root: true,\n  env: { browser: true, es2020: true },\n  extends: [\n    \'eslint:recommended\',\n    \'plugin:react/recommended\',\n    \'plugin:react/jsx-runtime\',\n    \'plugin:react-hooks/recommended\',\n  ],\n  ignorePatterns: [\'dist\', \'.eslintrc.cjs\'],\n  parserOptions: { ecmaVersion: \'latest\', sourceType: \'module\' },\n  settings: { react: { version: \'18.2\' } },\n  plugins: [\'react-refresh\'],\n  rules: {\n    \'react-refresh/only-export-components\': [\n      \'warn\',\n      { allowConstantExport: true },\n    ],\n  },\n}\n'
    }
  },
  '.gitignore': {
    file: {
      contents:
        '# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\nnode_modules\ndist\ndist-ssr\n*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n'
    }
  },
  'index.html': {
    file: {
      contents:
        '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Vite + React</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"></script>\n  </body>\n</html>\n'
    }
  },
  'package.json': {
    file: {
      contents:
        '{\n  "name": "vite-react",\n  "private": true,\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "devDependencies": {\n    "@types/react": "^18.2.43",\n    "@types/react-dom": "^18.2.17",\n    "@vitejs/plugin-react": "^4.2.1",\n    "eslint": "^8.55.0",\n    "eslint-plugin-react": "^7.33.2",\n    "eslint-plugin-react-hooks": "^4.6.0",\n    "eslint-plugin-react-refresh": "^0.4.5",\n    "vite": "^5.0.8"\n  }\n}\n'
    }
  },
  public: { directory: {} },
  'README.md': {
    file: {
      contents:
        '# React + Vite\n\nThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.\n\nCurrently, two official plugins are available:\n\n- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh\n- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh\n'
    }
  },
  src: {
    directory: {
      'App.css': {
        file: {
          contents:
            '#root {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 2rem;\n  text-align: center;\n}\n\n.logo {\n  height: 6em;\n  padding: 1.5em;\n  will-change: filter;\n  transition: filter 300ms;\n}\n.logo:hover {\n  filter: drop-shadow(0 0 2em #646cffaa);\n}\n.logo.react:hover {\n  filter: drop-shadow(0 0 2em #61dafbaa);\n}\n\n@keyframes logo-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  a:nth-of-type(2) .logo {\n    animation: logo-spin infinite 20s linear;\n  }\n}\n\n.card {\n  padding: 2em;\n}\n\n.read-the-docs {\n  color: #888;\n}\n'
        }
      },
      'App.jsx': {
        file: {
          contents:
            'import { useState } from \'react\'\nimport \'./App.css\'\n\nfunction App() {\n  const [count, setCount] = useState(0)\n\n  return (\n    <>\n      <h1>Vite + React + test</h1>\n      <div className="card">\n        <button onClick={() => setCount((count) => count + 1)}>\n          count is {count}\n        </button>\n        <p>\n          Edit <code>src/App.jsx</code> and save to test HMR\n        </p>\n      </div>\n      <p className="read-the-docs">\n        Click on the Vite and React logos to learn more\n      </p>\n    </>\n  )\n}\n\nexport default App\n'
        }
      },
      'index.css': {
        file: {
          contents:
            ':root {\n  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  font-weight: 400;\n\n  color-scheme: light dark;\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\na {\n  font-weight: 500;\n  color: #646cff;\n  text-decoration: inherit;\n}\na:hover {\n  color: #535bf2;\n}\n\nbody {\n  margin: 0;\n  display: flex;\n  place-items: center;\n  min-width: 320px;\n  min-height: 100vh;\n}\n\nh1 {\n  font-size: 3.2em;\n  line-height: 1.1;\n}\n\nbutton {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.6em 1.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: #1a1a1a;\n  cursor: pointer;\n  transition: border-color 0.25s;\n}\nbutton:hover {\n  border-color: #646cff;\n}\nbutton:focus,\nbutton:focus-visible {\n  outline: 4px auto -webkit-focus-ring-color;\n}\n\n@media (prefers-color-scheme: light) {\n  :root {\n    color: #213547;\n    background-color: #ffffff;\n  }\n  a:hover {\n    color: #747bff;\n  }\n  button {\n    background-color: #f9f9f9;\n  }\n}\n'
        }
      },
      'main.jsx': {
        file: {
          contents:
            'import React from \'react\'\nimport ReactDOM from \'react-dom/client\'\nimport App from \'./App.jsx\'\nimport \'./index.css\'\n\nReactDOM.createRoot(document.getElementById(\'root\')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n)\n'
        }
      }
    }
  },
  'vite.config.js': {
    file: {
      contents:
        'import { defineConfig } from \'vite\'\nimport react from \'@vitejs/plugin-react\'\n\n// https://vitejs.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n})\n'
    }
  }
};
