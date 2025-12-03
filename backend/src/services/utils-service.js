/**
 * Group array items by a key function
 * @param {Array} array - Array to group
 * @param {Function} keyFn - Function that returns the grouping key
 * @returns {Map} Map of grouped items
 */
export function groupBy(array, keyFn) {
  return array.reduce((map, item) => {
    const key = keyFn(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(item);
    return map;
  }, new Map());
}
