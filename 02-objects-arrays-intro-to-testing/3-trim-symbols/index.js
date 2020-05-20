/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === 0) return "";

    let repeatIndex = 1;

    for (let i = 0; i < string.length; i++) {

        if (string[i] === string[i-1]) {
          repeatIndex++;
        } else {
          repeatIndex = 1;
          continue;
        }
          
        if (repeatIndex > size) {
            string = string.slice(0, i) + string.slice(i + 1);
            i--;
            repeatIndex--;
        }
    }
  
    return string;
}
