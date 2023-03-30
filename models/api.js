const fs = require("node:fs/promises");

exports.fetchApi = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`).then((data) => {
    const apiInfo = JSON.parse(data);
    return apiInfo;
  });
};
