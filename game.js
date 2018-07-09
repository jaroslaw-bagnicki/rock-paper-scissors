'use strict'

const game = (function () {
  let gameScore = {};

  const gameChoiceMap = {
    1: 'rock',
    2: 'paper',
    3: 'scissors'
  }

  // PRIV scoreRefresh method 
  function scoreRefresh () {
    UIGameScore.innerHTML = `${gameScore.player} : ${gameScore.computer}`
  };

  // PRIV addLogMessage method 
  function addLogMessage (message) {
    UIGameLog.insertAdjacentHTML('afterbegin',`[${new Date().toLocaleTimeString()}] ${message} <br>`);
    scoreRefresh();
  };

  // PRIV 
  function computerMove () {
    return Math.ceil((Math.random() * 3));
  };
  
  // PUBLIC newGame method
  function newGame () {
    gameScore.player = gameScore.computer = 0;
    scoreRefresh();
    addLogMessage('Game started.');
  };

  // PUBLIC playerMove method
  function playerMove () {
    let playerChoice = UIBtnsIdMap[this.id];
    let computerChoice = computerMove();
    addLogMessage(`${UIicons[gameChoiceMap[playerChoice]]} vs ${UIicons[gameChoiceMap[computerChoice]]}.`)
  };
  
  return {
    newGame,
    playerMove
  }
})()

// UI Vars
const UIGameBtns = document.querySelectorAll('.game-btn');
const UIGameScore = document.querySelector('#game-score');
const UIGameLog = document.querySelector('#gamelog-board');

const UIicons = {
  rock: '<i class="fa fa-hand-rock"></i>',
  paper: '<i class="fa fa-hand-paper"></i>',
  scissors: '<i class="fa fa-hand-scissors"></i>'
}

const UIBtnsIdMap = {
  'game-btn-rock': 1,
  'game-btn-paper': 2,
  'game-btn-scissors': 3
}

UIGameBtns.forEach(btn => btn.addEventListener('click', game.playerMove));

game.newGame();

