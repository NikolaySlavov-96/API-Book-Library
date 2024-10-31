import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';
const SPECIFIC_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

/**
 * @returns date string in format 'YYYY-MM-DD'
*/
export const getCurrentDate = () => {
    return moment().format(DATE_FORMAT);
};

// Format the date in ISO 8601 format
export const generateDateForDB = () => {
    return moment().toISOString();
};

/**
 * @param count - count
 * @param type - 'day'
 * @returns date string in format 'YYYY-MM-DD'
*/
export const calculateRelativeDate = (count: number, type: 'day') => {
    const currentDate = moment();

    const newDate = currentDate.subtract(count, type);

    return newDate.format(DATE_FORMAT);
};