const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const currentRound = document.getElementById("current-round");
const currentRoundRolls = document.getElementById("current-round-rolls");
const totalScore = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesBtn = document.getElementById("rules-btn");
const rulesContainer = document.querySelector(".rules-container");

let isModalShowing = false;
let diceValuesArr = [];
let rolls = 0;
let score = 0;
let total = 0;
let round = 1;

const rollDice = () => {
    diceValuesArr = [];
    for (let i = 0; i < 5; i++) {
        diceValuesArr.push(Math.ceil(Math.random() * 6));
        diceValuesArr.sort((a, b) => a - b);
    }
    listOfAllDice.forEach((die, index) => {
        die.textContent = diceValuesArr[index];
    });
}

const updateStats = () => {
    currentRound.textContent = round;
    currentRoundRolls.textContent = rolls;
}

const updateRadioOption = (index, score) => {
    scoreInputs[index].disabled = false;
    scoreInputs[index].value = score;
    scoreSpans[index].textContent = `, score = ${score}`;
}

const getHighestDuplicates = (arr) => {
    let sum = diceValuesArr.reduce((acc, currVal) => acc + currVal, 0);
    let duplicates = {};
    // logic for counting dupes
    diceValuesArr.forEach((num) => {
        duplicates[num] ? (duplicates[num] += 1) : (duplicates[num] = 1)
    })

    for (const duplicate in duplicates) {
        // 4 of a kind logic
        if (duplicate.valueOf(4)) {
            updateRadioOption(1, sum)
        // 3 of a kind logic
        } else if (duplicate.valueOf(3)) {
            updateRadioOption(1, sum)
        } else {
            updateRadioOption(5, 0)
        }
    }
  }

rollDiceBtn.addEventListener("click", () => {
    if (rolls === 3) {
        alert("You have made three rolls this round. Please select a score before rolling again.")
    } else {
        rolls++;
        rollDice();
        updateStats();
    }
});

rulesBtn.addEventListener("click", () => {
    isModalShowing = !isModalShowing;
    rulesContainer.style.display = isModalShowing ? "block" : "none";
    rulesBtn.textContent = isModalShowing ? "Hide Rules" : "Show Rules";
});
