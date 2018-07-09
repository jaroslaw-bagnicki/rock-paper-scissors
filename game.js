'use strict'

const game = (function () {
  let gameScore = {};

  // PRIV scoreRefresh method 
  function scoreRefresh () {
    UIGameScore.innerHTML = `${gameScore.player} : ${gameScore.computer}`
  };

  // PRIV addLogMessage method 
  function addLogMessage (message) {
    UIGameLog.insertAdjacentHTML('afterbegin',`[${new Date().toLocaleTimeString()}] ${message} <br>`);
    scoreRefresh();
  }
  
  // PUBLIC newGame method
  function newGame () {
    gameScore.player = gameScore.computer = 0;
    scoreRefresh();
    addLogMessage('Game started.');
  };

  // PUBLIC playerMove method
  function playerMove () {
    addLogMessage(this.id);
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

UIGameBtns.forEach(btn => btn.addEventListener('click', game.playerMove));

game.newGame();

