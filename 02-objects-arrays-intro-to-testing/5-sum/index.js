/**
 * Sum - returns sum of arguments if they can be converted to a number
 * @param {number} n value
 * @returns {number | function}
 */
export function sum (n) {
    let result = n || 0;
    
    function repeat(x) {
     if(x) {
        result += x
        return repeat
     }
     return result;
    }
    
    repeat.toString = function() { 
       return result;
    }
    
    return repeat;
}

