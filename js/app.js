'use strict';
const TicTacToe = (function () {
  const gameController = (function () {
    const personFactory = (name, symbol) => {
      let playerName = name;
      let playerSymbol = symbol;
      let playerScore = 0;
      return {
        get name() {
          return playerName;
        },
        set name(name) {
          playerName = name;
        },
        get symbol() {
          return playerSymbol;
        },
        get score() {
          return playerScore;
        },
        setScore() {
          playerScore += 1;
        },
      };
    };
    const player1 = personFactory('Player 1', 'x');
    const player2 = personFactory('Player 2', 'o');
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
    const currentGameBoard = new Array(9);
    for (let i = 0; i < currentGameBoard.length; i++) {
      currentGameBoard.fill(i, i, i + 1);
    }
    const updateCurrentGameBoard = () => {
      const cells = document.querySelectorAll('.game__board-cell');
      cells.forEach((cell, index) => {
        const marker = cell.classList.contains('symbolX')
          ? 'x'
          : cell.classList.contains('symbolO')
          ? 'o'
          : index;
        currentGameBoard.fill(marker, index, index + 1);
      });
    };
    const availableMoves = (board) =>
      board.filter((cell) => cell !== 'x' && cell !== 'o');
    const checkForWin = (symbol, board = currentGameBoard) =>
      winConditions.find((condition) =>
        condition.every((cell) => board[cell] === symbol)
      );
    const checkForDraw = () => availableMoves(currentGameBoard).length === 0;
    const checkGameState = (symbol) => {
      if (checkForWin(symbol)) {
        turn === 'x' ? player1.setScore() : player2.setScore();
        return { status: 'win', winningCells: checkForWin(symbol) };
      } else if (checkForDraw()) {
        return { status: 'tie' };
      }
    };
    let turn = 'x';
    const switchTurn = () => {
      turn = turn === 'x' ? 'o' : 'x';
    };

    const minimax = (currentBoard, symbol) => {
      const tempBoard = currentBoard;
      // available cells
      const availMoves = availableMoves(tempBoard);

      // check for terminal states
      if (checkForWin('o', tempBoard)) {
        return { score: 10 };
      } else if (checkForWin('x', tempBoard)) {
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
      if (availableMoves(currentGameBoard).length > 0) {
        const move = minimax(currentGameBoard, turn);
        displayController.displayPlayerSymbol(cells[move.index]);
        cells[move.index].removeEventListener(
          'click',
          displayController.handleCellClick,
          { once: true }
        );
        currentGameBoard.fill(turn, move.index, move.index + 1);
        const gameStatus = checkGameState(turn);
        if (gameStatus) {
          if (gameStatus.status === 'win') {
            displayController.highlightWinningCells(gameStatus.winningCells);
          }
          const currentTurn = turn;
          setTimeout(
            () =>
              displayController.displayRoundOutcome(
                gameStatus.status,
                currentTurn
              ),
            1500
          );
        } else {
          switchTurn();
          displayController.updateBoardClass();
        }
        displayController.updateScores();
      }
    };

    return {
      player1,
      player2,
      get turn() {
        return turn;
      },
      switchTurn,
      checkGameState,
      updateCurrentGameBoard,
      aiPlay,
    };
  })();

  const displayController = (function () {
    const mainElement = document.querySelector('.main');
    const startButton = document.getElementById('start');

    // method
    const clearPage = () => {
      while (mainElement.firstChild) {
        mainElement.firstChild.remove();
      }
    };
    const startGame = () => {
      const cells = getCellList();
      cells.forEach((cell) => {
        cell.classList.remove('symbolX', 'symbolO', 'winner');
        cell.addEventListener('click', handleCellClick, { once: true });
      });
      document.body.lastChild.remove();
      gameController.switchTurn();
      updateBoardClass();
    };
    const stopGame = () => {
      const gameCells = getCellList();
      gameCells.forEach((cell) =>
        cell.removeEventListener('click', handleCellClick, { once: true })
      );
    };
    const displaySetupForm = (e) => {
      clearPage();
      const setupElement = document.createElement('div');
      setupElement.classList.add('setup');
      const setupHeaderText = document.createElement('h2');
      setupHeaderText.classList.add('setup__title');
      setupHeaderText.textContent = 'Game Setup';
      const setupForm = document.createElement('form');
      setupForm.classList.add('setup__form');
      const setupFormPlayer1Text = document.createElement('h3');
      setupFormPlayer1Text.classList.add('setup__sub-header');
      setupFormPlayer1Text.textContent = 'Player 1 (X)';
      const setupFormP1NameInput = document.createElement('input');
      setupFormP1NameInput.setAttribute('type', 'text');
      setupFormP1NameInput.setAttribute('id', 'p1nameInput');
      setupFormP1NameInput.setAttribute('placeholder', 'Enter Name');
      const setupFormPlayer2Text = document.createElement('h3');
      setupFormPlayer2Text.classList.add('setup__sub-header');
      setupFormPlayer2Text.textContent = 'Player 2 (O)';
      const setupFormP2NameInput = document.createElement('input');
      setupFormP2NameInput.setAttribute('type', 'text');
      setupFormP2NameInput.setAttribute('id', 'p2nameInput');
      setupFormP2NameInput.setAttribute('placeholder', 'Enter Name');
      const setupAIToggler = document.createElement('label');
      setupAIToggler.classList.add('switch');
      const setupAITogglerText = document.createElement('span');
      setupAITogglerText.classList.add('switch__label');
      setupAITogglerText.textContent = 'Play vs AI';
      const setupAITogglerCheckbox = document.createElement('input');
      setupAITogglerCheckbox.setAttribute('type', 'checkbox');
      setupAITogglerCheckbox.setAttribute('id', 'playai');
      setupAITogglerCheckbox.classList.add('switch__checkbox');
      const setupAITogglerSwitch = document.createElement('span');
      setupAITogglerSwitch.classList.add('switch__slider', 'round');
      const setupSubmitButton = document.createElement('button');
      setupSubmitButton.classList.add('btn');
      setupSubmitButton.textContent = 'Submit';
      setupSubmitButton.addEventListener('click', displayGame);
      setupAIToggler.append(
        setupAITogglerText,
        setupAITogglerCheckbox,
        setupAITogglerSwitch
      );
      setupForm.append(
        setupFormPlayer1Text,
        setupFormP1NameInput,
        setupFormPlayer2Text,
        setupFormP2NameInput,
        setupAIToggler,
        setupSubmitButton
      );
      setupElement.append(setupHeaderText, setupForm);
      mainElement.append(setupElement);
    };

    const displayGame = (e) => {
      e.preventDefault();
      const player1Name = document.getElementById('p1nameInput').value;
      let player2Name = document.getElementById('p2nameInput').value;
      const isAIPlayer = document.getElementById('playai').checked;
      if ((player1Name && player2Name) || (player1Name && isAIPlayer)) {
        gameController.player1.name = player1Name;
        if (isAIPlayer) {
          player2Name = 'Computer';
        }
        gameController.player2.name = player2Name;

        clearPage();
        // scores
        const scoresElement = document.createElement('section');
        scoresElement.classList.add('scores');
        const player1NameText = document.createElement('span');
        player1NameText.classList.add('scores__player-name');
        player1NameText.setAttribute('id', 'p1nameDisplay');
        player1NameText.textContent = gameController.player1.name;
        const player1ScoreText = document.createElement('span');
        player1ScoreText.classList.add('scores__score');
        player1ScoreText.setAttribute('id', 'p1score');
        player1ScoreText.textContent = '0';
        const player2NameText = document.createElement('span');
        player2NameText.classList.add('scores__player-name');
        player2NameText.setAttribute('id', 'p2nameDisplay');
        player2NameText.textContent = gameController.player2.name;
        const player2ScoreText = document.createElement('span');
        player2ScoreText.classList.add('scores__score');
        player2ScoreText.setAttribute('id', 'p2score');
        player2ScoreText.textContent = '0';
        scoresElement.append(
          player1NameText,
          player1ScoreText,
          player2ScoreText,
          player2NameText
        );

        // game board
        const gameElement = document.createElement('section');
        gameElement.classList.add('game');
        const gameBoardElement = document.createElement('div');
        gameBoardElement.classList.add('game__board', 'symbolX');
        gameBoardElement.setAttribute('id', 'game-board');

        for (let i = 1; i <= 9; i++) {
          const gameBoardCellElement = document.createElement('div');
          gameBoardCellElement.classList.add('game__board-cell', 'modern');
          gameBoardCellElement.addEventListener('click', handleCellClick, {
            once: true,
          });
          gameBoardElement.append(gameBoardCellElement);
        }
        gameElement.append(gameBoardElement);
        mainElement.append(scoresElement, gameElement);
      }
    };

    const displayRoundOutcome = (outcome, winner = null) => {
      const overlayElement = document.createElement('div');
      const outcomeContainer = document.createElement('div');
      outcomeContainer.classList.add('outcome');
      overlayElement.classList.add('overlay');
      const outcomeElement = document.createElement('span');
      outcomeElement.classList.add('outcome__text');
      if (outcome === 'win') {
        outcomeElement.textContent = `${
          winner === 'x'
            ? gameController.player1.name
            : gameController.player2.name
        } won this round!`;
      } else {
        outcomeElement.textContent = 'This round was a tie!';
      }
      const newGameButton = document.createElement('button');
      newGameButton.classList.add('btn', 'outcome__newgame');
      newGameButton.textContent = 'New Game';
      newGameButton.addEventListener('click', () => location.reload());
      const replayButton = document.createElement('button');
      replayButton.classList.add('btn', 'outcome__replay');
      replayButton.textContent = 'Play Again';
      replayButton.addEventListener('click', startGame);

      outcomeContainer.append(outcomeElement, newGameButton, replayButton);
      overlayElement.append(outcomeContainer);
      document.body.append(overlayElement);
    };
    const getCurrentPlayerSymbol = () =>
      gameController.turn === 'x' ? 'symbolX' : 'symbolO';

    const displayPlayerSymbol = (cell) =>
      cell.classList.add(getCurrentPlayerSymbol());

    const updateBoardClass = () => {
      const gameBoard = document.querySelector('.game__board');
      gameBoard.classList.remove('symbolX', 'symbolO');
      gameBoard.classList.add(getCurrentPlayerSymbol());
    };
    const getCellList = () => document.querySelectorAll('.game__board-cell');

    const highlightWinningCells = (winningCells) => {
      const cells = getCellList();
      winningCells.forEach((index) => cells[index].classList.add('winner'));
    };
    const updateScores = () => {
      const p1scoreElement = document.getElementById('p1score');
      const p2scoreElement = document.getElementById('p2score');

      p1scoreElement.textContent = gameController.player1.score;
      p2scoreElement.textContent = gameController.player2.score;
    };
    const handleCellClick = (e) => {
      const cell = e.target;
      const currentTurn = gameController.turn;
      if (
        currentTurn === 'x' ||
        (currentTurn === 'o' && gameController.player2.name !== 'Computer')
      ) {
        displayPlayerSymbol(cell);
        gameController.updateCurrentGameBoard();
        const gameStatus = gameController.checkGameState(currentTurn);
        if (gameStatus) {
          stopGame();
          if (gameStatus.status === 'win') {
            highlightWinningCells(gameStatus.winningCells);
            updateScores();
          }
          setTimeout(
            () => displayRoundOutcome(gameStatus.status, currentTurn),
            1500
          );
        }

        gameController.switchTurn();
        updateBoardClass();
        if (
          gameController.turn === 'o' &&
          gameController.player2.name === 'Computer'
        ) {
          gameController.aiPlay(getCellList());
        }
      }
    };

    // event listners
    startButton.addEventListener('click', displaySetupForm);

    return {
      displayPlayerSymbol,
      displayRoundOutcome,
      updateBoardClass,
      highlightWinningCells,
      handleCellClick,
      updateScores,
    };
  })();
})();
