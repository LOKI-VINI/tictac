

// Import confetti functions
import { startConfetti, stopConfetti, removeConfetti } from './confetti.js';




let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector(".reset-btn");
let playerName = ""; // Variable to store player's name

// Capture player name when submitted

document.getElementById("submit-name").onclick = () => {
    const nameInput = document.getElementById("player-name");
    playerName = nameInput.value.trim(); // Store the entered name
    nameInput.value = ""; 
    if (playerName) {
        startGame(); // Start the game only if a name is entered
    } else {
        alert("Please enter a valid name!"); // Optional: alert for empty input
    }
    resetGame();
};

document.querySelector(".newGame").onclick = () =>{
    const model = document.querySelector(".model1");
    const gameBoard = document.querySelector("body");
    model.style.display = "none";
    gameBoard.classList.remove("blur");
    resetGame();
}

function startGame() {
    const model = document.querySelector(".model");
    const gameBoard = document.querySelector("body");
    model.style.display = "none";
    gameBoard.classList.remove("blur");
    resetGame();
}

window.onload = function() {
    const model = document.querySelector(".model");
    const gameBoard = document.querySelector("body");
    model.style.display = "block";
    gameBoard.classList.add("blur");
}

// Game control logic true means players turn false means loki's turn
let turnO = true;

const winPattern = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];


const showWinner = (value) => {
    const model = document.querySelector(".model1");
    model.style.display = "block"; // Show the winning message
    const gameBoard = document.querySelector("body");
  
    gameBoard.classList.add("blur");
    const winnerMessage = document.getElementById("winner");
    startConfetti();
    if(value ==="O")
    winnerMessage.innerHTML = `Congratulations ${playerName}, you won the game!`;
    else
    winnerMessage.innerHTML = `Good efforts ${playerName}!, Loki wins this round`;
   
};


const checkWinner = () => {
    for (let pattern of winPattern) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val && pos1Val === pos2Val && pos2Val === pos3Val) {
            disableBoxes();
            showWinner(pos1Val);
            return true; // Stop checking once we found a winner
        }
    }
    if([...boxes].every((box) => box.innerText != "")){
        const model = document.querySelector(".model1");
        model.style.display = "block";
        const winnerMessage = document.getElementById("winner");
        winnerMessage.innerHTML = "it's a stalemate! Both played well.";
        return true;
    }

    return false;
};

const LokiMove = function(){
    let availableBoxes = [...boxes].filter(box => !box.disabled);
    if(availableBoxes.length > 0){
        let randamBox = availableBoxes[Math.floor(Math.random()*availableBoxes.length)];
        randamBox.innerHTML = "X";
        randamBox.disabled = true;
        if(!checkWinner()){
            turnO = true;
        }
    }else{
        checkWinner();
    }
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            box.innerHTML = "O";
            box.disabled = true;
            turnO = false;
           let haswinner= checkWinner();
            if(!haswinner){
                setTimeout(LokiMove, 500);
            }
        }
    });
});



const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
};

// Resetting the game
const resetGame = () => {
    turnO = true;
    enableBoxes();
    stopConfetti();
    removeConfetti();
};

resetBtn.addEventListener("click", resetGame);
