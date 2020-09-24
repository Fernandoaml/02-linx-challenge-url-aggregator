import * as fs from 'fs';
import path from 'path';

import AppError from '@shared/errors/AppErrors';
import ReadDumpFileService from './ReadDumpFileService';

let readDumpFileService: ReadDumpFileService;

async function verifyFolder(folder: any): Promise<any[]> {
  const dumpFolderFiles: any[] = await new Promise((resolve, reject) => {
    return fs.readdir(folder, (err, filenames) =>
      err != null ? reject(err) : resolve(filenames),
    );
  });
  return dumpFolderFiles;
}

describe('ReadDumpFileService', () => {
  beforeEach(() => {
    readDumpFileService = new ReadDumpFileService();
  });
  it('Should be able unzip, move files, make a file copy. Read and chunk the file in 1000 pieces', async () => {
    const dumpFolder = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tmp',
      'newFile',
    );
    await readDumpFileService.execute();
    const readNewFile = await verifyFolder(dumpFolder);
    const readedFile = await verifyFolder(
      path.resolve(dumpFolder, '..', 'readedFile'),
    );
    const readExtracted = await verifyFolder(
      path.resolve(dumpFolder, '..', 'extracted'),
    );
    expect(readNewFile.length).toBe(0);
    expect(readedFile.length).toBeGreaterThanOrEqual(1);
    expect(readExtracted.length).toBe(0);
  });
  it('should not be able to continue if the input-dump.tar.gz not exists on newFile folder', async () => {
    await expect(readDumpFileService.execute()).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
