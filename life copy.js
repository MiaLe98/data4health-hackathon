var rows = 38;
var cols = 100;

var playing = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

var timer;
var reproductionTime = 100;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function initializeGrids() {
  for (var i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

function resetGrids() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}

function copyAndResetGrid() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

// Initialize
function initialize() {
  createTable();
  initializeGrids();
  resetGrids();
  setupControlButtons();
}

// Lay out the board
function createTable() {
  var gridContainer = document.getElementById("gridContainer");
  if (!gridContainer) {
    // Throw error
    console.error("Problem: No div for the drid table!");
  }
  var table = document.createElement("table");

  for (var i = 0; i < rows; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < cols; j++) {
      //
      var cell = document.createElement("td");
      cell.setAttribute("id", i + "_" + j);
      cell.setAttribute("class", "dead");
      cell.onclick = cellClickHandler;
      tr.appendChild(cell);
    }
    table.appendChild(tr);
  }
  gridContainer.appendChild(table);
}

function cellClickHandler() {
  var rowcol = this.id.split("_");
  var row = rowcol[0];
  var col = rowcol[1];

  var classes = this.getAttribute("class");
  if (classes.indexOf("live") > -1) {
    this.setAttribute("class", "dead");
    grid[row][col] = 0;
  } else {
    this.setAttribute("class", "live");
    grid[row][col] = 1;
  }
}

function updateView() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var cell = document.getElementById(i + "_" + j);
      if (grid[i][j] == 0) {
        cell.setAttribute("class", "dead");
      } else {
        cell.setAttribute("class", "live");
      }
    }
  }
}

function setupControlButtons() {
  // button to start
  var startButton = document.getElementById("start");
  startButton.onclick = startButtonHandler;

  // button to clear
  var clearButton = document.getElementById("clear");
  clearButton.onclick = clearButtonHandler;

  // button to set random initial state
  var randomButton = document.getElementById("random");
  randomButton.onclick = randomButtonHandler;

  //input to set cell numbers
  var input_number = document.getElementById("units_number");
  input_number.onchange = inputNumberOnChange;

  // button to add cell groups
  var cellGroupButton = document.getElementById("add_cell_group");
  cellGroupButton.onclick = addCellGroup;
}

function inputNumberOnChange(e) {
  if (e.target.value < 2 || e.target.value > 5) {
    document.getElementById("error_unit_number").style =
      "display: block; color : red";
    document.getElementById("add_cell_group").disabled = true;
  } else {
    document.getElementById("error_unit_number").style = "display: none";
    document.getElementById("add_cell_group").disabled = false;
  }
}
function randomButtonHandler() {
  if (playing) return;
  clearButtonHandler();
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var isLive = Math.round(Math.random());
      if (isLive == 1) {
        var cell = document.getElementById(i + "_" + j);
        cell.setAttribute("class", "live");
        grid[i][j] = 1;
      }
    }
  }
}

// clear the grid
function clearButtonHandler() {
  console.log("Clear the game: stop playing, clear the grid");

  playing = false;
  var startButton = document.getElementById("start");
  startButton.innerHTML = "Start";
  clearTimeout(timer);

  var cellsList = document.getElementsByClassName("live");
  // convert to array first, otherwise, you're working on a live node list
  // and the update doesn't work!
  var cells = [];
  for (var i = 0; i < cellsList.length; i++) {
    cells.push(cellsList[i]);
  }

  for (var i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "dead");
  }
  resetGrids;
}

// start/pause/continue the game
function startButtonHandler() {
  if (playing) {
    console.log("Pause the game");
    playing = false;
    this.innerHTML = "Continue";
    clearTimeout(timer);
  } else {
    console.log("Continue the game");
    playing = true;
    this.innerHTML = "Pause";
    play();
  }
}

function selectRandomPoint() {
  var starting_row = getRandomInt(rows); //i
  var starting_col = getRandomInt(cols); //j
  //   var starting_cell = document.getElementById(
  //     starting_row + "_" + starting_col
  //   );
  return [starting_row, starting_col];
}

function selectValidRandomPoint() {
  var point = selectRandomPoint();
  var point_element = document.getElementById(point[0] + "_" + point[1]);
  while (point_element.getAttribute["class"] == "live") {
    point = selectRandomPoint();
    point_element = document.getElementById(point[0] + "_" + point[1]);
  }
  return point;
}

function generateNeighbors(starting_point) {
  let starting_row = starting_point[0];
  let starting_col = starting_point[1];
  let neighbors = [
    [starting_row - 1, starting_col],
    [starting_row - 1, starting_col - 1],
    [starting_row - 1, starting_col + 1],
    [starting_row, starting_col + 1],
    [starting_row, starting_col - 1],
    [starting_row + 1, starting_col],
    [starting_row + 1, starting_col + 1],
    [starting_row + 1, starting_col - 1],
  ];
  return neighbors;
}

function getValidPoints(points) {
  return points.filter((point) => {
    let point_element = document.getElementById(point[0] + "_" + point[1]);
    if (point_element) {
      if (point_element.getAttribute["class"] == "live") {
        return false;
      }
      return true;
    }
    return false;
  });
}

function getRandomColor() {
  let colors_array = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
  ];
  let color = colors_array[getRandomInt(colors_array.length - 1)];
  return color;
}

let used_points = [];
function addCellGroup() {
  var start_point = selectValidRandomPoint();
  used_points.push(start_point);

  units_number = document.getElementById("units_number").value;
  //   document.getElementById("display_cell_name").style = "display: block";
  if (playing) return;
  clearButtonHandler();
  for (var u = 0; u < units_number - 1; u++) {
    console.log("a");
    let neighbors = generateNeighbors(start_point);
    let valid_neighbors = getValidPoints(neighbors);

    let selected_point =
      valid_neighbors[getRandomInt(valid_neighbors.length - 1)];
    while (
      Boolean(
        used_points.find((use_point) => {
          if (
            use_point[0] == selected_point[0] &&
            use_point[1] == selected_point[1]
          ) {
            return true;
          }
          return false;
        })
      )
    ) {
      selected_point =
        valid_neighbors[getRandomInt(valid_neighbors.length - 1)];
    }

    used_points.push(selected_point);
  }
  let color = getRandomColor();
  used_points.forEach((use_point) => {
    let point_element = document.getElementById(
      use_point[0] + "_" + use_point[1]
    );

    point_element.style = "background-color: " + color;
    grid[use_point[0]][use_point[1]] = 1;
  });
  updateView();
}

// run the life game
function play() {
  computeNextGen();

  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
}

function computeNextGen() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }

  // copy NextGrid to grid, and reset nextGrid
  copyAndResetGrid();
  // copy all 1 values to "live" in the table
  updateView();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

function applyRules(row, col) {
  var numNeighbors = countNeighbors(row, col);
  if (grid[row][col] == 1) {
    if (numNeighbors < 2) {
      nextGrid[row][col] = 0;
    } else if (numNeighbors == 2 || numNeighbors == 3) {
      nextGrid[row][col] = 1;
    } else if (numNeighbors > 3) {
      nextGrid[row][col] = 0;
    }
  } else if (grid[row][col] == 0) {
    if (numNeighbors == 3) {
      nextGrid[row][col] = 1;
    }
  }
}

function countNeighbors(row, col) {
  var count = 0;
  if (row - 1 >= 0) {
    if (grid[row - 1][col] == 1) count++;
  }
  if (row - 1 >= 0 && col - 1 >= 0) {
    if (grid[row - 1][col - 1] == 1) count++;
  }
  if (row - 1 >= 0 && col + 1 < cols) {
    if (grid[row - 1][col + 1] == 1) count++;
  }
  if (col - 1 >= 0) {
    if (grid[row][col - 1] == 1) count++;
  }
  if (col + 1 < cols) {
    if (grid[row][col + 1] == 1) count++;
  }
  if (row + 1 < rows) {
    if (grid[row + 1][col] == 1) count++;
  }
  if (row + 1 < rows && col - 1 >= 0) {
    if (grid[row + 1][col - 1] == 1) count++;
  }
  if (row + 1 < rows && col + 1 < cols) {
    if (grid[row + 1][col + 1] == 1) count++;
  }
  return count;
}

// Start everything
window.onload = initialize;
