'use strict';

const gameController = (function () {
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
  const currentBoard = new Array(9);
  for (let i = 0; i < currentBoard.length; i++) {
    currentBoard.fill(i, i, i + 1);
  }
  console.log('Board:', currentBoard);
  const getAvailableMoves = () =>
    currentBoard.filter((cell) => cell !== 'x' && cell !== 'o');

  const updateCurrentBoard = (cells) => {
    cells.forEach((cell, index) => {
      let marker = cell.classList.contains('symbolX')
        ? 'x'
        : cell.classList.contains('symbolO')
        ? 'o'
        : index;
      currentBoard.fill(marker, index, index + 1);
    });
  };
  const switchTurn = () => {
    turn = turn === 'x' ? 'o' : 'x';
  };
  const getTurn = () => {
    return turn;
  };
  const checkWin = (symbol, board = currentBoard) =>
    winConditions.find((condition) =>
      condition.every((cell) => board[cell] === symbol)
    );
  const checkDraw = (cells) => {
    const cellsArr = Array.from(cells);
    return cellsArr.every(
      (cell) =>
        cell.classList.contains('symbolX') || cell.classList.contains('symbolO')
    );
  };
  const minimax = (symbol) => {
    const tempBoard = gameBoard;
    // available cells
    const availMoves = getAvailableMoves();
    // check for terminal states
    if (checkWin('o', tempBoard)) {
      return 10;
    } else if (checkWin('x', tempBoard)) {
      return -10;
    } else if (availMoves === 0) {
      return 0;
    }
  };
  return {
    getTurn,
    switchTurn,
    checkWin,
    checkDraw,
    updateCurrentBoard,
    player1,
    player2,
  };
})();

const displayController = (function () {
  const xClass = 'symbolX';
  const oClass = 'symbolO';
  let currentMarker = xClass;
  const gameCells = document.querySelectorAll('[data-game-cell]');
  const gameBoard = document.querySelector('#game-board');
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const startBtn = document.getElementById('start');
  const setNames = (e) => {
    e.preventDefault();
    const player1NameLabel = document.getElementById('p1nameDisplay');
    const player2NameLabel = document.getElementById('p2nameDisplay');
    const player1NameInput = document.getElementById('p1nameInput');
    const player2NameInput = document.getElementById('p2nameInput');
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
      cell.classList.remove('winner');
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
  const highlightWinCells = (arr) => {
    arr.forEach((cell) => gameCells[cell].classList.add('winner'));
  };
  const clickCell = function (e) {
    console.log(e);
    const cell = e.target;
    getCurrentMarker();
    displaySymbol(cell, currentMarker);
    gameController.updateCurrentBoard(gameCells);
    const checkWinResult = gameController.checkWin(gameController.getTurn());
    console.log(checkWinResult);
    if (checkWinResult) {
      stopGame();
      highlightWinCells(checkWinResult);
      const winner =
        gameController.getTurn() === 'x'
          ? gameController.player1.getName()
          : gameController.player2.getName();
      gameController.getTurn() === 'x'
        ? gameController.player1.setWins()
        : gameController.player2.setWins();
      setTimeout(() => displayResult(winner), 1500);
    } else if (gameController.checkDraw(gameCells)) {
      stopGame();
      setTimeout(() => displayResult('tie'), 1500);
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
