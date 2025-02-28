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
    }
    listOfAllDice.forEach((die, index) => {
        die.textContent = diceValuesArr[index];
    });
};

const updateStats = () => {
    currentRound.textContent = round;
    currentRoundRolls.textContent = rolls;
};

const updateRadioOption = (index, score) => {
    scoreInputs[index].disabled = false;
    scoreInputs[index].value = score;
    scoreSpans[index].textContent = `, score = ${score}`;
};

const updateScore = (selectedValue, achieved) => {
    score += parseInt(selectedValue);
    totalScore.textContent = score;
    scoreHistory.innerHTML += `<li>${achieved}: ${selectedValue}</li>`;
};

const getHighestDuplicates = (arr) => {
    let sum = arr.reduce((acc, currVal) => acc + currVal, 0);
    let duplicates = {};
    arr.forEach((num) => {
        duplicates[num] ? (duplicates[num] += 1) : (duplicates[num] = 1);
    });
    for (const num in duplicates) {
        if (duplicates[num] >= 4) {
            updateRadioOption(1, sum);
            updateRadioOption(0, sum);
        } else if (duplicates[num] === 3) {
            updateRadioOption(0, sum);
        } else {
            updateRadioOption(5, 0);
        }
    }
};

const detectFullHouse = (arr) => {
    const counts = {};
    arr.forEach((num) => {
        counts[num] ? (counts[num] += 1) : (counts[num] = 1);
    });
    for (const num in counts) {
        if (counts[num] === 3) {
            for (const num in counts) {
                if (counts[num] === 2) {
                    updateRadioOption(2, 25);
                }
            }
        } else {
            updateRadioOption(5, 0);
        }
    }
};

const resetRadioOptions = () => {
    scoreInputs.forEach((input) => {
        input.disabled = true;
        input.checked = false;
    });
    scoreSpans.forEach((span) => {
        span.textContent = "";
    });
};

const resetGame = () => {
    listOfAllDice.forEach((die) => {
        die.textContent = "0";
    });
    diceValuesArr = [0, 0, 0, 0, 0];
    score = 0;
    rolls = 0;
    round = 1;
    totalScore.textContent = "0";
    scoreHistory.textContent = "";
    currentRound.textContent = round;
};

const checkForStraights = (arr) => {
    arr.sort((a, b) => a - b);
    let count = 0;
    for (let i = 0; i <= arr.length; i++) {
        if (arr[i] + 1 === arr[i + 1] || arr[-i - 1] === arr[i]) {
            count++;
            if (count === 5) {
                updateRadioOption(3, 30); // small straight
                updateRadioOption(4, 40); // large straight
            } else if (count === 4) {
                updateRadioOption(3, 30); // small straight
            }
        } else {
            updateRadioOption(5, 0); // no straight
        }
    }
};

rollDiceBtn.addEventListener("click", () => {
    if (rolls === 3) {
        alert(
            "You have made three rolls this round. Please select a score before rolling again."
        );
    } else {
        rolls++;
        resetRadioOptions();
        rollDice();
        updateStats();
        getHighestDuplicates(diceValuesArr);
        detectFullHouse(diceValuesArr);
        checkForStraights(diceValuesArr);
    }
});

rulesBtn.addEventListener("click", () => {
    isModalShowing = !isModalShowing;
    rulesContainer.style.display = isModalShowing ? "block" : "none";
    rulesBtn.textContent = isModalShowing ? "Hide Rules" : "Show Rules";
});

keepScoreBtn.addEventListener("click", () => {
    let selectedValue;
    let achieved;
    for (const input of scoreInputs) {
        if (input.checked) {
            selectedValue = input.value;
            achieved = input.id;
            break;
        }
    }
    if (selectedValue) {
        rolls = 0;
        round++;
        updateStats();
        resetRadioOptions();
        updateScore(selectedValue, achieved);
        if (round > 6) {
            setTimeout(() => {
                alert(`Final score: ${score}`);
                resetGame();
            }, 500);
        }
    } else {
        alert("Please select a score to keep or roll again");
    }
});
