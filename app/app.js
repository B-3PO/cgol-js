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

}());
