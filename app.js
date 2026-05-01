(function () {
  "use strict";

  const STORAGE_KEY = "trickal-board-tracker:v1";
  const LANGUAGE_STORAGE_KEY = "trickal-board-tracker:language";
  const STORAGE_VERSION = 2;
  const DEFAULT_LANGUAGE = "ja";
  const SUPPORTED_LANGUAGES = ["ja", "en", "zh-Hant"];

  const DATA = window.TrickalBoard || {};
  const {
    I18N,
    BOARDS,
    BOARD_LABELS,
    BOARD_CRAYON_COSTS,
    CRAYON_LABEL,
    CELL_LABELS,
    TYPES,
    CHARACTERS
  } = DATA;

  validateData();

  const CHARACTER_BY_ID = Object.fromEntries(CHARACTERS.map((character) => [character.id, character]));
  const CHARACTER_BY_NAME = Object.fromEntries(CHARACTERS.map((character) => [character.name, character]));

  function validateData() {
    const required = { I18N, BOARDS, BOARD_LABELS, BOARD_CRAYON_COSTS, CRAYON_LABEL, CELL_LABELS, TYPES, CHARACTERS };
    for (const [name, value] of Object.entries(required)) {
      if (!value) {
        throw new Error(`Missing TrickalBoard data: ${name}`);
      }
    }
    if (!Array.isArray(CHARACTERS)) {
      throw new Error("TrickalBoard.CHARACTERS must be an array.");
    }

    const ids = new Set();
    const names = new Set();
    for (const character of CHARACTERS) {
      if (!character || typeof character !== "object") {
        throw new Error("Every character must be an object.");
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(character.id || "")) {
        throw new Error(`Invalid character id: ${character.id}`);
      }
      if (ids.has(character.id)) {
        throw new Error(`Duplicate character id: ${character.id}`);
      }
      ids.add(character.id);

      if (!character.name || typeof character.name !== "string") {
        throw new Error(`Missing Japanese name for character id: ${character.id}`);
      }
      if (names.has(character.name)) {
        throw new Error(`Duplicate character name: ${character.name}`);
      }
      names.add(character.name);

      if (!TYPES[character.type]) {
        throw new Error(`Unknown board type for ${character.id}: ${character.type}`);
      }
      if (!character.names || typeof character.names !== "object") {
        throw new Error(`Missing localized names for ${character.id}`);
      }
    }
  }

  const elements = {
    rows: document.getElementById("characterRows"),
    rowTemplate: document.getElementById("rowTemplate"),
    emptyState: document.getElementById("emptyState"),
    summaryText: document.getElementById("summaryText"),
    statCards: document.getElementById("statCards"),
    boardStatsRows: document.getElementById("boardStatsRows"),
    cellStatsRows: document.getElementById("cellStatsRows"),
    matrixStatsRows: document.getElementById("matrixStatsRows"),
    pageTabButtons: Array.from(document.querySelectorAll("[data-page-tab]")),
    pagePanels: Array.from(document.querySelectorAll("[data-page-panel]")),
    statsBoardButtons: Array.from(document.querySelectorAll("[data-stats-board]")),
    sortHeaders: Array.from(document.querySelectorAll("[data-sort-column]")),
    searchInput: document.getElementById("searchInput"),
    boardFilter: document.getElementById("boardFilter"),
    cellFilter: document.getElementById("cellFilter"),
    ownedFilter: document.getElementById("ownedFilter"),
    upgradeFilter: document.getElementById("upgradeFilter"),
    statsCellFilter: document.getElementById("statsCellFilter"),
    statsOwnedFilter: document.getElementById("statsOwnedFilter"),
    exportState: document.getElementById("exportState"),
    importState: document.getElementById("importState"),
    resetState: document.getElementById("resetState"),
    languageSelect: document.getElementById("languageSelect"),
    markVisibleOwned: document.getElementById("markVisibleOwned"),
    markVisibleUnowned: document.getElementById("markVisibleUnowned")
  };

  let state = loadState();
  let visibleCharacters = [];
  let activeStatsBoard = "all";
  let currentLanguage = loadLanguage();
  let trackerSort = { column: "name", direction: "asc" };

  function loadLanguage() {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
  }

  function t(key, replacements = {}) {
    const value = I18N[currentLanguage][key] || I18N[DEFAULT_LANGUAGE][key] || key;
    return value.replace(/\{(\w+)\}/g, (match, name) => {
      return Object.prototype.hasOwnProperty.call(replacements, name) ? replacements[name] : match;
    });
  }

  function boardLabel(board) {
    return t(BOARD_LABELS[board]);
  }

  function cellLabel(cell) {
    return t(CELL_LABELS[cell]);
  }

  function characterName(character) {
    return (character.names && character.names[currentLanguage]) || character.name;
  }

  function displayNameCollator() {
    return new Intl.Collator(currentLanguage, { sensitivity: "base", numeric: true });
  }

  function compareDisplayNames(a, b) {
    return displayNameCollator().compare(characterName(a), characterName(b));
  }

  function boardUpgradeCount(character, board) {
    return ensureCharacterState(character.id).upgraded[board].length;
  }

  function compareCharacters(a, b) {
    const direction = trackerSort.direction === "desc" ? -1 : 1;
    let result = 0;

    if (trackerSort.column === "name") {
      result = compareDisplayNames(a, b);
    } else if (trackerSort.column === "owned") {
      result = Number(ensureCharacterState(a.id).owned) - Number(ensureCharacterState(b.id).owned);
    } else if (BOARDS.includes(trackerSort.column)) {
      result = boardUpgradeCount(a, trackerSort.column) - boardUpgradeCount(b, trackerSort.column);
    }

    if (result === 0) return compareDisplayNames(a, b);
    return result * direction;
  }

  function sortVisibleCharacters(characters) {
    return [...characters].sort(compareCharacters);
  }

  function setSort(column) {
    if (trackerSort.column === column) {
      trackerSort = {
        column,
        direction: trackerSort.direction === "asc" ? "desc" : "asc"
      };
    } else {
      trackerSort = { column, direction: "asc" };
    }
    render();
  }

  function updateSortHeaders() {
    for (const header of elements.sortHeaders) {
      const active = header.dataset.sortColumn === trackerSort.column;
      header.setAttribute("aria-sort", active ? (trackerSort.direction === "asc" ? "ascending" : "descending") : "none");

      const button = header.querySelector(".sort-button");
      if (!button) continue;

      const label = t(button.dataset.i18n);
      const indicator = active ? (trackerSort.direction === "asc" ? " ▲" : " ▼") : "";
      button.textContent = `${label}${indicator}`;
    }
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLanguage;
    document.title = t("app.title");
    for (const element of document.querySelectorAll("[data-i18n]")) {
      element.textContent = t(element.dataset.i18n);
    }
    for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    }
    elements.languageSelect.value = currentLanguage;
    updateSortHeaders();
  }

  function defaultCharacterState() {
    return {
      owned: false,
      upgraded: {
        board1: [],
        board2: [],
        board3: []
      }
    };
  }

  function ensureCharacterState(id) {
    if (!state.characters[id]) {
      state.characters[id] = defaultCharacterState();
    }
    return state.characters[id];
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return sanitizeState(parsed);
    } catch (error) {
      return { version: STORAGE_VERSION, characters: {} };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function sanitizeState(input) {
    const clean = { version: STORAGE_VERSION, characters: {} };
    if (
      !input ||
      (input.version !== 1 && input.version !== STORAGE_VERSION) ||
      !input.characters ||
      typeof input.characters !== "object" ||
      Array.isArray(input.characters)
    ) {
      return clean;
    }

    const version = input.version;
    for (const character of CHARACTERS) {
      const incoming = version === STORAGE_VERSION
        ? input.characters[character.id]
        : input.characters[character.name];
      if (!incoming || typeof incoming !== "object") continue;

      const next = defaultCharacterState();
      next.owned = Boolean(incoming.owned);
      for (const board of BOARDS) {
        const allowed = TYPES[character.type][board];
        const values = Array.isArray(incoming.upgraded && incoming.upgraded[board])
          ? incoming.upgraded[board]
          : [];
        next.upgraded[board] = values.filter((cell, index, array) => {
          return allowed.includes(cell) && array.indexOf(cell) === index;
        });
      }
      clean.characters[character.id] = next;
    }
    return clean;
  }

  function validateImportedState(input) {
    if (
      !input ||
      (input.version !== 1 && input.version !== STORAGE_VERSION) ||
      !input.characters ||
      typeof input.characters !== "object" ||
      Array.isArray(input.characters)
    ) {
      throw new Error(t("error.expectedExport"));
    }

    for (const [key, value] of Object.entries(input.characters)) {
      const character = input.version === STORAGE_VERSION ? CHARACTER_BY_ID[key] : CHARACTER_BY_NAME[key];
      if (!character) {
        throw new Error(t("error.unknownCharacter", { name: key }));
      }
      if (!value || typeof value !== "object" || typeof value.owned !== "boolean") {
        throw new Error(t("error.invalidCharacterState", { name: key }));
      }
      if (!value.upgraded || typeof value.upgraded !== "object" || Array.isArray(value.upgraded)) {
        throw new Error(t("error.invalidUpgradeState", { name: key }));
      }

      for (const board of BOARDS) {
        if (!Array.isArray(value.upgraded[board])) {
          throw new Error(t("error.missingBoard", { board: boardLabel(board), name: key }));
        }
        for (const cell of value.upgraded[board]) {
          if (!TYPES[character.type][board].includes(cell)) {
            throw new Error(t("error.invalidCell", { board: boardLabel(board), cell, name: key }));
          }
        }
      }
    }
  }

  function selectedValues(select) {
    return Array.from(select.selectedOptions).map((option) => option.value);
  }

  function setSelectedValues(select, values) {
    const valueSet = new Set(values);
    for (const option of select.options) {
      option.selected = valueSet.has(option.value);
    }
  }

  function replaceCellOptions(select, selected) {
    select.replaceChildren(...Object.keys(CELL_LABELS).map((key) => {
      return new Option(cellLabel(key), key, false, selected.includes(key));
    }));
  }

  function populateFilters() {
    const selectedCells = selectedValues(elements.cellFilter);
    const selectedStatsCells = selectedValues(elements.statsCellFilter);
    replaceCellOptions(elements.cellFilter, selectedCells);
    replaceCellOptions(elements.statsCellFilter, selectedStatsCells);
    setSelectedValues(elements.cellFilter, selectedCells);
    setSelectedValues(elements.statsCellFilter, selectedStatsCells);
  }

  function setLanguage(language) {
    currentLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    applyStaticTranslations();
    populateFilters();
    render();
  }

  function currentFilters() {
    return {
      search: elements.searchInput.value.trim().toLocaleLowerCase(currentLanguage),
      board: elements.boardFilter.value,
      cells: selectedValues(elements.cellFilter),
      owned: elements.ownedFilter.value,
      upgrade: elements.upgradeFilter.value
    };
  }

  function currentStatsFilters() {
    return {
      board: activeStatsBoard,
      cells: selectedValues(elements.statsCellFilter),
      owned: elements.statsOwnedFilter.value
    };
  }

  function visibleBoards(filter) {
    return filter.board === "all" ? BOARDS : [filter.board];
  }

  function visibleCellsFor(character, filter) {
    const cells = [];
    for (const board of visibleBoards(filter)) {
      for (const cell of TYPES[character.type][board]) {
        cells.push({ board, cell });
      }
    }
    return cells;
  }

  function matchingCellsFor(character, filter) {
    const visibleCells = visibleCellsFor(character, filter);
    if (!filter.cells.length) return visibleCells;
    return visibleCells.filter(({ cell }) => filter.cells.includes(cell));
  }

  function isUpgraded(character, board, cell) {
    return ensureCharacterState(character.id).upgraded[board].includes(cell);
  }

  function characterMatches(character, filter) {
    const characterState = ensureCharacterState(character.id);
    const query = filter.search;
    const searchableNames = [character.name, ...Object.values(character.names || {})];
    const matchesName = searchableNames.some((name) => {
      return name.toLocaleLowerCase(currentLanguage).includes(query);
    });
    if (query && !matchesName) return false;
    if (filter.owned === "owned" && !characterState.owned) return false;
    if (filter.owned === "unowned" && characterState.owned) return false;

    const matchingCells = matchingCellsFor(character, filter);
    if (!matchingCells.length) return false;

    const upgradedCount = matchingCells.filter(({ board, cell }) => isUpgraded(character, board, cell)).length;
    if (filter.upgrade === "has-upgraded" && upgradedCount === 0) return false;
    if (filter.upgrade === "has-unupgraded" && upgradedCount === matchingCells.length) return false;
    if (filter.upgrade === "fully-upgraded" && upgradedCount !== matchingCells.length) return false;
    return true;
  }

  function createStatsBucket(label) {
    return {
      label,
      total: 0,
      upgraded: 0,
      remaining: 0,
      spent: 0,
      needed: 0
    };
  }

  function addStatsCell(bucket, board, upgraded) {
    const cost = BOARD_CRAYON_COSTS[board];
    bucket.total += 1;
    if (upgraded) {
      bucket.upgraded += 1;
      bucket.spent += cost;
    } else {
      bucket.remaining += 1;
      bucket.needed += cost;
    }
  }

  function characterMatchesStats(character, filter) {
    const characterState = ensureCharacterState(character.id);
    if (filter.owned === "owned" && !characterState.owned) return false;
    if (filter.owned === "unowned" && characterState.owned) return false;
    return true;
  }

  function calculateStats() {
    const filter = currentStatsFilters();
    const boards = visibleBoards(filter);
    const cells = filter.cells.length ? filter.cells : Object.keys(CELL_LABELS);
    const totals = createStatsBucket("Total");
    const byBoard = Object.fromEntries(BOARDS.map((board) => [board, createStatsBucket(boardLabel(board))]));
    const byCell = Object.fromEntries(Object.keys(CELL_LABELS).map((cell) => [cell, createStatsBucket(cellLabel(cell))]));
    const matrix = {};

    for (const board of BOARDS) {
      matrix[board] = Object.fromEntries(
        Object.keys(CELL_LABELS).map((cell) => [cell, createStatsBucket(`${boardLabel(board)} ${cellLabel(cell)}`)])
      );
    }

    for (const character of CHARACTERS) {
      if (!characterMatchesStats(character, filter)) continue;
      for (const board of boards) {
        for (const cell of TYPES[character.type][board]) {
          if (!cells.includes(cell)) continue;
          const upgraded = isUpgraded(character, board, cell);
          addStatsCell(totals, board, upgraded);
          addStatsCell(byBoard[board], board, upgraded);
          addStatsCell(byCell[cell], board, upgraded);
          addStatsCell(matrix[board][cell], board, upgraded);
        }
      }
    }

    return { totals, byBoard, byCell, matrix, boards, cells };
  }

  function completionPercent(bucket) {
    if (!bucket.total) return "0%";
    return `${Math.round((bucket.upgraded / bucket.total) * 100)}%`;
  }

  function formatNumber(value) {
    return value.toLocaleString(currentLanguage);
  }

  function renderStats() {
    const stats = calculateStats();
    const resource = t(CRAYON_LABEL);
    const cards = [
      [t("stats.totalCells"), formatNumber(stats.totals.total)],
      [t("stats.upgraded"), formatNumber(stats.totals.upgraded)],
      [t("stats.remaining"), formatNumber(stats.totals.remaining)],
      [t("stats.spentResource", { resource }), formatNumber(stats.totals.spent)],
      [t("stats.neededResource", { resource }), formatNumber(stats.totals.needed)],
      [t("stats.complete"), completionPercent(stats.totals)]
    ];

    elements.statCards.replaceChildren(...cards.map(([label, value]) => {
      const card = document.createElement("div");
      card.className = "stat-card";
      const labelEl = document.createElement("span");
      labelEl.textContent = label;
      const valueEl = document.createElement("strong");
      valueEl.textContent = value;
      card.append(labelEl, valueEl);
      return card;
    }));

    elements.boardStatsRows.replaceChildren(...stats.boards.map((board) => {
      return renderStatsRow(stats.byBoard[board]);
    }));
    elements.cellStatsRows.replaceChildren(...stats.cells.map((cell) => {
      return renderStatsRow(stats.byCell[cell]);
    }));

    const matrixRows = [];
    for (const board of stats.boards) {
      for (const cell of stats.cells) {
        matrixRows.push(renderStatsRow(matrixLabelBucket(stats.matrix[board][cell], boardLabel(board), cellLabel(cell))));
      }
    }
    elements.matrixStatsRows.replaceChildren(...matrixRows);
  }

  function matrixLabelBucket(bucket, boardLabel, cellLabel) {
    return { ...bucket, label: boardLabel, sublabel: cellLabel };
  }

  function renderStatsRow(bucket) {
    const row = document.createElement("tr");
    const cells = [
      bucket.label,
      bucket.sublabel,
      formatNumber(bucket.total),
      formatNumber(bucket.upgraded),
      formatNumber(bucket.remaining),
      formatNumber(bucket.spent),
      formatNumber(bucket.needed)
    ].filter((value) => value !== undefined);

    for (const value of cells) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }
    return row;
  }

  function setPageTab(tab) {
    for (const button of elements.pageTabButtons) {
      button.classList.toggle("active", button.dataset.pageTab === tab);
    }
    for (const panel of elements.pagePanels) {
      const active = panel.dataset.pagePanel === tab;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    }
  }

  function setStatsBoard(board) {
    activeStatsBoard = board;
    for (const button of elements.statsBoardButtons) {
      button.classList.toggle("active", button.dataset.statsBoard === board);
    }
    renderStats();
  }

  function render() {
    const filter = currentFilters();
    renderStats();
    visibleCharacters = sortVisibleCharacters(CHARACTERS.filter((character) => characterMatches(character, filter)));
    elements.rows.replaceChildren(...visibleCharacters.map((character) => renderRow(character, filter)));
    elements.emptyState.hidden = visibleCharacters.length > 0;
    updateSortHeaders();

    const ownedCount = visibleCharacters.filter((character) => ensureCharacterState(character.id).owned).length;
    elements.summaryText.textContent = t("summary.visible", {
      visible: formatNumber(visibleCharacters.length),
      total: formatNumber(CHARACTERS.length),
      owned: formatNumber(ownedCount)
    });
  }

  function renderPreservingScroll() {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    render();
    requestAnimationFrame(() => {
      window.scrollTo(scrollX, scrollY);
    });
  }

  function renderRow(character, filter) {
    const fragment = elements.rowTemplate.content.cloneNode(true);
    const row = fragment.querySelector("tr");
    const characterState = ensureCharacterState(character.id);

    row.querySelector(".name-cell").textContent = characterName(character);

    const owned = document.createElement("label");
    owned.className = "owned-control";
    owned.title = t("table.owned");
    const ownedInput = document.createElement("input");
    ownedInput.type = "checkbox";
    ownedInput.checked = characterState.owned;
    ownedInput.addEventListener("change", () => {
      characterState.owned = ownedInput.checked;
      saveState();
      renderPreservingScroll();
    });
    owned.append(ownedInput);
    row.querySelector(".owned-cell").append(owned);

    for (const board of BOARDS) {
      const cell = row.querySelector(`[data-board="${board}"]`);
      cell.append(renderCellList(character, board));
    }

    return row;
  }

  function renderCellList(character, board) {
    const list = document.createElement("div");
    list.className = "cell-list";
    const available = TYPES[character.type][board];

    for (const cell of available) {
      const upgraded = isUpgraded(character, board, cell);
      const label = document.createElement("label");
      label.className = `cell-chip${upgraded ? " upgraded" : ""}`;
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = upgraded;
      checkbox.addEventListener("change", () => {
        setUpgrade(character, board, cell, checkbox.checked);
        saveState();
        renderPreservingScroll();
      });
      label.append(checkbox, document.createTextNode(cellLabel(cell)));
      list.append(label);
    }

    return list;
  }

  function setUpgrade(character, board, cell, upgraded) {
    const characterState = ensureCharacterState(character.id);
    const current = characterState.upgraded[board];
    if (upgraded && !current.includes(cell)) {
      current.push(cell);
    } else if (!upgraded) {
      characterState.upgraded[board] = current.filter((value) => value !== cell);
    }
  }

  function applyVisibleOwnership(owned) {
    for (const character of visibleCharacters) {
      ensureCharacterState(character.id).owned = owned;
    }
    saveState();
    render();
  }

  async function exportState() {
    const json = JSON.stringify(sanitizeState(state), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "trickal-board-tracker-state.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    try {
      await navigator.clipboard.writeText(json);
      elements.exportState.textContent = t("action.exportedCopied");
      window.setTimeout(() => {
        elements.exportState.textContent = t("action.export");
      }, 1600);
    } catch (error) {
      elements.exportState.textContent = t("action.exported");
      window.setTimeout(() => {
        elements.exportState.textContent = t("action.export");
      }, 1600);
    }
  }

  function importState(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        validateImportedState(parsed);
        state = sanitizeState(parsed);
        saveState();
        render();
      } catch (error) {
        alert(t("alert.importFailed", { message: error.message }));
      } finally {
        elements.importState.value = "";
      }
    });
    reader.readAsText(file);
  }

  function resetState() {
    if (!confirm(t("confirm.reset"))) return;
    state = { version: STORAGE_VERSION, characters: {} };
    saveState();
    render();
  }

  function bindEvents() {
    for (const input of [
      elements.searchInput,
      elements.boardFilter,
      elements.cellFilter,
      elements.ownedFilter,
      elements.upgradeFilter
    ]) {
      input.addEventListener("input", render);
      input.addEventListener("change", render);
    }

    for (const input of [
      elements.statsCellFilter,
      elements.statsOwnedFilter
    ]) {
      input.addEventListener("input", renderStats);
      input.addEventListener("change", renderStats);
    }

    for (const button of elements.pageTabButtons) {
      button.addEventListener("click", () => setPageTab(button.dataset.pageTab));
    }

    for (const button of elements.statsBoardButtons) {
      button.addEventListener("click", () => setStatsBoard(button.dataset.statsBoard));
    }

    for (const header of elements.sortHeaders) {
      const button = header.querySelector(".sort-button");
      if (!button) continue;
      button.addEventListener("click", () => setSort(header.dataset.sortColumn));
    }

    elements.exportState.addEventListener("click", exportState);
    elements.importState.addEventListener("change", () => importState(elements.importState.files[0]));
    elements.resetState.addEventListener("click", resetState);
    elements.languageSelect.addEventListener("change", () => setLanguage(elements.languageSelect.value));
    elements.markVisibleOwned.addEventListener("click", () => applyVisibleOwnership(true));
    elements.markVisibleUnowned.addEventListener("click", () => applyVisibleOwnership(false));
  }

  saveState();
  applyStaticTranslations();
  populateFilters();
  bindEvents();
  render();
})();
