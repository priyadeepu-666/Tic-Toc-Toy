const boardElem = document.getElementById('board');
const statusElem = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const modeBtn = document.getElementById('mode');

let board = Array(9).fill(null);
let xIsNext = true;
let vsComputer = false;
let gameOver = false;

const winningLines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

boardElem.addEventListener('click', handleClick);
restartBtn.addEventListener('click', init);
modeBtn.addEventListener('click', switchMode);

init();

function init(){
  board.fill(null);
  xIsNext = true;
  gameOver = false;
  statusElem.textContent = "Next: “X”";
  render();
}

function switchMode(){
  vsComputer = !vsComputer;
  modeBtn.textContent = vsComputer ? 'Mode: Human vs Computer' : 'Mode: Human vs Human';
  init();
}

function handleClick(e){
  if (gameOver) return;

  const idx = e.target.dataset.index;
  if (idx === undefined || board[idx]) return;

  makeMove(idx, xIsNext ? 'X' : 'O');

  if (!gameOver && vsComputer && !xIsNext) {
    setTimeout(computerMove, 300);
  }
}

function makeMove(idx, player){
  board[idx] = player;
  render();

  const winner = checkWinner();
  if (winner){
    statusElem.textContent = winner === 'Draw' ? "It's a draw!" : `${winner} wins!`;
    gameOver = true;
  } else {
    xIsNext = !xIsNext;
    statusElem.textContent = `Next: ${xIsNext ? 'X' : 'O'}`;
  }
}

function computerMove(){
  const empty = board.map((v,i) => v===null?i:null).filter(v => v!==null);
  const idx = empty[Math.floor(Math.random()*empty.length)];
  makeMove(idx, 'O');
}

function checkWinner(){
  for (let line of winningLines){
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]){
      return board[a];
    }
  }
  if (board.every(cell => cell !== null)){
    return 'Draw';
  }
  return null;
}

function render(){
  boardElem.querySelectorAll('.cell').forEach(cell => {
    const i = cell.dataset.idx || cell.dataset.index;
    cell.textContent = board[cell.dataset.index];
  });
}
