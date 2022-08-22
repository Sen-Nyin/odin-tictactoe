'use strict';

function playerFactory() {
  const personPrototype = {
    setName(name) {
      this.name = name;
    },
    getName() {
      return this.name;
    },
    setWins() {
      this.wins++;
    },
    getWins() {
      return this.wins;
    },
  };
  const person = Object.create(personPrototype);
  person.wins = 0;
  return person;
}
// Game Controller

const gameController = (function () {
  const player1 = playerFactory();
  const player2 = playerFactory();
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
  return { getTurn, switchTurn, checkWin, checkDraw, player1, player2 };
})();

// Display Controller

const displayController = (function () {
  const xClass = 'symbolX';
  const oClass = 'symbolO';
  let currentMarker = xClass;
  const gameCells = document.querySelectorAll('[data-game-cell]');
  const gameBoard = document.querySelector('#game-board');
  const player1NameLabel = document.getElementById('p1nameDisplay');
  const player2NameLabel = document.getElementById('p2nameDisplay');
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const player1NameInput = document.getElementById('p1nameInput');
  const player2NameInput = document.getElementById('p2nameInput');
  const startBtn = document.getElementById('start');

  const setNames = (e) => {
    e.preventDefault();
    if (player1NameInput.value && player2NameInput.value) {
      gameController.player1.setName(player1NameInput.value);
      gameController.player2.setName(player2NameInput.value);
      player1NameLabel.textContent = player1NameInput.value;
      player2NameLabel.textContent = player2NameInput.value;
      modal.classList.add('hidden');
      overlay.classList.add('hidden');
      startGame();
    }
  };

  startBtn.addEventListener('click', setNames);

  const startGame = () => {
    gameCells.forEach((cell) => {
      cell.classList.remove(xClass);
      cell.classList.remove(oClass);
      cell.addEventListener('click', clickCell, { once: true });
    });
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
      const winner =
        gameController.getTurn() === 'x'
          ? gameController.player1.getName()
          : gameController.player2.getName();
      gameController.getTurn() === 'x'
        ? gameController.player1.setWins()
        : gameController.player2.setWins();
      displayResult(winner);
    } else if (gameController.checkDraw(gameCells)) {
      stopGame();
      displayResult('tie');
    } else {
      gameController.switchTurn();
      updateBoardClass();
    }
  };
  const displayResult = (text) => {
    const player1ScoreEle = document.getElementById('p1score');
    const player2ScoreEle = document.getElementById('p2score');
    while (modal.firstChild) {
      modal.firstChild.remove();
    }
    const resultElement = document.createElement('h2');
    resultElement.classList.add('modal__title');
    if (text === 'tie') {
      resultElement.textContent = `It's a TIE!`;
    } else {
      player1ScoreEle.textContent = gameController.player1.getWins();
      player2ScoreEle.textContent = gameController.player2.getWins();
      resultElement.textContent = `${text} is the winner!`;
    }
    const playAgainBtn = document.createElement('button');
    playAgainBtn.classList.add('btn');
    playAgainBtn.textContent = 'Play again';
    playAgainBtn.addEventListener('click', playAgain);
    const newGameBtn = document.createElement('button');
    newGameBtn.classList.add('btn');
    newGameBtn.textContent = 'New Game';
    newGameBtn.addEventListener('click', () => location.reload());

    modal.append(resultElement);
    modal.append(playAgainBtn);
    modal.append(newGameBtn);
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };
  const playAgain = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    startGame();
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
})();
