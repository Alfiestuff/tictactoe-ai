let board = Array(9).fill("");
let gameOver = false;

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

function render() {
  boardEl.innerHTML = "";

  board.forEach((v, i) => {
    const cell = document.createElement("div");
    cell.className = "cell " + (v === "X" ? "x" : v === "O" ? "o" : "");
    cell.textContent = v;
    cell.onclick = () => playerMove(i);
    boardEl.appendChild(cell);
  });
}

function playerMove(i) {
  if (board[i] || gameOver) return;

  board[i] = "X";

  if (checkEnd()) return;

  statusEl.textContent = "AI thinking...";
  setTimeout(aiMove, 80);
}

function aiMove() {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      let score = minimax(board, 0, false, -Infinity, Infinity);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = "O";
  checkEnd();
}

// 🧠 STRONG AI (Alpha-Beta Pruning)
function minimax(b, depth, isMax, alpha, beta) {
  const result = winner();

  if (result !== null) {
    if (result === "O") return 10 - depth;
    if (result === "X") return depth - 10;
    return 0;
  }

  if (isMax) {
    let best = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "O";
        let score = minimax(b, depth + 1, false, alpha, beta);
        b[i] = "";

        best = Math.max(best, score);
        alpha = Math.max(alpha, score);

        if (beta <= alpha) break;
      }
    }

    return best;
  } else {
    let best = Infinity;

    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "X";
        let score = minimax(b, depth + 1, true, alpha, beta);
        b[i] = "";

        best = Math.min(best, score);
        beta = Math.min(beta, score);

        if (beta <= alpha) break;
      }
    }

    return best;
  }
}

function winner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let [a,b,c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (!board.includes("")) return "draw";
  return null;
}

function checkEnd() {
  const res = winner();

  if (res) {
    gameOver = true;

    if (res === "draw") statusEl.textContent = "Draw";
    else if (res === "X") statusEl.textContent = "You win (impossible lol)";
    else statusEl.textContent = "AI wins";

    render();
    return true;
  }

  statusEl.textContent = "Your turn";
  render();
  return false;
}

function resetGame() {
  board = Array(9).fill("");
  gameOver = false;
  statusEl.textContent = "Your turn";
  render();
}

render();
