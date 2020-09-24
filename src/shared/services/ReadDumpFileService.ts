import 'reflect-metadata';
import { injectable } from 'tsyringe';
import decompress from 'decompress';
import * as fs from 'fs';
import path from 'path';
import moveFile from 'move-file';
import chunk from 'chunk';

@injectable()
class ReadDumpFile {
  public async execute(): Promise<any[][]> {
    let archiveLines: any[] = [];
    const dumpFolder = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tmp',
      'newFile',
    );

    const dumpFolderFiles: any[] = await new Promise((resolve, reject) => {
      return fs.readdir(dumpFolder, (err, filenames) =>
        err != null ? reject(err) : resolve(filenames),
      );
    });

    process.chdir(dumpFolder);
    if (dumpFolderFiles.length !== 0) {
      await new Promise(resolve => {
        dumpFolderFiles.forEach(async (_, index) => {
          await decompress(
            dumpFolderFiles[index],
            path.resolve(dumpFolder, '..', 'extracted'),
          ).then();
          await moveFile(
            `${dumpFolder}/${dumpFolderFiles[index]}`,
            `${path.resolve(dumpFolder, '..', 'readedFile')}/${
              dumpFolderFiles[index]
            }.${Date.now()}`,
          );
          resolve();
        });
      });
    }

    const extractedDir = path.resolve(dumpFolder, '..', 'extracted');
    process.chdir(extractedDir);
    const extractedFolderFiles: any[] = await new Promise((resolve, reject) => {
      return fs.readdir(extractedDir, (err, filenames) =>
        err != null ? reject(err) : resolve(filenames),
      );
    });

    const chunkedData: any[][] = await new Promise((resolve, _) => {
      extractedFolderFiles.forEach(name => {
        archiveLines = fs.readFileSync(name).toString().trim().split('\n');
        fs.unlinkSync(name);
      });
      const archiveLinesChunked = chunk(archiveLines, 1000);
      return resolve(archiveLinesChunked);
    });
    return chunkedData;
  }
}

export default ReadDumpFile;
