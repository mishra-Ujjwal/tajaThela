// utils/stringUtils.js
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';             // handle empty or undefined
  return str.charAt(0).toUpperCase() + str.slice(1);
};