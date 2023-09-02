export const isEmptyValue = (input: any) => {
  /**
   * input is considered empty value: falsy value (like null, undefined, '', except false and 0),
   * string with white space characters only, empty array, empty object
   */
  return (
    (!input && input !== false && input !== 0) ||
    ((input instanceof String || typeof input === 'string') && !input.trim()) ||
    (Array.isArray(input) && !input.length) ||
    (input instanceof Object && !Object.keys(input).length)
  );
};
