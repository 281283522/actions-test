export const getDirTreeByCtx = async (webCtx, path = '/') => {
  let pathAr = [];
  let ar = await webCtx.fs.readdir(path, {
    withFileTypes: true
  });
  for (let index = 0; index < ar.length; index++) {
    const element = ar[ index ];
    if (!(element.name === 'node_modules' && element.isDirectory())) {
      const _path = path === '/'
        ? `${element.name}`
        : `${path}/${element.name}`;
      let item = {
        name: element.name,
        title: element.name,
        path: _path,
        isDir: element.isDirectory(),
        isFile: element.isFile()
      };
      pathAr.push(item);
      if (element.isDirectory()) {
        let children = await getDirTreeByCtx(webCtx, _path);
        pathAr.push(...children);
      }
    }
  }
  return pathAr;
};

export const readDirectoryContents = async function (
  directoryHandle,
  path = '/'
) {
  let ar = [];
  try {
    for await (const entry of directoryHandle.values()) {
      const {
        kind,
        name
      } = entry;
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        const fileType = file.type;
        let fileContents = await file.arrayBuffer();
        ar.push({
          name,
          path: path === '/'
            ? `${name}`
            : `${path}/${name}`,
          isDir: false,
          isFile: true,
          contents: fileContents
        });
      } else if (entry.kind === 'directory') {
        if (name !== 'node_modules') {
          ar.push({
            name,
            path: path === '/'
              ? `${name}`
              : `${path}/${name}`,
            isDir: true,
            isFile: false
          });
          let list = await readDirectoryContents(entry, path === '/'
            ? `${name}`
            : `${path}/${name}`);
          ar.push(...list);
        }
      }
    }
    return ar;
  } catch (error) {
    console.error(error);
  }
};
export const selectDirectory = async () => {
  try {
    const directoryHandle = await window.showDirectoryPicker();
    const files = await readDirectoryContents(directoryHandle);
    for (let index = 0; index < files.length; index++) {
      const element = files[ index ];
      if (element.isDir) {
        await webCtx.fs.mkdir(element.path, { recursive: true });
      } else {
        await webCtx.fs.writeFile(element.path, new Uint8Array(element.contents));
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const getMimeType = (name) => {
  let mime = 'data:image/png;base64';
  if (/\.(jpg|jpeg)$/gi.test(name)) {
    mime = 'data:image/jpeg;base64';
  }
  if (/\.(gif)$/gi.test(name)) {
    mime = 'data:image/gif;base64';
  }
  if (/\.(png)$/gi.test(name)) {
    mime = 'data:image/png;base64';
  }
  return mime;
};

function base64ToUint8Array (base64String) {
  try {
    const binaryString = atob(base64String);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uint8Array[ i ] = binaryString.charCodeAt(i);
    }
    return uint8Array;
  } catch (e) {
    console.error(e);
    return '';
  }
}

export const formatServerData = (array) => {
  return array.map((item) => {
    const {
      path,
      isFile,
      contents
    } = item;
    if (isFile && supportImgFile(path)) {
      let mime = getMimeType(path);
      item.contents = contents
        ? base64ToUint8Array(contents.replace(`${mime},`, ''))
        : contents;
      return item;
    } else {
      return item;
    }
  });
};

export const supportImgFile = (name) => {
// |gif
  return /\.(jpg|jpeg|png|gif)$/gi.test(name);
};

export const getFilesArrByCtx = async (webCtx, path = '/', isSave) => {
  let files = [];
  let ar = await webCtx.fs.readdir(path, {
    withFileTypes: true
  });
  for (let index = 0; index < ar.length; index++) {
    const element = ar[ index ];
    if (!(element.name === 'node_modules' && element.isDirectory())) {
      const _path = path === '/'
        ? `${element.name}`
        : `${path}/${element.name}`;
      let item = {
        path: _path,
        isDir: element.isDirectory(),
        isFile: element.isFile(),
        name: element.name
      };
      if (element.isFile()) {
        if (isSave) {
          if (supportImgFile(element.name)) {
            let base64 = await webCtx.fs.readFile(_path, 'base64');
            let mime = getMimeType(element.name);
            item.contents = `${mime},${base64}`;
          } else {
            item.contents = await webCtx.fs.readFile(_path, 'utf-8');
          }
        } else {
          item.contents = await webCtx.fs.readFile(_path, 'utf-8');
        }
      }
      files.push(item);
      if (element.isDirectory()) {
        let children = await getFilesArrByCtx(webCtx, _path, isSave);
        files.push(...children);
      }
    }
  }
  return files;
};

export const writeDataToFile = async (webCtx, files) => {
  if (webCtx && files.length > 0) {
    for (let index = 0; index < files.length; index++) {
      const element = files[ index ];
      let path = element.path;
      // path = `/root/${path}`;
      if (element.isDir) {
        await webCtx.fs.mkdir(path, { recursive: true });
      } else {
        await webCtx.fs.writeFile(path, element.contents);
      }
    }
  }
};