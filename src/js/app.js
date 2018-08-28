'use strict'

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
  function newGame () {
    gameState.gameRunning = true;
    UIGameBtns.forEach(btn => {
      btn.addEventListener('click', game.nextRound);
      btn.classList.add('active')
    });

    gameState.gameScore.player = gameState.gameScore.computer = 0;
    updateUIGameScore();
    addLogMessage('Game started.');
  };

  // PRIV endGame method
  function endGame () {
    gameState.gameRunning = false;
    if (gameState.gameScore.player === gameState.winningScore) addLogMessage('Wonderful! You WIN the game!!!'); 
    if (gameState.gameScore.computer === gameState.winningScore) addLogMessage('Badly! You LOSE the game!!!'); 
    UIGameBtns.forEach(btn => {
      btn.removeEventListener('click', game.nextRound);
      btn.classList.remove('active');
    });
  }
  
  // PUBLIC nextRound method
  function nextRound (e) {
    let roundResultMap = {
      '0': 'Draw.',
      '-1': 'You lose round :(',
      '1': 'You win round :)'
    };
    let playerMv = gameMvMap[e.currentTarget.getAttribute('data-mv')];
    let computerMv = computerMove();
    let roundResult = checkRoundResult(playerMv,computerMv);
    updateScore(roundResult);
    gameState.roundsPlayed++;
    addLogMessage(`Round ${gameState.roundsPlayed}: ${UIicons[playerMv]} vs ${UIicons[computerMv]}. ${roundResultMap[roundResult]}`)
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

// Modal function
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
      destroyModal();
    });
  }

  function showModal() {
    UIModal.classList.remove('hidden');
  }

  function destroyModal() {
    console.log('Modal UI elements before remove:', UIModal, UIModalBtnClose, UIModalBtnAction);
    UIModal.remove();
    UIModal = null; // Why UIModalBtnClose, UIModalBtnAction exist after nulling UImodal?
    console.log('Modal UI elements after remove:', UIModal, UIModalBtnClose, UIModalBtnAction);
  }

  function newGame() {
    const modalContent = `
      <h5 class="modal__message">Hello Gamer. Do You want play a game?</h5>
      Set winning score:
      <form>
        <div class="range-slider" id="winning-score-input">
          <input type="range" min="3" max="10" value="5" class="range-slider-input">
          <div class="range-slider-label">#</div>
        </div>
      </form> 
    `;
    initModal(modalContent);
    const winningScoreInput = initRangeSlider(UIModal.querySelector('#winning-score-input'));
    UIModalBtnAction.addEventListener('click', function() {
      console.log('Action button was clicked.');
      console.log('Winning score input value:', winningScoreInput.getValue());
    });
  }

  function restartGame() {
    console.log('Game is running');
  }

  return {
    newGame,
    restartGame,
    // !! Temporary (default private) !!
    initModal,
    showModal,
    destroyModal,
    UIModal // Why returns 'undefined' when is called after modal init?
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
    modal.newGame();
  else
    modal.restartGame();
};