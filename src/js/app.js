'use strict'

var game = (function () { // ISSUE: If I use 'const' insted 'var'. Typing 'window['game']' don't return game object
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
  function newGame (winningScore) {
    gameState.gameRunning = true;
    setWinningScore(winningScore);
    UIGameBtns.forEach(btn => {
      btn.addEventListener('click', game.nextRound);
      btn.classList.add('active')
    });

    gameState.gameScore.player = gameState.gameScore.computer = 0;
    updateUIGameScore();
    addLogMessage('Game started.');
    addLogMessage(`Winning score is: ${winningScore}`);
  };

  // PRIV endGame method
  function endGame () {
    gameState.gameRunning = false;
    gameState.roundsPlayed = 0;
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

// UI Vars
const UIGameBtns = document.querySelectorAll('.mv-btn');
const UINewGameBtn = document.querySelector('#new-game-btn');
const UIGameScore = document.querySelector('#game-score');
const UIGameLog = document.querySelector('#gamelog-board');

UINewGameBtn.addEventListener('click', newGameClick);

// Function handling 'New Game' button
function newGameClick () {
  if (!game.isGameRunning()) 
    modal('newGame');
  if (game.isGameRunning()) 
    modal('restartGame');
}

// Modal function
function modal (modalId) {
  // Modals data
  const modalsData = {
    newGame: {
      body: `
        <h5 class="modal__message">Hello Gamer. Do You want play a game?</h5>
        Set winning score:
        <form>
          <div class="range-slider-container">
            <input type="range" min="3" max="10" value="5" class="range-slider" id="winning-score">
            <div class="range-slider-label" id="winning-score-label">#</div>
          </div>
        </form> 
       `,
      preFns: [
        {name: 'initRangeSlider', params: ['winning-score']}
      ],
      actionFn: {name: 'game.newGame'},
      actionName: 'Play'
    },
    restartGame: {
      body: `
        <h5 class="modal__message">You play now. Are you sure you want to start a new one?</h5>
      `,
      actionFn: {name: 'modal', params: ['newGame']},
      actionName: 'Restart'
    },
    endGame: {
      body: `
        Test message from 'endGame' modal obj
      `,
      actionFn: {name: 'modal', params: ['newGame']},
      actionName: 'Play Again' 
    }
  };

  // Modal template
  const modalTemplate = `
    <div id="modal" class="modal hidden">
      <div class="modal__content">
        <div class="modal__body">
          ${modalsData[modalId].body}
        </div>
        <div class="modal__footer">
        <a id="modal__btn-close" href="#!" class="button">Close</a>
          <a id="modal__btn-action" href="#!" class="button">${modalsData[modalId].actionName}</a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalTemplate);
  let UImodal = document.querySelector('#modal');
  // Invoke pre functions
  if (modalsData[modalId].preFns) {
    modalsData[modalId].preFns.forEach(fn => invokeFnFromObj(fn));
  };
  let UImodalBtnClose = document.querySelector('#modal__btn-close');
  let UImodalBtnAction = document.querySelector('#modal__btn-action');
  UImodalBtnClose.addEventListener('click', function() {UImodal.remove()});
  UImodalBtnAction.addEventListener('click', function() {
    if (modalsData[modalId].postFns) {
      modalsData[modalId].postFns.forEach(fn => invokeFnFromObj(fn));
    };  
    invokeFnFromObj(modalsData[modalId].actionFn, [getWinningScore()]);
    UImodal.remove();
  });
  UImodal.classList.remove('hidden');
}

function getWinningScore() {
  if (document.querySelector('#winning-score'))
    return parseInt(document.querySelector('#winning-score').value);
}

function initRangeSlider(rangeSliderId) {
  const UIRangeSlider = document.querySelector(`#${rangeSliderId}`);
  const UIRangeSliderLabel = document.querySelector(`#${rangeSliderId}-label`);
  // Binding label
  UIRangeSliderLabel.innerText = UIRangeSlider.value;
  UIRangeSlider.oninput = function () {
    UIRangeSliderLabel.innerText = this.value;
  }
};


// Calling JavaScript function for string (based on solution: https://www.sitepoint.com/call-javascript-function-string-without-using-eval/)
function invokeFnFromObj (fnObj, params) {
  if (fnObj.params) 
    params = fnObj.params;
  console.log(fnObj, params);
  const invokedFn = parseScope(fnObj.name);
  
  if (typeof invokedFn === "function") 
    if (params) 
      invokedFn.apply(null, params)
    else invokedFn();
};

// Parsing scope (based on: https://stackoverflow.com/questions/912596/how-to-turn-a-string-into-a-javascript-function-call/12380392#12380392)
function parseScope (scopeString) {
  let scope = window;
  const scopeSplit = scopeString.split('.');
  for (let i = 0; i < scopeSplit.length - 1; i++) {
    scope = scope[scopeSplit[i]];
    if (scope == undefined) return;
  }
  return scope[scopeSplit[scopeSplit.length - 1]];
}