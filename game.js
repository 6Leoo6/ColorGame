var url = new URL(location);

var difficulty = url.searchParams.get("difficulty");
var gridSize = url.searchParams.get("gridsize");
var mode = url.searchParams.get("mode"); //Basic, Infinite

var timer = document.getElementById("countdown");
var timeRemaining = 3;

var correctCell = document.querySelector("*");
var grid = document.getElementById("grid");
var comparisonBoard = document.getElementById("comparison-board");
var allCells = document.querySelectorAll(".cell");
var loadOnGameOver = document.querySelectorAll("#game-over-div, #btn-container");
var root = document.querySelector(":root");
root.style.setProperty("--grid-size", gridSize.toString());

timer.innerText = timeRemaining;

var currentLevel = 0;

function decreaseTimer() {
    timeRemaining--;
    timer.innerText = timeRemaining == 0 ? "Start!" : timeRemaining;
    if (timeRemaining > 0) {
        setTimeout(decreaseTimer, 1000);
    } else {
        setTimeout(createBoard, 1000);
    }
}

function checkIfCorrect(e) {
    let cell = e.srcElement;
    if (cell.classList.contains("correct-cell")) {
        nextRound();
    } else {
        gameOver(0, cell);
    }
}

function gameOver(type = 0, wrongCell = null) {
    //Type: Wrong, Time
    if (mode == 0) {
        //Basic
        console.log("Game Over");
        if (type === 0) {
            allCells.forEach((e) => {
                e.classList.add("hidden-comparison");
            });

            wrongCell.classList.add("incorrect-comparison");
            correctCell.classList.add("correct-comparison");

            loadOnGameOver.forEach((el) => {
                el.classList.add("game-over");
            });
        }
    }
}

function playAgain() {
    loadOnGameOver.forEach((el) => {
        el.classList.remove("game-over");
    });

    document.querySelector(".incorrect-comparison").classList.remove("incorrect-comparison");
    document.querySelector(".correct-comparison").classList.remove("correct-comparison");

    allCells.forEach((e) => {
        e.classList.remove("hidden-comparison")
    })

    currentLevel = 0;
    nextRound()
}

function createBoard() {
    timer.remove();
    grid.innerHTML = "";

    for (let y = 0; y < gridSize; y++) {
        let row = document.createElement("div");
        row.className = "row";

        for (let x = 0; x < gridSize; x++) {
            let cellContainer = document.createElement("div");
            cellContainer.className = "cell-container";

            let cell = document.createElement("div");
            cell.className = "cell";
            cell.addEventListener("click", checkIfCorrect);

            cellContainer.appendChild(cell);
            row.appendChild(cellContainer);
        }

        grid.appendChild(row);
    }

    allCells = document.querySelectorAll(".cell");
    nextRound();
}

function nextRound(levelWhenCalled = -1) {
    if (levelWhenCalled !== -1 && levelWhenCalled !== currentLevel) {
        return;
    } else if (levelWhenCalled == currentLevel) {
        gameOver(1);
        return;
    }
    currentLevel++;

    let hsl = generateColors();
    allCells.forEach((e) => {
        e.style.backgroundColor = `hsl(${hsl[0]}deg, ${hsl[1]}%, ${hsl[2]}%)`;
        e.className = "cell";
        e.classList.add("incorrect-cell");
    });

    correctCell = selectRandomCell();
    correctCell.classList.remove("incorrect-cell");
    correctCell.classList.add("correct-cell");
    let darkenedColor = darkenColor(hsl);
    correctCell.style.backgroundColor = `hsl(${darkenedColor[0]}deg, ${darkenedColor[1]}%, ${darkenedColor[2]}%)`;

    setTimeout(nextRound, 5000, currentLevel);
}

function generateColors() {
    let h = Math.floor(Math.random() * 359);
    let s = Math.floor(Math.random() * 50) + 50;
    let l = Math.floor(Math.random() * 35) + 40;

    return [h, s, l];
}

function HSLToRGB(hsl) {
    let [h, s, l] = hsl;

    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}

function convertToGrayScale(hsl) {
    let sum = 0;
    HSLToRGB(hsl).forEach((e) => (sum += e));
    return Math.round(sum / 3);
}

function darkenColor(hsl) {
    let [h, s, l] = hsl;

    let amount = 20;
    l += convertToGrayScale(hsl) < 128 ? amount : -amount;

    return [h, s, l];
}

function selectRandomCell() {
    return allCells.item(Math.floor(Math.random() * allCells.length));
}

setTimeout(decreaseTimer, 1000);
