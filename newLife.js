var rows = 45;
var cols = 45;

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

let colorHashs = [
  "ff1f84",
  "cc00ad",
  "7400c2",
  "5600b8",
  "4400b3",
  "3400ad",
  "0d00ff",
  "3358ff",
  "3895ff",
  "3dd2ff",
  "E64D66",
  "4DB380",
];

let buttonIds = [
  "IL-2",
  "IFNg",
  "IFNa",
  "IL-4",
  "IL-6",
  "IL-8",
  "IL-10",
  "IL-12",
  "B-Cell",
  "T-Cell",
  "NK-Cell",
  "Tumor",
];
let colors = {};
buttonIds.forEach((buttonId, index) => {
  colors[buttonId] = colorHashs[index];
});

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

function changeLabelText(text) {
  document.getElementById("label").innerText = text;
}

function setupControlButtons() {
  // label buttons
  document.querySelectorAll(".label-button-groups button").forEach(
    (button) =>
      (button.onclick = () => {
        changeLabelText(button.innerText);
      })
  );

  // add cell buttons
  document.querySelectorAll(".add-cell-button-groups button").forEach(
    (button) =>
      (button.onclick = () => {
        let units_number = document.getElementById(button.id + "-input").value;
        addCellGroup(units_number, "#" + colors[button.id], button.id);
      })
  );

  // delete cell buttons
  document.querySelectorAll(".delete-btn").forEach(
    (button) =>
      (button.onclick = () => {
        let cell_id = button.id.replace("-delete", "");
        delete_cell_group(cell_id);
      })
  );
}

function delete_cell_group(cell_id) {
  let cells = document.querySelectorAll(`[cell*="${cell_id}"]`);
  cells.forEach((point) => {
    let i = point.id.split("_")[0];
    let j = point.id.split("_")[1];
    // remove background color from style
    point.style = "";
    grid[i][j] = 0;
  });
  updateView();
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
  while (grid[point[0]][point[1]] === 1) {
    point = selectRandomPoint();
  }
  return point;
}

function generateNeighbors(used_points) {
  let all_points = used_points
    .map((point) => {
      let starting_row = point[0];
      let starting_col = point[1];
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
    })
    .flat();

  let possible_points = all_points.filter(((t = {}), (a) => !(t[a] = a in t)));

  return possible_points;
}

function getValidPoints(points) {
  return points.filter((point) => {
    let point_element = document.getElementById(point[0] + "_" + point[1]);
    if (point_element) {
      if (grid[point[0]][point[1]] === 1) {
        return false;
      }

      return true;
    }

    return false;
  });
}

function addCellGroup(units_number, color, button_id) {
  let used_points = [];
  function innerFunc() {
    var start_point = selectValidRandomPoint();
    used_points.push(start_point);
    for (var u = 0; u < units_number - 1; u++) {
      let neighbors = generateNeighbors(used_points);
      let valid_neighbors = getValidPoints(neighbors);
      let selected_point =
        valid_neighbors[getRandomInt(valid_neighbors.length - 1)];

      let condition = used_points.some((use_point) => {
        if (
          use_point[0] == selected_point[0] &&
          use_point[1] == selected_point[1]
        ) {
          return true;
        }
        return false;
      });

      while (condition) {
        selected_point =
          valid_neighbors[getRandomInt(valid_neighbors.length - 1)];

        condition = used_points.some((use_point) => {
          if (
            use_point[0] == selected_point[0] &&
            use_point[1] == selected_point[1]
          ) {
            return true;
          }
          return false;
        });
      }

      used_points.push(selected_point);
    }
    used_points.forEach((use_point) => {
      let point_element = document.getElementById(
        use_point[0] + "_" + use_point[1]
      );
      point_element.style = "background-color: " + color;
      point_element.setAttribute("data-toggle", "tooltip");
      point_element.setAttribute("cell", button_id);
      point_element.setAttribute("title", button_id);
      $('[data-toggle="tooltip"]').tooltip();
      grid[use_point[0]][use_point[1]] = 1;
      updateView();
    });
  }
  innerFunc();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

// Start everything
window.onload = initialize;
