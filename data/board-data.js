(function (global) {
  "use strict";

  const TrickalBoard = global.TrickalBoard = global.TrickalBoard || {};

  TrickalBoard.BOARDS = ["board1", "board2", "board3"];
  TrickalBoard.BOARD_LABELS = {
    board1: "board.board1",
    board2: "board.board2",
    board3: "board.board3"
  };
  TrickalBoard.BOARD_CRAYON_COSTS = {
    board1: 2,
    board2: 4,
    board3: 6
  };
  TrickalBoard.CRAYON_LABEL = "resource.specialCrayon";
  TrickalBoard.CELL_LABELS = {
    attack: "cell.attack",
    crit: "cell.crit",
    hp: "cell.hp",
    defense: "cell.defense",
    resistance: "cell.resistance"
  };
  TrickalBoard.TYPES = {
    1: {
      board1: ["attack", "defense"],
      board2: ["attack", "hp", "defense"],
      board3: ["attack", "crit", "hp", "resistance"]
    },
    2: {
      board1: ["attack", "hp"],
      board2: ["attack", "defense", "resistance"],
      board3: ["attack", "crit", "defense", "resistance"]
    },
    3: {
      board1: ["defense", "resistance"],
      board2: ["attack", "crit", "hp"],
      board3: ["attack", "hp", "defense", "resistance"]
    },
    4: {
      board1: ["crit", "hp"],
      board2: ["crit", "defense", "resistance"],
      board3: ["attack", "crit", "hp", "defense"]
    },
    5: {
      board1: ["crit", "resistance"],
      board2: ["crit", "hp", "resistance"],
      board3: ["crit", "hp", "defense", "resistance"]
    }
  };
})(window);
