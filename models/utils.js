const format = require("pg-format");
const db = require("../db/connection.js");

exports.objectHasRequiredKeys = (object, correctKeys = []) => {
  const objectKeys = Object.keys(object);
  if (
    !correctKeys.every((correctKey) => objectKeys.includes(correctKey)) ||
    !objectKeys.every((objectKey) => correctKeys.includes(objectKey))
  ) {
    return false;
  }
  return true;
};
