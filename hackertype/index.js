// DOM Elements
const displayElement = document.getElementById("textDisplay");
const inputElement = document.getElementById("textInput");
const timeNameElement = document.getElementById("timeName");
const timeElement = document.getElementById("time");
const cwNameElement = document.getElementById("cwName");
const cwElement = document.getElementById("cw");
const restartButtonElement = document.getElementById("restartBtn");
const fifteenButton = document.getElementById("fifteen");
const thirtyButton = document.getElementById("thirty");
const sixtyButton = document.getElementById("sixty");
const easyButton = document.getElementById("easy");
const hardButton = document.getElementById("hard");

// Test Variables
let currentWordNo = 1;
let wordsSubmittedCount = 0;
let wordsCorrectCount = 0;
let countdownTimer = 15;
let timerFlag = 0;
let timerInterval;
let difficultyLevel = 1;

// Initial display of test based on difficulty level
displayTest(difficultyLevel);

// Event listeners
inputElement.addEventListener('input', handleInput);
fifteenButton.addEventListener("click", () => setTimer(15, 3, fifteenButton, thirtyButton, sixtyButton))
thirtyButton.addEventListener("click", () => setTimer(30, 2, thirtyButton, sixtyButton, fifteenButton));
sixtyButton.addEventListener("click", () => setTimer(60, 1, sixtyButton, thirtyButton, fifteenButton));
easyButton.addEventListener("click", () => setDifficulty(1, easyButton, hardButton));
hardButton.addEventListener("click", () => setDifficulty(2, hardButton, easyButton));
restartButtonElement.addEventListener("click", restartTest);

/**
 * Event handler for user input in the text field.
 * Checks if a space is entered to determine if a word is complete,
 * and calls corresponding functions.
 * @param {Event} event - Input event object
 */
function handleInput(event) {
  if (timerFlag === 0) {
    timerFlag = 1;
    startTimer();
  }

  const enteredChar = event.data;
  /\s/g.test(enteredChar) ? checkWord() : currentWord();
}

/**
 * Sets the countdown timer and interval factor based on user selection.
 * @param {number} newTimer - Countdown timer value
 * @param {number} newFactor - Interval factor for the timer
 * @param {HTMLElement} selectedButton - Button selected by the user
 * @param {HTMLElement} unselectedButton1 - Button not selected by the user (1)
 * @param {HTMLElement} unselectedButton2 - Button not selected by the user (2)
 */
function setTimer(newTimer, newFactor, selectedButton, unselectedButton1, unselectedButton2) {
  countdownTimer = newTimer;
  timerInterval = newFactor;
  toggleButtonColor(selectedButton, unselectedButton1, unselectedButton2);
  timeElement.innerText = countdownTimer;
}

/**
 * Sets the difficulty level and updates the test display.
 * @param {number} newDifficulty - Difficulty level (1 for basic, 2 for advanced)
 * @param {HTMLElement} selectedButton - Button selected by the user
 * @param {HTMLElement} unselectedButton - Button not selected by the user
 */
function setDifficulty(newDifficulty, selectedButton, unselectedButton) {
  difficultyLevel = newDifficulty;
  displayTest(difficultyLevel);
  toggleButtonColor(selectedButton, unselectedButton);
}

/**
 * Toggles the color of selected and unselected buttons.
 * @param {HTMLElement} selectedButton - Button selected by the user
 * @param {HTMLElement} unselectedButton1 - Button not selected by the user (1)
 * @param {HTMLElement} unselectedButton2 - Button not selected by the user (2)
 */
function toggleButtonColor(selectedButton, unselectedButton1, unselectedButton2) {
  selectedButton.classList.add('green');
  unselectedButton1.classList.remove('green');
  unselectedButton2.classList.remove('green');
}

/**
 * Resets the test to its initial state.
 */
function restartTest() {
  wordsSubmittedCount = 0;
  wordsCorrectCount = 0;
  timerFlag = 0;

  timeElement.classList.remove("current");
  cwElement.classList.remove("current");
  timeElement.innerText = countdownTimer;
  timeNameElement.innerText = "Time";
  cwElement.innerText = wordsCorrectCount;
  cwNameElement.innerText = "CW";
  inputElement.disabled = false;
  inputElement.value = '';
  inputElement.focus();

  displayTest(difficultyLevel);
  clearInterval(timerInterval);
  showButtons();
}

/**
 * Starts the countdown timer and hides difficulty buttons.
 */
function startTimer() {
  hideButtons();
  timerInterval = setInterval(() => {
    timeElement.innerText--;
    if (timeElement.innerText == "-1") {
      timeIsOver();
      clearInterval(timerInterval);
    }
  }, 1000);
}

/**
 * Handles actions when the time is over.
 * Disables input, focuses on the restart button, and displays the score.
 */
function timeIsOver() {
  inputElement.disabled = true;
  restartButtonElement.focus();
  displayScore();
}

/**
 * Hides difficulty buttons.
 */
function hideButtons() {
  [thirtyButton, sixtyButton, easyButton, hardButton].forEach(button => button.style.visibility = 'hidden');
}

/**
 * Shows difficulty buttons.
 */
function showButtons() {
  [thirtyButton, sixtyButton, easyButton, hardButton].forEach(button => button.style.visibility = 'visible');
}

/**
 * Displays the final score after the test is completed.
 */
function displayScore() {
  const accuracyPercentage = wordsSubmittedCount !== 0 ? Math.floor((wordsCorrectCount / wordsSubmittedCount) * 100) : 0;

  timeElement.classList.add("current");
  cwElement.classList.add("current");

  timeElement.innerText = accuracyPercentage + "%";
  timeNameElement.innerText = "PA";

  // Calculate WPM based on wordsCorrectCount and countdownTimer
  const wpm = Math.round((wordsCorrectCount / countdownTimer) * 60);
  cwElement.innerText = wpm;
  cwNameElement.innerText = "WPM";
}

/**
 * Handles the current word's input for color coding.
 */
function currentWord() {
  const enteredWord = inputElement.value;
  const currentWordID = "word " + currentWordNo;
  const currentWordSpan = document.getElementById(currentWordID);
  const currentSpanWord = currentWordSpan.innerText;

  if (enteredWord == currentSpanWord.substring(0, enteredWord.length)) {
    colorWordSpan(currentWordID, 2);
  } else {
    colorWordSpan(currentWordID, 3);
  }
}

/**
 * Checks the entered word against the correct word and updates the score.
 */
function checkWord() {
  const enteredWord = inputElement.value;
  inputElement.value = '';

  const wordID = "word " + currentWordNo;
  const checkWordSpan = document.getElementById(wordID);
  currentWordNo++;
  wordsSubmittedCount++;

  if (checkWordSpan.innerText === enteredWord) {
    colorWordSpan(wordID, 1);
    wordsCorrectCount++;
    cwElement.innerText = wordsCorrectCount;
  } else {
    colorWordSpan(wordID, 3);
  }

  if (currentWordNo > 40) {
    displayTest(difficultyLevel);
  } else {
    const nextWordID = "word " + currentWordNo;
    colorWordSpan(nextWordID, 2);
  }
}

/**
 * Colors the word span based on correctness (correct, current, or wrong).
 * @param {string} id - ID of the word span element
 * @param {number} color - Color code (1 for correct, 2 for current, 3 for wrong)
 */
function colorWordSpan(id, color) {
  const spanElement = document.getElementById(id);
  if (color === 1) {
    spanElement.classList.remove('wrong', 'current');
    spanElement.classList.add('correct');
  } else if (color === 2) {
    spanElement.classList.remove('correct', 'wrong');
    spanElement.classList.add('current');
  } else {
    spanElement.classList.remove('correct', 'current');
    spanElement.classList.add('wrong');
  }
}

/**
 * Generates a new test based on the selected difficulty level.
 * @param {number} diff - Difficulty level (1 for basic, 2 for advanced)
 */
function displayTest(diff) {
  currentWordNo = 1;
  displayElement.innerHTML = '';

  const newTest = randomWords(diff);
  newTest.forEach((word, i) => {
    const wordSpanElement = document.createElement('span');
    wordSpanElement.innerText = word;
    wordSpanElement.setAttribute("id", "word " + (i + 1));
    displayElement.appendChild(wordSpanElement);
  });

  const nextWordID = "word " + currentWordNo;
  colorWordSpan(nextWordID, 2);
}

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @param {Array} array - The array to be shuffled
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Generates an array of random words based on the selected difficulty level.
 * @param {number} diff - Difficulty level (1 for basic, 2 for advanced)
 * @returns {Array} - Array of randomly selected words
 */
function randomWords(diff) {
  var hardWords = [
    "abstraction", "accessibility", "accumulator", "aggregation", "agile", "algorithm", "allocation", "ambiguity", "analytics", "android", 
    "animation", "annotation", "antivirus", "API", "applet", "architecture", "argument", "arithmetic", "artificialintelligence", "assembly", 
    "asynchronous", "authentication", "authorization", "autoencoder", "backend", "bandwidth", "basecase", "bigdata", "binder", "biometrics", 
    "bipartitegraph", "bitwise", "blackbox", "blockchain", "boolean", "botnet", "bottomup", "breadcrumb", "buffer", "bus", "bytecode", 
    "cache", "cascading", "chaosengineering", "checkpointing", "ciphertext", "circuit", "class", "cloudbursting", "cohesion", "compiler", 
    "complexity", "compression", "concurrency", "configuration", "consistency", "container", "contextual", "cryptography", "csharp", 
    "cybersecurity", "cyphertext", "dataflow", "deadlock", "debugging", "decryption", "deepdive", "dependency", "designpattern", "destructuring", 
    "deterministic", "devops", "distributed", "divergence", "docker", "domain", "doublespending", "downtime", "dynamic", "efficiency", 
    "elasticity", "encryption", "endian", "endpoint", "entropy", "epsilon", "eventdriven", "exabyte", "exploit", "factorial", "fallback", 
    "faulttolerance", "federated", "fiber", "firewall", "firmware", "forkjoin", "front-end", "frontend", "functional", "garbagecollection", 
    "gateway", "gigabyte", "granularity", "graphtheory", "gridcomputing", "groupthink", "hashfunction", "heuristic", "homomorphic", 
    "horizontal", "hypothesis", "immutable", "incremental", "indirection", "inference", "informationtheory", "inheritance", "initialization", 
    "innovation", "input", "interface", "interpolation", "iterator", "json", "kernel", "keypair", "latency", "leakage", "loadbalancing", 
    "localization", "logical", "logistics", "machinelearning", "malware", "manifest", "mapreduce", "metadata", "middleware", "migration", 
    "middleware", "minification", "mobprogramming", "mocking", "modularity", "multithreading", "mutation", "nanotechnology", 
    "naturalanguage", "network", "neuralnetwork", "nonvolatile", "normalization", "nullpointer", "obfuscation", "offline", 
    "optimization", "overfitting", "overhead", "pagemap", "parallel", "paradigm", "parameterization", "parser", "passive", 
    "pathfinding", "patternmatching", "penetration", "performance", "permutation", "persistence", "phishing", "plaintext", "pointer", 
    "polymorphism", "postmortem", "preprocessing", "proactive", "protocol", "prototype", "pseudocode", "quantum", "query", "racecondition", 
    "rack", "radix", "reactive", "reboot", "recursion", "refactoring", "reflection", "regression", "rehashing", "reification", 
    "reliability", "replication", "resolution", "responsive", "restore", "rollback", "routing", "sandboxing", "scalability", "schema", 
    "scripting", "scrum", "search", "semantic", "serialization", "serverless", "singleton", "smartcontract", "snapshot", "softskills", 
    "software", "sourcemap", "spam", "specification", "speculative", "spider", "stateless", "statistical", "steganography", "storage", 
    "streaming", "subroutine", "synchronization", "syntactic", "system", "taxonomy", "testing", "throttle", "topology", "transaction", 
    "transformation", "transpiler", "troubleshooting", "turing", "unzip", "usability", "vaccine", "validation", "vector", "verification", 
    "versioncontrol", "virtualization", "visualization", "volatile", "vulnerability", "waterfall", "webassembly", "webhook", "whitelist", 
    "workflow", "xss", "yaml", "zero-day", "zip"];

    var easyWords = [
      "array", "class", "stack", "queue", "float", "input", "const", "while", "break", "print",
    "false", "true", "null", "void", "char", "byte", "data", "else", "event", "final",
    "goto", "short", "throw", "super", "table", "throws", "catch", "close", "clone", "check",
    "force", "group", "index", "found", "frame", "parse", "pivot", "round", "scope",
    "slice", "solid", "tried", "truly", "arise", "audio", "basic", "boost", "chief", "count",
    "crawl", "demon", "drift", "enjoy", "field", "fiber", "front", "graph", "haste", "intro",
    "jumbo", "known", "label", "limit", "match", "noise", "option", "panel", "pitch", "quiet",
    "raise", "reset", "setup", "shine", "since", "sweep", "trace", "track", "unity", "valid",
    "vivid", "voice", "where", "yield", "zero", "allow", "begin", "color", "debug", "exact",
    "fetch", "gamma", "house", "mango", "novel", "occur", "pixel", "query", "scale", "zoom",
    "amaze", "bison", "blend", "cloud", "cycle", "enter", "fault", "grand",
  ];

  const wordArray = diff === 1 ? easyWords : hardWords;
  shuffle(wordArray);

  const selectedWords = wordArray.slice(0, 40).map(word => word + " ");
  return selectedWords;
}