const glob = require("glob");
module.exports = glob.sync("src/static/utils/**/*.js").map((file) => {
  return {
    input: file,
    output: {
      dir: __dirname + "/dist/assets/js",
      format: "cjs",
    },
  };
});
