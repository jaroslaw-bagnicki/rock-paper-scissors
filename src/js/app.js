'use strict'

const game = (function () {
  let gameScore = {};
  let winningScore = 5;
  let gameRunning = false;

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
    return gameRunning;
  }

  // PUBLIC get & set method for winningScore properties
  function getWinningScore () {
    return winningScore;
  }

  function setWinningScore (value) {
    if (arguments.length === 0) throw 'No passed parameter.';
    if (!Number.isInteger(value)) throw 'Parameter must be integer.';
    winningScore = value;
  }

  // PRIV scoreRefresh method 
  function updateUIGameScore () {
    UIGameScore.innerHTML = `${gameScore.player} : ${gameScore.computer}`
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
    if (roundResult === 1) gameScore.player++;
    if (roundResult === -1) gameScore.computer++;
    updateUIGameScore();
  }

  // PUBLIC newGame method
  function newGame () {
    gameRunning = true;
    UIGameBtns.forEach(btn => {
      btn.addEventListener('click', game.nextRound);
      btn.classList.add('active')
    });

    gameScore.player = gameScore.computer = 0;
    updateUIGameScore();
    addLogMessage('Game started.');
  };

  // PRIV endGame method
  function endGame () {
    gameRunning = false;
    if (gameScore.player === winningScore) addLogMessage('Wonderful! You WIN the game!!!'); 
    if (gameScore.computer === winningScore) addLogMessage('Badly! You LOSE the game!!!'); 
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
    addLogMessage(`${UIicons[playerMv]} vs ${UIicons[computerMv]}. ${roundResultMap[roundResult]}`)
    if (gameScore.player === winningScore || gameScore.computer === winningScore) endGame();
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
const UIGameBtns = document.querySelectorAll('.game-btn');
const UINewGameBtn = document.querySelector('#new-game-btn');
const UIGameScore = document.querySelector('#game-score');
const UIGameLog = document.querySelector('#gamelog-board');

UINewGameBtn.addEventListener('click', newGameClick);

// Function handling 'New Game' button
function newGameClick () {
  if (!game.isGameRunning()) 
    modal('Hello Gamer. Do You want play a game?', game.newGame ,"Play");
  if (game.isGameRunning()) 
    modal('You play now. Are you sure you want to start a new one?', game.newGame ,"Restart");
}

// Modal function
function modal (message, actionFn, actionName) {
let modalBody = `
  <div id="modal" class="modal">
    <div class="modal__content">
      <div class="modal__body">
        <h5 class="modal__message">${message}</h5>
      </div>
      <div class="modal__footer">
      <a id="modal__btn-close" href="#!" class="button">Close</a>
        <a id="modal__btn-action" href="#!" class="button">${actionName}</a>
      </div>
    </div>
  </div>
`;
  document.body.insertAdjacentHTML('beforeend', modalBody);
  let UImodal = document.querySelector('#modal');
  let UImodalBtnClose = document.querySelector('#modal__btn-close');
  let UImodalBtnAction = document.querySelector('#modal__btn-action');
  UImodalBtnClose.addEventListener('click', function() {UImodal.remove()});
  UImodalBtnAction.addEventListener('click', function() {
    UImodal.remove();
    actionFn();
  });
}
