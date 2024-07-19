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
    scoreInputs[index].disabled = !scoreInputs[index].disabled;
    scoreInputs[index].value = score;
    scoreSpans[index].textContent = `, score = ${score}`;
}

const getHighestDuplicates = (arr) => {
    let sum = arr.reduce((acc, currVal) => acc + currVal, 0);
    let duplicates = {};
    arr.forEach((num) => {
        duplicates[num] ? (duplicates[num] += 1) : (duplicates[num] = 1)
    })
    for (let num in duplicates) {
        if (duplicates[num] >= 4) {
            updateRadioOption(1, sum)
            updateRadioOption(0, sum)
        } else if (duplicates[num] === 3) {
            updateRadioOption(0, sum)
        } else {
            updateRadioOption(5, 0)
        }
    }
}
  
const resetRadioOptions = () => {
    scoreInputs.forEach((input) => {
        input.disabled = true;
        input.checked = false;
    })
    scoreSpans.forEach((span) => {
        span.textContent = "";
    })
}

rollDiceBtn.addEventListener("click", () => {
    if (rolls === 3) {
        alert("You have made three rolls this round. Please select a score before rolling again.")
    } else {
        resetRadioOptions();
        rolls++;
        rollDice();
        updateStats();
        getHighestDuplicates(diceValuesArr);
    }
});

rulesBtn.addEventListener("click", () => {
    isModalShowing = !isModalShowing;
    rulesContainer.style.display = isModalShowing ? "block" : "none";
    rulesBtn.textContent = isModalShowing ? "Hide Rules" : "Show Rules";
});
