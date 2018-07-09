// Vars
const UIGameBtns = document.querySelectorAll('.game-btn');
const UIGameScore = document.querySelector('#game-score');
const UIGameLog = document.querySelector('#gamelog-board');

UIGameBtns.forEach(btn => btn.addEventListener('click', function() {
  console.log(this.id);
}));