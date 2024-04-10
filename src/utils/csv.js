const fs = require("fs");

const writeCSV = async (path, data) => {
  await fs.writeFileSync(path, data, { flag: "a+", columns: true });
  return { message: "file has writen" };
};

module.exports = { writeCSV };
