(function(){
window.CreateGame = create;

function create(list, context, size, count, padding) {
  var now;
  var delta;
  var alive;
  var x;
  var y;
  var then = Date.now();
  var interval = 1000 / 12;
  var step = Math.floor(size / count);
  var rectSize = step - (padding * 2);
  var updatedList = [];
  var pause_ = false;
  var list = list;
  init();

  return {
    play: play,
    pause: pause,
    clear: clear,
    setFPS: setFPS
  };

  function setFPS(_fps) {
    interval = 1000 / _fps;
  }

  function play() {
    pause_ = false;
    gameLoop();
  }

  function pause() {
    pause_ = true;
  }

  function clear() {
    pause_ = true;
    context = undefined;
    list = undefined;
    updatedList = undefined;
  }

  function init() {
    var x = 0;
    var y = 0;
    var _count = count;
    for (; y < count; y++) {
      updatedList[y] = [];
      for(; x < count; x++) {
        updatedList[y][x] = list[y][x];
      }
    }
    gameLoop();
  }


  function gameLoop() {
    if (pause_ === false) {
      window.requestAnimationFrame(gameLoop);
    } else {
      return;
    }

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);

      context.clearRect(0, 0, size, size);

      for (y = 0; y < count; y++) {
        for (x = 0; x < count; x++) {
          if (list[y][x] === true) {
            context.fillRect(padding + (x * step), padding + (y * step), rectSize, rectSize);
          }

          neighbors = [
            list[y - 1] && list[y - 1][x],
            list[y + 1] && list[y + 1][x],
            list[y][x - 1],
            list[y][x + 1],
            list[y - 1] && list[y - 1][x - 1],
            list[y - 1] && list[y - 1][x + 1],
            list[y + 1] && list[y + 1][x - 1],
            list[y + 1] && list[y + 1][x + 1]
          ].filter(function (item) { if (item === true) {return true;} return false; });
          neighbors = neighbors.length;

          alive = list[y][x];
          if (alive === true) {
            if (neighbors < 2 || neighbors > 3) {
              alive = false;
            }
          } else {
            if (neighbors === 3) {
              alive = true;
            }
          }

          updatedList[y][x] = alive;
        }
      }

      for (y = 0; y < count; y++) {
        for (x = 0; x < count; x++) {
          list[y][x] = updatedList[y][x];
        }
      }

    }
  }
}
}());
