const { src, dest, watch, series, task, parallel } = require("gulp");
const twig = require("gulp-twig");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass")(require("sass"));
const shell = require("gulp-shell");
const terser = require("gulp-terser");
const browserSync = require("browser-sync").create();

// ----compile html---- //
task("twig", () => {
  return src("src/views/pages/**/*.twig")
    .pipe(twig())
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(dest("dist/pages"));
});

// ----compile sass---- //
// local
task("sass-local", () => {
  return src("src/views/pages/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(dest("dist/pages"));
});
// global
task("sass-global", () => {
  return src("src/static/utils/styles/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(dest("dist/assets/css"));
});
// common
task("sass", series("sass-local", "sass-global"));

// ----compile javascript---- //
// local
task("javascript-local", () => {
  return src("src/views/pages/**/*.js")
    .pipe(terser({ compress: true, mangle: true }))
    .pipe(dest("dist/pages"));
});
// global
task("javascript-global", shell.task("npx rollup -c"));
//common
task("javascript", series("javascript-local", "javascript-global"));

// ----clean---- //
task("clean", shell.task("npx rimraf dist"));

// watch
browserSync.init({
  server: {
    baseDir: "./dist",
    
  },
});

// ----commands---- //
module.exports.sass = series("sass");
module.exports.javascript = series("javascript");
module.exports.twig = series("twig");
module.exports.serve = series("clean", "twig", "sass", "javascript");
