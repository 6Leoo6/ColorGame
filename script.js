const difficultyList = ["Normal", "Medium", "Hard"];
var difficultySelect = document.getElementById("difficulty-select");
var currentDifficulty = 0;

function changeDifficulty() {
    currentDifficulty++;
    currentDifficulty %= difficultyList.length;
    difficultySelect.innerText = difficultyList[currentDifficulty];
}

const gameModeList = ["Basic"];
var gameModeSelect = document.getElementById("mode-select");
var currentGameMode = 0;

function changeGameMode() {
    currentGameMode++;
    currentGameMode %= gameModeList.length;
    gameModeSelect.innerText = gameModeList[currentGameMode];
}

const sizeList = ["2x2", "3x3", "4x4", "5x5", "6x6"];
var sizeSelect = document.getElementById("size-select");
var currentSize = 0;

function changeSize() {
    currentSize++;
    currentSize %= sizeList.length;
    sizeSelect.innerText = sizeList[currentSize];
    renderExampleGrid(currentSize + 2);
}

function startGame() {
    let url = new URL("/game.html", origin);
    url.searchParams.append("difficulty", currentDifficulty);
    url.searchParams.append("gridsize", currentSize+2);
    url.searchParams.append("mode", currentGameMode);
    console.log(url);
    location = url;
}

var exampleGrid = document.getElementById("example-grid");
var root = document.querySelector(":root");

function renderExampleGrid(size) {
    let maxGridWidth = Number(getComputedStyle(root).getPropertyValue("--max-grid-width").slice(0, -2));
    let cellSize = (maxGridWidth - (size - 1) * 4) / size;
    root.style.setProperty("--cell-size", `${cellSize}px`);

    exampleGrid.innerHTML = "";
    for (let i = 0; i < size; i++) {
        let row = document.createElement("div");
        row.className = "grid-row";

        for (let x = 0; x < size; x++) {
            let cell = document.createElement("div");
            cell.className = "grid-cell";

            row.appendChild(cell);
        }

        exampleGrid.appendChild(row);
    }

    let randomNumber = Math.floor(size * size * Math.random());
    document.querySelectorAll(".grid-cell").item(randomNumber).style.backgroundColor = "#8062D6";
}

renderExampleGrid(2);
