(function(){
var brushes = window.brushes = {};

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
