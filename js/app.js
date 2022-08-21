'use strict';
// Player factory

function playerFactory(name, symbol) {
  const personPrototype = {
    setName(name) {
      this.name = name;
    },
  };
  const person = Object.create(personPrototype);
  return person;
}
// Game Controller

const gameController = (function () {
  let turn = 'x';
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const updateGameBoard = (index) => {
    gameBoard.fill(turn, index, index + 1);
    console.log(gameBoard);
  };
  const switchTurn = () => {
    turn = turn === 'x' ? 'o' : 'x';
  };
  const getTurn = () => {
    return turn;
  };
  const checkWin = (currentMarker, cells) =>
    winConditions.some((condition) =>
      condition.every((cell) => cells[cell].classList.contains(currentMarker))
    );

  const checkDraw = (cells) => {
    const cellsArr = Array.from(cells);
    return cellsArr.every(
      (cell) =>
        cell.classList.contains('symbolX') || cell.classList.contains('symbolO')
    );
  };
  return { getTurn, switchTurn, checkWin, updateGameBoard, checkDraw };
})();

// Display Controller

const displayController = (function () {
  const xClass = 'symbolX';
  const oClass = 'symbolO';
  let currentMarker = xClass;
  const gameCells = document.querySelectorAll('[data-game-cell]');
  const gameBoard = document.querySelector('#game-board');

  const startGame = () => {
    gameCells.forEach((cell) =>
      cell.addEventListener('click', clickCell, { once: true })
    );
    currentMarker = xClass;
    updateBoardClass();
  };
  const stopGame = () => {
    gameCells.forEach((cell) =>
      cell.removeEventListener('click', clickCell, { once: true })
    );
  };
  const clickCell = function (e) {
    const cell = e.target;
    getCurrentMarker();
    displaySymbol(cell, currentMarker);
    if (gameController.checkWin(currentMarker, gameCells)) {
      stopGame();
      console.log('Winner');
    }
    // TODO check draw
    if (gameController.checkDraw(gameCells)) {
      stopGame();
      console.log('Draw');
    }
    gameController.switchTurn();
    updateBoardClass();
  };
  const getCurrentMarker = () => {
    const currentTurn = gameController.getTurn();
    currentMarker = currentTurn === 'x' ? xClass : oClass;
  };
  const updateBoardClass = () => {
    getCurrentMarker();
    gameBoard.classList.remove(xClass, oClass);
    gameBoard.classList.add(currentMarker);
  };
  const displaySymbol = function (cell, marker) {
    cell.classList.add(marker);
  };
  startGame();
})();
