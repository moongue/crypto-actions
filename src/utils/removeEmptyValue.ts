import { isEmptyValue } from './isEmptyValue.ts';

export const removeEmptyValue = (obj: any) => {
  if (!(obj instanceof Object)) return {};
  Object.keys(obj).forEach((key) => isEmptyValue(obj[key]) && delete obj[key]);
  return obj;
};
