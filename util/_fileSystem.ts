import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PREFIX = '../';
const rootDirectoryPath = path.join(__dirname, '/', PREFIX);

const isDirectoryExisting = (directory) => {
    const fullDirectoryPath = PREFIX + directory;

    if (fs.existsSync(fullDirectoryPath)) {
        return true;
    }

    return false;
};

const initializeDirectory = (directory) => {
    const fullDirectoryPath = PREFIX + directory;
    fs.mkdirSync(fullDirectoryPath);
};

export const _createDirectoryPath = (directory, fileName) => {
    if (!isDirectoryExisting) {
        initializeDirectory(directory);
    }

    const fullDirectoryPath = rootDirectoryPath + directory + '/' + fileName;
    return fullDirectoryPath;
};

export const _unlinkFileFromSystem = async (directory, fileName) => {
    if (!isDirectoryExisting) {
        return false; // Directory don't exist
    }
    const fullDirectoryPath = rootDirectoryPath + directory + '/' + fileName;
    try {
        await fs.promises.unlink(fullDirectoryPath);
        return true;
    } catch (err) {
        return false;
    }
};