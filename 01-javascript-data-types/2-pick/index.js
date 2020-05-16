/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const picked = Object.entries(obj).filter((el) => {
        for (let field of [...fields]) {
            if (field === el[0]) {
                return true;
            }
        }
        return false;
    })

    return Object.fromEntries(picked);   
};
