'use strict';

const gameController = (function () {
  const winConditions = [];
  const currentGameBoard = [];
  const availableMoves = [];

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

  return { player1, player2 };
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

    // setupAITogglerCheckbox.addEventListener('click', _); // TODO
    setupSubmitButton.addEventListener('click', displayGame); // TODO

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
    const player1Name = document.getElementById('p1nameInput');
    const player2Name = document.getElementById('p2nameInput');
    const isAIPlayer = document.getElementById('playai');
    if (
      (player1Name.value && player2Name.value) ||
      (player1Name.value && isAIPlayer)
    ) {
      gameController.player1.name = player1Name.value;
      gameController.player2.name = player2Name.value
        ? player2Name.value
        : 'Computer';
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
      const vsText = document.createElement('span');
      vsText.classList.add('vs');
      vsText.textContent = 'VS';
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
        vsText,
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
        console.log('add cell');
        const gameBoardCellElement = document.createElement('div');
        gameBoardCellElement.classList.add('game__board-cell', 'modern');
        // gameBoardCellElement.addEventListener('click', humanPlay, {once: true}) //TODO
        gameBoardElement.append(gameBoardCellElement);
      }
      gameElement.append(gameBoardElement);
      mainElement.append(scoresElement, gameElement);
    }
  };

  // event listners
  startButton.addEventListener('click', displaySetupForm);
})();
