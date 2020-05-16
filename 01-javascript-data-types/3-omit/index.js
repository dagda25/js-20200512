/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    const picked = Object.entries(obj).filter((el) => {
        for (let field of [...fields]) {
            if (field === el[0]) {
                return false;
            }
        }
        return true;
    })
      
    return Object.fromEntries(picked);
};
