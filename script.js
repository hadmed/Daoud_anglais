let lists = {
  "Liste 1": [
    { en: "To run", fr: "Courir" },
    { en: "To walk", fr: "Marcher, se promener" },
    { en: "To do", fr: "Faire" },
    { en: "To make", fr: "Faire (fabriquer)" },
    { en: "To come back home", fr: "Revenir à la maison, rentrer chez soi" },
    { en: "To sit down", fr: "S’asseoir" },
    { en: "To stand up", fr: "Se lever (de sa chaise)" },
    { en: "To talk", fr: "Parler, bavarder" },
    { en: "To speak", fr: "Parler une langue étrangère" },
    { en: "To sleep", fr: "Dormir" },
    { en: "To be", fr: "Être" },
    { en: "To have", fr: "Avoir" },
    { en: "To have got", fr: "Avoir, posséder" },
    { en: "To go to", fr: "Aller" },
    { en: "To swim", fr: "Nager" },
    { en: "To ride a bike", fr: "Rouler à vélo" },
    { en: "To ride a horse", fr: "Monter à cheval, faire de l’équitation" },
    { en: "To live", fr: "Habiter" },
    { en: "How often do you go to school", fr: "À quelle fréquence vas-tu à l’école ?" },
    { en: "I go to the cinema once a year", fr: "Je vais au cinéma 1 fois par an" },
    { en: "I go to the pool twice a week", fr: "Je vais à la piscine 2 fois par semaine" },
    { en: "I go to the restaurant 3 times a month", fr: "Je vais au restaurant 3 fois par mois" },
    { en: "Every day", fr: "Tous les jours" }
  ]
};

let currentListName = "Liste 1";
let currentList = lists[currentListName];
let score = 0, total = 0;
let lastScores = JSON.parse(localStorage.getItem("scores")) || {};

// Remplir le menu déroulant
function updateListSelect() {
  const select = document.getElementById("listSelect");
  select.innerHTML = "";
  for (let name in lists) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  }
}
updateListSelect();

function saveScore(listName, score, total) {
  if (!lastScores[listName]) lastScores[listName] = [];
  lastScores[listName].unshift(`${score}/${total}`);
  if (lastScores[listName].length > 6) lastScores[listName].pop();
  localStorage.setItem("scores", JSON.stringify(lastScores));
  showScores();
}

function showScores() {
  const ul = document.getElementById("lastScores");
  ul.innerHTML = "";
  if (lastScores[currentListName]) {
    lastScores[currentListName].forEach(s => {
      const li = document.createElement("li");
      li.textContent = `${currentListName}: ${s}`;
      ul.appendChild(li);
    });
  }
}

function startQuiz() {
  currentListName = document.getElementById("listSelect").value;
  currentList = lists[currentListName];
  score = 0; total = 0;
  document.getElementById("quiz").style.display = "block";
  document.getElementById("inputMode").style.display = "none";
  nextQuestion();
}

function nextQuestion() {
  if (total >= currentList.length) {
    alert(`Fini ! Score: ${score}/${total}`);
    saveScore(currentListName, score, total);
    return;
  }
  total++;
  const q = currentList[Math.floor(Math.random() * currentList.length)];
  document.getElementById("question").textContent = q.fr;

  const options = [q.en];
  while (options.length < 4) {
    const r = currentList[Math.floor(Math.random() * currentList.length)].en;
    if (!options.includes(r)) options.push(r);
  }
  options.sort(() => Math.random() - 0.5);

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  options.forEach(opt => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = opt;
    div.onclick = () => {
      if (opt === q.en) score++;
      nextQuestion();
    };
    optionsDiv.appendChild(div);
  });
}

// Mode écriture
let currentInputQ;
function startInputMode() {
  currentListName = document.getElementById("listSelect").value;
  currentList = lists[currentListName];
  score = 0; total = 0;
  document.getElementById("quiz").style.display = "none";
  document.getElementById("inputMode").style.display = "block";
  nextInputQuestion();
}

function nextInputQuestion() {
  if (total >= currentList.length) {
    alert(`Fini ! Score: ${score}/${total}`);
    saveScore(currentListName, score, total);
    return;
  }
  total++;
  currentInputQ = currentList[Math.floor(Math.random() * currentList.length)];
  document.getElementById("inputQuestion").textContent = currentInputQ.fr;
  document.getElementById("userAnswer").value = "";
}

function checkInputAnswer() {
  const ans = document.getElementById("userAnswer").value.trim();
  if (ans.toLowerCase() === currentInputQ.en.toLowerCase()) {
    score++;
    alert("Correct !");
  } else {
    alert(`Faux ! Réponse: ${currentInputQ.en}`);
  }
  nextInputQuestion();
}

// Ajouter une nouvelle liste
function addNewList() {
  const name = document.getElementById("listName").value.trim();
  const text = document.getElementById("newList").value.trim();
  if (!name || !text) { alert("Nom et contenu obligatoires"); return; }

  const lines = text.split("\n");
  const newEntries = lines.map(line => {
    const parts = line.split("=");
    return { en: parts[0].trim(), fr: parts[1].trim() };
  });
  lists[name] = newEntries;
  updateListSelect();
  document.getElementById("listName").value = "";
  document.getElementById("newList").value = "";
  alert(`Liste "${name}" ajoutée !`);
}

showScores();
