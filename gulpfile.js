// Adiciona os modulos instalados
const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

// Funçao para compilar o SASS e adicionar os prefixos
function compilaSass() {
  return gulp
    .src("dist/css/scss/**/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulp.dest("dist/css/"))
    .pipe(browserSync.stream());
}

// Tarefa de gulp para a função de SASS
// gulp.task('sass', function(done){
//   compilaSass();
//   done();
// });
exports.compilaSass = compilaSass;

// Função para juntar o JS
function gulpJS() {
  return gulp
    .src("dist/js/main/**/*.js")
    .pipe(concat("app.js"))
    .pipe(
      babel({
        presets: ["env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/"))
    .pipe(browserSync.stream());
}

// gulp.task('mainjs', gulpJS);
exports.gulpJS = gulpJS;

// Função para iniciar o browser
function browser() {
  browserSync.init({
    /*************************\
    * Padrão sem ser WP
    \*************************/

    // server: {
    //   baseDir: "./",
    // },

    /*************************\
    * Se Wordpress - Pegar a URL do site 
    \*************************/
    proxy: "localhost/DraTania",
  });
}

// Tarefa para iniciar o browser-sync
exports.browser = browser;

// Função de watch do Gulp
function watch() {
  gulp.watch("dist/css/scss/**/*.scss", compilaSass);
  gulp.watch("dist/js/main/**/*.js", gulpJS);
  gulp
    .watch(["*.php", "./**/*.php", "*.html"])
    .on("change", browserSync.reload);
}

// Inicia a tarefa de watch
exports.watch = watch;

// Tarefa padrão do Gulp, que inicia o watch e o browser-sync
exports.default = gulp.parallel(watch, browser, compilaSass, gulpJS);
