(function(){
// globals
var brushes = window.brushes;
var CreateGame = window.CreateGame;

// default values
var fps = 12; // frames per second
var padding = 0; //cell padding
var rows = 100;
var canvasSize = 1000;
var isPointer = false;
var isMouseDown = false;
var gameState = 'stop';

var gridCanvas, gameCanvas, pointerCanvas, container, frameRateSlider, frameRateLabel, brushSelection, select, startButton, pauseButton, clearButton, randomButton;
var gridContext, gameContext, pointerContext;
var offsetX, offsetY, factorLevels, lastFactor, rows, preList, windowWidth, windowHeight, currentGame, currentBrush;

window.onload = function () {
  setElements();
  getGridSize();
  createBrushOptions();
  defaultValues();
  initGrid();
  initList();
  drawGrid();
  drawPointer();
  initEvents();
};


function setElements() {
  gridCanvas = document.querySelector('#gridCanvas');
  gameCanvas = document.querySelector('#gameCanvas');
  pointerCanvas = document.querySelector('#pointerCanvas');
  container = document.querySelector('#container');
  frameRateLabel = document.querySelector('#frameRateLabel');
  frameRateSlider = document.querySelector('#frameRateSlider');
  select = document.querySelector('#rangeControl');
  startButton = document.querySelector('#startButton');
  pauseButton = document.querySelector('#pauseButton');
  clearButton = document.querySelector('#clearButton');
  randomButton = document.querySelector('#randomButton');
  brushSelection = document.querySelector('#brushSelection');
  gridContext = gridCanvas.getContext("2d");
  gameContext = gameCanvas.getContext("2d");
  pointerContext = pointerCanvas.getContext("2d");
}

function getGridSize() {
  var width = window.innerWidth;
  var height = window.innerHeight - 40;
  if (height < width) {
    canvasSize = height - (height % 100);
  } else {
    canvasSize = width - (width % 100);
  }
}

function defaultValues() {
  frameRateSlider.defaultValue = fps;
  frameRateSlider.value = fps;
  brushSelection.value = 'point';
  offsetX = (window.innerWidth - canvasSize) / 2;
  offsetY = 62;
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  currentBrush = brushes.point;
}

function initGrid() {
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

function initList() {
  factorLevels = getFactors(canvasSize);
  lastFactor = getBestResolution(factorLevels);
  rows = canvasSize / lastFactor;
  preList = createList(rows, rows);
  creatSizeRangeControl();
}

function creatSizeRangeControl() {
  var i = 0;
  var length = factorLevels.length;
  for (;i < length; i++) {
    var opt = document.createElement('option');
    opt.value = factorLevels[i];
    opt.innerHTML = factorLevels[i];
    select.appendChild(opt);
  }
  select.value = lastFactor;
}

function initEvents() {
  frameRateSlider.addEventListener('mousemove', changeFPS);
  select.addEventListener('change', selectChange);
  brushSelection.addEventListener('change', brushChange);
  startButton.addEventListener('click', function () {
    setState('play');
  });
  pauseButton.addEventListener('click', function () {
    setState('pause');
  });
  clearButton.addEventListener('click', function () {
    setState('clear');
  });
  randomButton.addEventListener('click', createRandomList);
  window.addEventListener('mousedown', function (e) {
    isMouseDown = true;
    drawOnGrid(e);
  });
  window.addEventListener('mouseup', function (e) {
    isMouseDown = false;
  });
  window.addEventListener('mousemove', drawOnGrid);
}


function drawGrid() {
  var x = 0.5;
  var step = Math.floor(canvasSize / rows);

  gridContext.clearRect(0, 0, canvasSize, canvasSize);
  gridContext.beginPath();

  for (;x < canvasSize; x += step) {
    gridContext.moveTo(x, 0);
    gridContext.lineTo(x, canvasSize);
  }

  gridContext.moveTo(canvasSize - 0.5, 0);
  gridContext.lineTo(canvasSize - 0.5, canvasSize);

  x = 0.5;
  for (;x < canvasSize; x += step) {
    gridContext.moveTo(0, x);
    gridContext.lineTo(canvasSize, x);
  }

  gridContext.moveTo(0, canvasSize - 0.5);
  gridContext.lineTo(canvasSize, canvasSize - 0.5);
  gridContext.strokeStyle = "#DDD";
  gridContext.stroke();
}

function brushChange() {
  currentBrush = brushes[brushSelection.value];
  drawPointer();
}

function drawPointer() {
  pointerCanvas.width = pointerCanvas.width;
  var brush = currentBrush;
  var i = 0;
  var length = brush.length;
  for (;i < length; i+=2) {
    pointerContext.fillRect(brush[i] * lastFactor, brush[i+1] * lastFactor, lastFactor, lastFactor);
  }
}

function selectChange() {
  if (currentGame === undefined) {
    lastFactor = select.value;
    rows = canvasSize / lastFactor;
    preList = createList(rows, rows);
    drawGrid();
    drawPointer();
  } else {
    select.value = lastFactor;
  }
}

function createList(rows, columns) {
  var i = 0;
  var j = 0;
  var list = [];
  for (;i < columns; i++) {
    list[i] = [];
    for (;j < rows; j++) {
      list[i][j] = false;
    }
  }
  return list;
}

function changeFPS () {
  fps = frameRateSlider.value;
  frameRateLabel.innerHTML = fps;
  if (currentGame !== undefined) { currentGame.setFPS(fps); }
}

function setState(state) {
  if (currentGame === undefined && state === 'play') {
    currentGame = CreateGame(preList, gameContext, canvasSize, rows, padding);
    currentGame.setFPS(fps);
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

function drawPreList() {
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


function createRandomList() {
  if (currentGame !== undefined) { return; }
  var _rows = rows;
  var i = 0;
  var j = 0;
  preList = [];
  for (;i < _rows; i++) {
    preList[i] = [];
    for (;j < _rows; j++) {
      preList[i][j] = Math.random() > 0.4;
    }
  }
  drawPreList();
}

function getFactors(num) {
  var factors = [];
  var i = 2;
  for (;i < num; i++) {
    if (num % i == 0 && (canvasSize / i) > 10) {
      factors.push(i);
    }
  }
  return factors;
}

function getBestResolution(factors) {
  var i = 0;
  var length = factors.length;
  var last = 0;
  // i might want to calulate these number
  var goal = 10;
  for (;i < length; i++) {
    if (Math.abs(factors[i] - goal) < Math.abs(last - goal)) {
      last = factors[i];
    }
  }
  return last;
}

function drawOnGrid(e) {
  var y;
  var x;
  var i = 0;

  if (currentGame === undefined && isMouseDown === true && e.pageX >= offsetX && e.pageX <= (windowWidth - offsetX) && e.pageY >= 62 && e.pageY <= windowHeight - (windowHeight - 62 - canvasSize)) {
    var posx = Math.floor(((e.pageX + (lastFactor / 2)) - offsetX) / lastFactor);
    var posy = Math.floor(((e.pageY - 2) - offsetY) / lastFactor);
    if (posx >= rows-1) { posx = rows - 1 }
    if (posy >= rows-1) { posy = rows - 1 }
    if (posx < 0) { posx = 0 }
    if (posy < 0) { posy = 0 }

    for (; i < currentBrush.length; i += 2) {
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

function createBrushOptions() {
  Object.keys(brushes).forEach(function (brush) {
    var opt = document.createElement('option');
    opt.value = brush;
    opt.innerHTML = brush;
    brushSelection.appendChild(opt);
  });
  brushSelection.value = lastFactor;
}



}());
