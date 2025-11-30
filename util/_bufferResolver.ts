export const normalizeInputData = (data): string => {
    const dataString = Buffer.isBuffer(data) ? data.toString('utf-8') : data;
    return dataString;
}