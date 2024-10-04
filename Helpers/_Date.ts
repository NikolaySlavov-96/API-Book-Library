import moment from 'moment';


const DATE_FORMAT = 'YYYY-MM-DD';
/**
 * @returns date string in format 'YYYY-MM-DD'
 */
export const getCurrentDate = () => {
    return moment().format(DATE_FORMAT);
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