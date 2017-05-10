(function() {


// globals

var fps = 6; // frames per second
var padding = 0; //cell padding

var rows = 100;
var canvasSize = 1000;
var windowWidth;
var windowHeight;

var gridCanvas;
var gameCanvas;
var pointerCanvas;
var pointerContext;
var gridContext;
var gameContext
var container;
var frameRateSlider;
var frameRateLabel;
var brushSelection;

var gameState = 'stop';

var currentGame;
var preList;
var factorLevels;
var select;
var lastFactor;
var offsetX;
var offsetY;
var currentBrush;
var isPointer = false;

var isMouseDown = false;


// init app
window.onload = function () {
  gridCanvas = document.getElementById("gridCanvas");
  gameCanvas = document.getElementById("gameCanvas");
  pointerCanvas = document.getElementById("pointerCanvas");
  container = document.getElementById("container");
  frameRateSlider = document.getElementById("frameRateSlider");
  frameRateLabel = document.getElementById("frameRateLabel");
  frameRateSlider.defaultValue = fps;
  frameRateSlider.value = fps;

  frameRateSlider.onmousemove = changeFPS;

  gridContext = gridCanvas.getContext("2d");
  gameContext = gameCanvas.getContext("2d");
  pointerContext = pointerCanvas.getContext("2d");

  select = document.getElementById('rangeControl');
  select.onchange = selectChange;

  getGridSize();
  initGrid();
  initList();
  drawGrid();

  brushSelection = document.getElementById("brushSelection");
  brushSelection.onchange = brushChange;
  createBrushOptions();
  brushSelection.value = 'point';
  currentBrush = brushes.point;
  drawPointer();

  offsetX = (window.innerWidth - canvasSize) / 2;
  offsetY = 62;

  document.getElementById("startButton")
    .onclick = function () { setState('play'); }
  document.getElementById("pauseButton")
    .onclick = function () { setState('pause'); }
  document.getElementById("clearButton")
    .onclick = function () { setState('clear'); }
  document.getElementById("clearButton")
    .onclick = function () { setState('clear'); }
  document.getElementById("randomButton")
    .onclick = createRandomList;


  window.onmousedown = function (e) {
    isMouseDown = true;

    drawOnGrid(e);
  };
  window.onmouseup = function () {
    isMouseDown = false;
  };
  window.onmousemove = drawOnGrid;

  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
};

function createBrushOptions () {
  for(var brush in brushes) {
    var opt = document.createElement('option');
    opt.value = brush;
    opt.innerHTML = brush;
    brushSelection.appendChild(opt);
  }

  brushSelection.value = lastFactor;
}

function brushChange () {
  currentBrush = brushes[brushSelection.value];
  drawPointer();
}

function drawPointer () {
  pointerCanvas.width = pointerCanvas.width;
  var brush = currentBrush;

  for (var i = 0; i < brush.length; i += 2) {
    pointerContext.fillRect(brush[i] * lastFactor, brush[i+1] * lastFactor, lastFactor, lastFactor);
  }
}


function getGridSize () {
  var width = window.innerWidth;
  var height = window.innerHeight - 100;

  if (height < width) {
    canvasSize = height - (height % 100);
  } else {
    canvasSize = width - (width % 100);
  }
}

function initGrid () {
  container.style.width = canvasSize + 'px';
  container.style.height = canvasSize + 'px';

  gridCanvas.style.width = canvasSize + 'px';
  gridCanvas.style.height = canvasSize + 'px';
  gridCanvas.width = canvasSize;
  gridCanvas.height = canvasSize;

  gameCanvas.style.width = canvasSize + 'px';
  gameCanvas.style.height = canvasSize + 'px';
  gameCanvas.width = canvasSize;
  gameCanvas.height = canvasSize;
}

function initList () {
  factorLevels = getFactors(canvasSize);
  lastFactor = getBestResolution(factorLevels);
  rows = canvasSize / lastFactor;
  preList = createList(rows, rows);
  creatSizeRangeControl();
}

function creatSizeRangeControl() {
  for (var i = 0; i < factorLevels.length; i++){
    var opt = document.createElement('option');
    opt.value = factorLevels[i];
    opt.innerHTML = factorLevels[i];
    select.appendChild(opt);
  }

  select.value = lastFactor;
}

function selectChange () {
  if (currentGame === undefined) {
    lastFactor = select.value;
    rows = canvasSize / lastFactor;
    preList = createList(rows, rows);
    drawGrid();
    drawPointer();
  } else {
    select.value = lastFactor;
  }
};

function createRandomList () {
  if (currentGame !== undefined) { return; }

  var i;
  var j;
  preList = [];

  for (i = 0; i < rows; i++) {
    preList[i] = [];

    for (j = 0; j < rows; j++) {
      preList[i][j] = Math.random() > 0.4;
    }
  }

  drawPreList();
}

function getFactors (num) {
  var factors = [];

  for (i = 2; i < num; i++) {
    if (num % i == 0 && (canvasSize / i) > 10) {
      factors.push(i);
    }
  }

  return factors;
}

function getBestResolution (factors) {
  var last = 0;

  // i might want to calulate these number
  var goal = 10;

  for (var i = 0; i < factors.length; i++) {
    if (Math.abs(factors[i] - goal) < Math.abs(last - goal)) {
      last = factors[i];
    }
  }

  return last;
}


function setState (state) {
  if (currentGame === undefined && state === 'play') {
    currentGame = createGame(preList);
    gameState = 'play';
  } else if (state === 'pause' && gameState != 'pause') {
    currentGame.pause();
    gameState = 'pause';
  } else if (state === 'clear') {
    currentGame.clear();
    currentGame = undefined;
    preList = createList(rows, rows);
    drawPreList();
    gameState = 'clear';
  } else if (state === 'play' && gameState != 'play') {
    currentGame.play();
    gameState = 'play';
  }
}

function changeFPS () {
  fps = frameRateSlider.value;
  frameRateLabel.innerHTML = fps;

  if (currentGame !== undefined) currentGame.setFPS(fps);
};

function drawOnGrid (e) {
  var y;
  var x;
  var i;

  if (currentGame === undefined && isMouseDown === true && e.pageX >= offsetX && e.pageX <= (windowWidth - offsetX) && e.pageY >= 62 && e.pageY <= windowHeight - (windowHeight - 62 - canvasSize)) {
    var posx = Math.floor(((e.pageX + (lastFactor / 2)) - offsetX) / lastFactor);
    var posy = Math.floor(((e.pageY - 2) - offsetY) / lastFactor);
    if (posx >= rows-1) { posx = rows - 1 }
    if (posy >= rows-1) { posy = rows - 1 }

    if (posx < 0) { posx = 0 }
    if (posy < 0) { posy = 0 }


    for(i = 0; i < currentBrush.length; i += 2) {
      preList[posy + currentBrush[i +1]][posx + currentBrush[i]] = true;
    }

    drawPreList();
  }

  pointerCanvas.style.left = e.pageX + 'px';
  pointerCanvas.style.top = e.pageY + 'px';

  if (e.pageX >= offsetX && e.pageX <= (windowWidth - offsetX) && e.pageY >= 62 && e.pageY <= windowHeight - (windowHeight - 62 - canvasSize)) {
    if (isPointer === false) {
      isPointer = true;
      pointerCanvas.style.display = 'block';
      gridCanvas.style.cursor = 'none';
      gameCanvas.style.cursor = 'none';
      container.style.cursor = 'none';
    }
  } else if (isPointer === true) {
    isPointer = false;
    pointerCanvas.style.display = 'none';
    gridCanvas.style.cursor = 'default';
    gameCanvas.style.cursor = 'default';
    container.style.cursor = 'default';
  }
}





// --- Draw List ----

function drawPreList () {
  var step = Math.floor(canvasSize / rows);
  var rectSize = step - (padding * 2);

  gameContext.clearRect(0, 0, canvasSize, canvasSize);

  for(y = 0; y < rows; y++) {
    for (x = 0; x < rows; x++) {
      if (preList[y][x] === true) {
        gameContext.fillRect(padding + (x * step), padding + (y * step), rectSize, rectSize);
      }
    }
  }
}







function createGame (list) {
  var now;
  var delta;
  var then = Date.now();
  var interval = 1000 / fps;

  var size = canvasSize;
  var count = rows;
  var step = Math.floor(size / count);
  var rectSize = step - (padding * 2);

  var alive;
  var x;
  var y;
  var updatedList = [];
  var context = gameContext;
  var pause_ = false;
  var list = list;

  var service = {
    play: play,
    pause: pause,
    clear: clear,
    setFPS: setFPS
  };

  init();

  return service;



  function setFPS (_fps) {
    interval = 1000 / _fps;
  }

  function play () {
    pause_ = false;
    gameLoop();
  }

  function pause () {
    pause_ = true;
  }

  function clear () {
    pause_ = true;
    context = undefined;
    list = undefined;
    updatedList = undefined;
  }

  function init () {
    for(y = 0; y < count; y++) {
      updatedList[y] = [];
      for(x = 0; x < count; x++) {
        updatedList[y][x] = list[y][x];
      }
    }

    gameLoop();
  }


  function gameLoop () {
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

      for(y = 0; y < count; y++) {
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

      for(y = 0; y < count; y++) {
        for(x = 0; x < count; x++) {
          list[y][x] = updatedList[y][x];
        }
      }

    }
  }
}


function docReady () {
  var list = createList(squareRoot, squareRoot);
  drawGrid(gridContext, squareRoot, squareRoot);
  startGame(createRandomList(squareRoot, squareRoot), gameContext, squareRoot, squareRoot);
}



// --- canvas grid ------------------------------

function drawGrid () {
  var step = Math.floor(canvasSize / rows);

  gridContext.clearRect(0, 0, canvasSize, canvasSize);

  gridContext.beginPath();
  for (var x = 0.5; x < canvasSize; x += step) {
    gridContext.moveTo(x, 0);
    gridContext.lineTo(x, canvasSize);
  }

  gridContext.moveTo(canvasSize - 0.5, 0);
  gridContext.lineTo(canvasSize - 0.5, canvasSize);

  for (var y = 0.5; y < canvasSize; y += step) {
    gridContext.moveTo(0, y);
    gridContext.lineTo(canvasSize, y);
  }

  gridContext.moveTo(0, canvasSize - 0.5);
  gridContext.lineTo(canvasSize, canvasSize - 0.5);

  gridContext.strokeStyle = "#DDD";
  gridContext.stroke();

}


//--- Regular list ------------------------------

function createList (rows, columns) {
  var i;
  var j;
  var list = [];

  for (i = 0; i < columns; i++) {
    list[i] = [];

    for (j = 0; j < rows; j++) {
      list[i][j] = false;
    }
  }

  return list;
}






// ----- Bushes ------

var brushes = {};

brushes.point = [0,0];

brushes.smallSquare =[
  0,0, 0,1,
  1,0, 1,1
];

brushes.mediumSquare = [
  0,0, 0,1, 0,2,
  1,0, 1,1, 1,2,
  0,2, 1,2, 2,2
];

brushes.largeSquare = [
  0,0, 0,1, 0,2, 0,3, 0,4, 0,5,
  1,0, 1,1, 1,2, 1,3, 1,4, 1,5,
  2,0, 2,1, 2,2, 2,3, 2,4, 2,5,
  3,0, 3,1, 3,2, 3,3, 3,4, 3,5,
  4,0, 4,1, 4,2, 4,3, 4,4, 4,5,
  5,0, 5,1, 5,2, 5,3, 5,4, 5,5
];

brushes.smallCircle = [
  0,2, 0,3,
  1,1, 1,2, 1,3, 1,4,
  2,0, 2,1, 2,2, 2,3, 2,4, 2,5,
  3,0, 3,1, 3,2, 3,3, 3,4, 3,5,
  4,1, 4,2, 4,3, 4,4,
  5,2, 5,3
];

brushes.bigCircle = [
  0,2, 0,3, 0,4, 0,5,
  1,1, 1,2, 1,3, 1,4, 1,5, 1,6,
  2,0, 2,1, 2,2, 2,3, 2,4, 2,5, 2,6, 2,7,
  3,0, 3,1, 3,2, 3,3, 3,4, 3,5, 3,6, 3,7,
  4,0, 4,1, 4,2, 4,3, 4,4, 4,5, 4,6, 4,7,
  5,0, 5,1, 5,2, 5,3, 5,4, 5,5, 5,6, 5,7,
  6,1, 6,2, 6,3, 6,4, 6,5, 6,6,
  7,2, 7,3, 7,4, 7,5
];


brushes.glider = [
  1,0,
  2,1,
  0,2, 1,2, 2,2
];

brushes.reverseGlider = [
  1,0,
  0,1,
  0,2, 1,2, 2,2
];

brushes.smallExploder = [
  1,0,
  0,1, 1,1, 2,1,
  0,2, 2,2,
  1,3
];

brushes.exploader = [
  0,0, 2,0, 4,0,
  0,1, 4,1,
  0,2, 4,2,
  0,3, 4,3,
  0,4, 2,4, 4,4
];

brushes.tenRow = [
  0,0, 1,0, 2,0, 3,0, 4,0, 5,0, 6,0, 7,0, 8,0, 9,0
];

brushes.spceship = [
  1,0, 2,0, 3,0, 4,0,
  0,1, 4,1,
  4,2,
  0,3, 3,3
];

brushes.reverseSpceship = [
  0,0, 1,0, 2,0, 3,0,
  0,1, 4,1,
  0,2,
  1,3, 4,3
];

brushes.tumbler = [
  1,0, 2,0, 4,0, 5,0,
  1,1, 2,1, 4,1, 5,1,
  2,2, 4,2,
  0,3, 2,3, 4,3, 6,3,
  0,4, 2,4, 4,4, 6,4,
  0,5, 1,5, 5,5, 6,5
];

brushes.GospelGliderGun = [
  24,0,
  22,1, 24,1,
  12,2, 13,2, 20,2, 21,2, 34,2, 35,2,
  11,3, 15,3, 20,3, 21,3, 34,3, 35,3,
  0,4, 1,4, 10,4, 16,4, 20,4, 21,4,
  0,5, 1,5, 10,5, 14,5, 16,5, 17,5, 22,5, 24,5,
  10,6, 16,6, 24,6,
  11,7, 15,7,
  12,8, 13,8
];



}());
