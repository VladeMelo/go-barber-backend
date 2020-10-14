import path from 'path'; // caminho que funciona para qualquer sistema operacional
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(
  __dirname /* diretório que a pasta está, então terei o caminho inteiro do meu pc até a pasta config */,
  '..' /* volto uma pasta */,
  '..' /* volto outra pasta */,
  'tmp' /* jogo os arquivos para pasta tmp */,
);

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: 'app-gobarber--bucket',
    },
  } /* armazena as imagens que o usuário fez upload dentro da estrutura do app('disco da máquina') */,
} as IUploadConfig;
