'use strict';

const gameController = (function () {
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
  function playerFactory() {
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
  const getAvailableMoves = (board) =>
    board.filter((cell) => cell !== 'x' && cell !== 'o');

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
  const minimax = (currentBoard, symbol) => {
    const tempBoard = currentBoard;
    // available cells
    const availMoves = getAvailableMoves(tempBoard);
    // check for terminal states
    if (checkWin('o', tempBoard)) {
      return { score: 10 };
    } else if (checkWin('x', tempBoard)) {
      return { score: -10 };
    } else if (availMoves.length === 0) {
      return { score: 0 };
    }
    // collect outcomes
    const moves = [];

    // loop through available moves
    for (let i = 0; i < availMoves.length; i++) {
      // object to store score and index of that score
      const move = {};
      move.index = tempBoard[availMoves[i]];
      // apply symbol to emtpy cell
      tempBoard[availMoves[i]] = symbol;
      // use recursion to obtain scores from options
      if (symbol === 'o') {
        let outcome = minimax(tempBoard, 'x');
        move.score = outcome.score;
      } else {
        let outcome = minimax(tempBoard, 'o');
        move.score = outcome.score;
      }
      // reset spot back to empty
      tempBoard[availMoves[i]] = move.index;
      // add the outcome to array
      moves.push(move);
    }
    // check for best move
    let bestMove;
    if (symbol === 'o') {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  };
  const aiPlay = (cells) => {
    console.log(cells);
    const move = minimax(currentBoard, turn);
    displayController.displaySymbol(cells[move.index]);
    currentBoard.fill(turn, move.index, move.index + 1);
    displayController.checkStatus();
    console.log(move);
  };
  return {
    getTurn,
    switchTurn,
    checkWin,
    checkDraw,
    updateCurrentBoard,
    player1,
    player2,
    aiPlay,
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
    const aiCheck = document.getElementById('playai');
    if (
      (player1NameInput.value && player2NameInput.value) ||
      (player1NameInput.value && aiCheck.checked)
    ) {
      const p2name = aiCheck.checked ? 'Computer' : player2NameInput.value;
      gameController.player1.setName(player1NameInput.value);
      gameController.player2.setName(p2name);
      player1NameLabel.textContent = player1NameInput.value;
      player2NameLabel.textContent = p2name;
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
    if (
      gameController.getTurn() === 'x' ||
      (gameController.getTurn() === 'o' &&
        gameController.player2.name !== 'Computer')
    ) {
      const cell = e.target;
      displaySymbol(cell);
      gameController.updateCurrentBoard(gameCells);
      checkStatus();
      if (
        gameController.getTurn() === 'o' &&
        gameController.player2.name === 'Computer'
      ) {
        console.log('doing ai play');
        gameController.aiPlay(gameCells);
      }
    }
  };
  const checkStatus = () => {
    const checkWinResult = gameController.checkWin(gameController.getTurn());
    if (checkWinResult) {
      stopGame();
      highlightWinCells(checkWinResult);
      updateWins();
      setTimeout(() => displayResult('win'), 1500);
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
    if (text === 'win') {
      const winner =
        gameController.getTurn() === 'x'
          ? gameController.player1.getName()
          : gameController.player2.getName();
      player1ScoreEle.textContent = gameController.player1.getWins();
      player2ScoreEle.textContent = gameController.player2.getWins();
      resultElement.textContent = `${winner} is the winner!`;
      gameController.switchTurn();
    } else if (text === 'tie') {
      resultElement.textContent = `It's a TIE!`;
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
  const updateWins = () => {
    gameController.getTurn() === 'x'
      ? gameController.player1.setWins()
      : gameController.player2.setWins();
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
  const displaySymbol = function (cell) {
    getCurrentMarker();
    cell.classList.add(currentMarker);
    cell.removeEventListener('click', clickCell, { once: true });
  };
  return { updateBoardClass, displaySymbol, checkStatus };
})();
