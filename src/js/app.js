'use strict'

// ---------------- //
//  GAME function  //
// ---------------- //
const game = (function () {
  const gameState = {
    gameRunning: false,
    winningScore: 5,
    roundsPlayed: 0,
    gameScore: {
      player: 0,
      computer: 0
    }
  }

  const gameMvMap = {
    'rock': 1,
    'paper': 2,
    'scissors': 3
  }

  const UIicons = {
    1: '<i class="fa fa-hand-rock"></i>', // rock
    2: '<i class="fa fa-hand-paper"></i>', // paper
    3: '<i class="fa fa-hand-scissors"></i>' // scissors
  }

  const gameMessages = {
    newGame: '--- New game started ---',
    winningScoreSet: 'Winning score was set to:',
    win: 'Wonderful! You WIN the game!!!',
    lose: 'Badly! You LOSE the game.',
    roundResult: {
      '0': 'Draw.',
      '-1': 'You lose round :(',
      '1': 'You win round :)'
    }
  }

  // PUBLIC check is game currently running
  function isGameRunning () {
    return gameState.gameRunning;
  }

  // PUBLIC get & set method for winningScore properties
  function getWinningScore () {
    return gameState.winningScore;
  }

  function setWinningScore (value) {
    if (arguments.length === 0) throw 'No passed parameter.';
    if (!Number.isInteger(value)) throw 'Parameter must be integer.';
    gameState.winningScore = value;
  }

  // PRIV scoreRefresh method 
  function updateUIGameScore () {
    UIGameScore.innerHTML = `${gameState.gameScore.player} : ${gameState.gameScore.computer}`
  };

  // PRIV addLogMessage method 
  function addLogMessage (message) {
    UIGameLog.insertAdjacentHTML('afterbegin',`[${new Date().toLocaleTimeString()}] ${message} <br>`);
    updateUIGameScore();
  };

  // PRIV computerMove method
  function computerMove () {
    return Math.ceil((Math.random() * 3));
  };

  // PRIV checkRoundResult method
  function checkRoundResult(playerMv, computerMv) {
    if (playerMv === computerMv) 
      return 0;
    if ((playerMv === 1 && computerMv === 2) || 
        (playerMv === 2 && computerMv === 3) || 
        (playerMv === 3 && computerMv === 1))
      return -1;
    if ((playerMv === 1 && computerMv === 3) || 
        (playerMv === 2 && computerMv === 1) || 
        (playerMv === 3 && computerMv === 2))
      return 1;
  }

  // PRIV updateScore method
  function updateScore(roundResult) {
    if (roundResult === 1) gameState.gameScore.player++;
    if (roundResult === -1) gameState.gameScore.computer++;
    updateUIGameScore();
  }

  // PUBLIC newGame method
  function newGame (winningScore) {
    gameState.gameRunning = true;
    setWinningScore(winningScore);
    UIGameBtns.forEach(btn => {
      btn.addEventListener('click', game.nextRound);
      btn.classList.add('active')
    });
    gameState.gameScore.player = gameState.gameScore.computer = 0;
    updateUIGameScore();
    addLogMessage(gameMessages.newGame);
    addLogMessage(`${gameMessages.winningScoreSet} ${winningScore}.`);
  };

  // PRIV endGame method
  function endGame () {
    gameState.gameRunning = false;
    gameState.roundsPlayed = 0;
    const endGameMessage = (gameState.gameScore.player === gameState.winningScore)
      ? gameMessages.win : gameMessages.lose;
    addLogMessage(endGameMessage); 
    UIGameBtns.forEach(btn => {
      btn.removeEventListener('click', game.nextRound);
      btn.classList.remove('active');
    });
    modal.endGameModal(gameState.gameScore, endGameMessage);
  }
  
  // PUBLIC nextRound method
  function nextRound (e) {
    let playerMv = gameMvMap[e.currentTarget.getAttribute('data-mv')];
    let computerMv = computerMove();
    let roundResult = checkRoundResult(playerMv,computerMv);
    updateScore(roundResult);
    gameState.roundsPlayed++;
    addLogMessage(`Round ${gameState.roundsPlayed}: ${UIicons[playerMv]} vs ${UIicons[computerMv]}. ${gameMessages.roundResult[roundResult]}`)
    if (gameState.gameScore.player === gameState.winningScore || gameState.gameScore.computer === gameState.winningScore) endGame();
  };

  return {
    newGame,
    nextRound,
    isGameRunning,
    getWinningScore, 
    setWinningScore
  }
})()

// ---------------- //
//  MODAL function  //
// ---------------- //
const modal = (function () {
  // Modal UI vars init
  let UIModal, UIModalBtnClose, UIModalBtnAction;

  // Modal template
  function modalTemplate(modalContent) {
    return `
      <div id="modal" class="modal hidden">
        <div class="modal__content">
          <div class="modal__body">
            ${modalContent}
          </div>
          <div class="modal__footer">
          <a id="modal__btn-close" href="#!" class="button">Close</a>
            <a id="modal__btn-action" href="#!" class="button">Action</a>
          </div>
        </div>
      </div>
    `
  }

  function initModal(modalContent) {
    document.body.insertAdjacentHTML('beforeend', modalTemplate(modalContent));
    UIModal = document.querySelector('#modal');
    UIModalBtnClose = UIModal.querySelector('#modal__btn-close');
    UIModalBtnAction = UIModal.querySelector('#modal__btn-action');
    UIModalBtnClose.addEventListener('click', function() {
      closeModal();
    });
  }

  function showModal() {
    UIModal.classList.remove('hidden');
  }

  function closeModal() {
    UIModal.remove();
    UIModal = null; // Why UIModalBtnClose, UIModalBtnAction exist after nulling UImodal?
  }

  function newGameModal() {
    const modalContent = `
      <h5 class="modal__message">Hello Gamer. Do You want play a game?</h5>
      Set winning score:
      <div class="range-slider" id="winning-score-input">
        <input type="range" min="3" max="10" value="5" class="range-slider-input">
        <div class="range-slider-label">#</div>
      </div>
    `;
    initModal(modalContent);
    const winningScoreInput = initRangeSlider(UIModal.querySelector('#winning-score-input'));
    UIModalBtnAction.innerText = 'Start new game';
    UIModalBtnAction.addEventListener('click', function() {
      game.newGame(winningScoreInput.getValue());
      closeModal();
    });
    showModal();
  }

  function restartGameModal() {
    const modalContent = `
      <h5 class="modal__message">Game is running. Are You sure to start new one?</h5>
    `;
    initModal(modalContent);
    UIModalBtnAction.innerText = 'Restart game';
    UIModalBtnAction.addEventListener('click', function() {
      closeModal();
      newGameModal();
    });
    showModal();
  }

  function endGameModal(gameScore, endGameMessage) {
    const modalContent = `
      <div class="u-center">
        <h4 class="modal__message">${endGameMessage}</h4>
        <h5>Final Score:</h5>
        <h1 id="game-score">${gameScore.player} : ${gameScore.computer}</h1>
      </div>
    `;
    initModal(modalContent);
    UIModalBtnAction.innerText = 'New game';
    UIModalBtnAction.addEventListener('click', function() {
      closeModal();
      newGameModal();
    });
    showModal();
  }

  return {
    newGameModal,
    restartGameModal,
    endGameModal,
    // !! Temporary (default private) !!
    initModal,
    showModal,
    closeModal,
    UIModal // Why returns 'undefined' when is called from console after invoked modal.init()?
  }
})()

// Range slider initalization
function initRangeSlider(rangeSlider) {
  // Binding label
  const input = rangeSlider.querySelector('input[type="range"]')
  const label = rangeSlider.querySelector('.range-slider-label');
  label.innerText = input.value;
  input.oninput = function() {
    label.innerText = this.value;
  };
  // Input value getter
  function getValue() {
    return parseInt(input.value);
  };
  return {
    getValue
  }
};

// UI Vars
const UIGameBtns = document.querySelectorAll('.mv-btn');
const UINewGameBtn = document.querySelector('#new-game-btn');
const UIGameScore = document.querySelector('#game-score');
const UIGameLog = document.querySelector('#gamelog-board');

// Handler 'New Game' button
UINewGameBtn.addEventListener('click', newGameClick);
function newGameClick () {
  if (!game.isGameRunning()) 
    modal.newGameModal();
  else
    modal.restartGameModal();
};