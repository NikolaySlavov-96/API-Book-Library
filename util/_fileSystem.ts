import fs from 'fs';
import path from 'path';

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

export const _unlinkFileFromSystem = (directory, fileName) => {
    if (!isDirectoryExisting) {
        return false; // Directory don't exist
    }
    const fullDirectoryPath = rootDirectoryPath + directory + '/' + fileName;
    fs.unlink(fullDirectoryPath, (err) => {
        if (err) {
            console.log("🚀 ~ _fileSystem ~ fs.unlink ~ err:", err);
            return false;
        }
        return true;
    });
};