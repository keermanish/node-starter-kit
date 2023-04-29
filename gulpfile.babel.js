import { series, watch, src, dest } from 'gulp';
import run from 'gulp-run';
import babel from 'gulp-babel';
import clean from 'gulp-clean';
import { exec } from 'child_process';

const path = {
  src: './src/**/*.js',
  dist: './dist'
}

function cleanBuild() {
  return src(`${path.dist}/**`, {read: false})
    .pipe(clean());
}

function build() {
  return src(path.src)
    .pipe(babel())
    .pipe(dest(path.dist))
}

function watchChanges() {
  watch(path.src, { ignoreInitial: false }, series(cleanBuild, build, restartDevServer));
}

function restartDevServer() {
  return run('pm2 restart ecosystem.config.js').exec();
}

// capture exit event
process.once('SIGINT', function() {
  console.log("caught interrupt signal");
  const pid = process.pid;

  exec('pm2 stop ecosystem.config.cjs', (err,stdout,stderr) => {
    setImmediate(() => {
      process.kill(pid, 'SIGINT');
    });
  });
});

exports.build = build;
exports.dev = series(cleanBuild, build, watchChanges);
exports.default = series(cleanBuild, build);
