
const symbols = ["🌸", "💗", "🦋", "🍓", "🌷", "🍒", "⭐", "🎀"];

const board = document.getElementById("board");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");
const matchesDisplay = document.getElementById("matches");
const message = document.getElementById("message");

let firstCard = null;
let secondCard = null;
let locked = false;
let moves = 0;
let matches = 0;
let seconds = 0;
let timer = null;
let pendingFlip = null;

function startTimer() {
  if (timer !== null) return;

  timer = setInterval(() => {
    seconds++;
    timeDisplay.textContent = seconds;
  }, 1000);
}

function flipCard(card) {
  if (locked || card === firstCard ||
      card.classList.contains("matched")) return;

  startTimer();
  card.classList.add("flipped");
  card.textContent = card.dataset.symbol;

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesDisplay.textContent = moves;

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    matchesDisplay.textContent = matches;

    firstCard = null;
    secondCard = null;

    if (matches === symbols.length) {
      clearInterval(timer);
      timer = null;
      message.textContent =
        `You won! ${moves} moves in ${seconds} seconds! 🎉`;
    }
  } else {
    locked = true;
    pendingFlip = setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      firstCard = null;
      secondCard = null;
      locked = false;
      pendingFlip = null;
    }, 900);
  }
}

function newGame() {
  clearInterval(timer);
  clearTimeout(pendingFlip);
  timer = null;
  pendingFlip = null;
  firstCard = null;
  secondCard = null;
  locked = false;
  moves = 0;
  matches = 0;
  seconds = 0;

  movesDisplay.textContent = 0;
  matchesDisplay.textContent = 0;
  timeDisplay.textContent = 0;
  message.textContent = "";

  const cards = [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5);

  board.innerHTML = "";

  cards.forEach(symbol => {
    const card = document.createElement("button");
    card.className = "card";
    card.textContent = "?";
    card.dataset.symbol = symbol;
    card.setAttribute("aria-label", "Hidden memory card");
    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

document.getElementById("restart")
  .addEventListener("click", newGame);

newGame();
