// =========================
// Listes de vocabulaire
// =========================
const listes = {
    "Liste 1": [
        { fr: "Courir", en: "To run" },
        { fr: "Marcher, se promener", en: "To walk" },
        { fr: "Faire", en: "To do" },
        { fr: "Faire (fabriquer)", en: "To make" },
        { fr: "Revenir à la maison, rentrer chez soi", en: "To come back home" },
        { fr: "S’asseoir", en: "To sit down" },
        { fr: "Se lever (de sa chaise)", en: "To stand up" },
        { fr: "Parler, bavarder", en: "To talk" },
        { fr: "Parler une langue étrangère", en: "To speak" },
        { fr: "Dormir", en: "To sleep" },
        { fr: "Être", en: "To be" },
        { fr: "Avoir", en: "To have" },
        { fr: "Avoir, posséder", en: "To have got" },
        { fr: "Aller", en: "To go to" },
        { fr: "Nager", en: "To swim" },
        { fr: "Rouler à vélo", en: "To ride a bike" },
        { fr: "Monter à cheval, faire de l’équitation", en: "To ride a horse" },
        { fr: "Habiter", en: "To live" },
        { fr: "À quelle fréquence vas-tu à l’école?", en: "How often do you go to school" },
        { fr: "Je vais au cinéma 1 fois par an", en: "I go to the cinema once a year" },
        { fr: "Je vais à la piscine 2 fois par semaine", en: "I go to the pool twice a week" },
        { fr: "Je vais au restaurant 3 fois par mois", en: "I go to the restaurant 3 times a month" },
        { fr: "Tous les jours", en: "Every day" }
    ]
};

// =========================
// Variables globales
// =========================
let currentList = [];
let currentIndex = 0;
let score = 0;
let mode = "qcm"; // par défaut
let lastScores = JSON.parse(localStorage.getItem("scores")) || [];

// =========================
// Récupérer les éléments
// =========================
const listSelect = document.getElementById("listSelect");
const modeSelect = document.getElementById("modeSelect");
const startBtn = document.getElementById("startBtn");
const quizContainer = document.getElementById("quizContainer");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const answerInput = document.getElementById("answerInput");
const validateBtn = document.getElementById("validateBtn");
const scoreContainer = document.getElementById("scoreContainer");
const scoreEl = document.getElementById("score");
const lastScoresEl = document.getElementById("lastScores");
const restartBtn = document.getElementById("restartBtn");

// =========================
// Initialisation des listes
// =========================
function initLists() {
    for (let listName in listes) {
        let opt = document.createElement("option");
        opt.value = listName;
        opt.textContent = listName;
        listSelect.appendChild(opt);
    }
}
initLists();

// =========================
// Démarrage du quiz
// =========================
startBtn.addEventListener("click", () => {
    const selectedList = listSelect.value;
    mode = modeSelect.value;
    currentList = [...listes[selectedList]]; // copie
    currentIndex = 0;
    score = 0;

    scoreContainer.classList.add("hidden");
    quizContainer.classList.remove("hidden");

    showQuestion();
});

// =========================
// Affichage d'une question
// =========================
function showQuestion() {
    if (currentIndex >= currentList.length) {
        endQuiz();
        return;
    }

    let item = currentList[currentIndex];
    questionEl.textContent = item.fr;

    optionsEl.innerHTML = "";
    answerInput.classList.add("hidden");

    if (mode === "qcm") {
        // QCM
        let answers = [item.en];
        while (answers.length < 4) {
            let randomItem = currentList[Math.floor(Math.random() * currentList.length)].en;
            if (!answers.includes(randomItem)) {
                answers.push(randomItem);
            }
        }
        answers.sort(() => Math.random() - 0.5);

        answers.forEach(ans => {
            let btn = document.createElement("button");
            btn.textContent = ans;
            btn.onclick = () => {
                if (ans === item.en) score++;
                currentIndex++;
                showQuestion();
            };
            optionsEl.appendChild(btn);
        });

    } else {
        // Mode écriture
        answerInput.value = "";
        answerInput.classList.remove("hidden");

        validateBtn.onclick = () => {
            if (answerInput.value.trim().toLowerCase() === item.en.toLowerCase()) {
                score++;
            }
            currentIndex++;
            showQuestion();
        };
    }
}

// =========================
// Fin du quiz
// =========================
function endQuiz() {
    quizContainer.classList.add("hidden");
    scoreContainer.classList.remove("hidden");

    scoreEl.textContent = `Ton score : ${score}/${currentList.length}`;

    lastScores.unshift(score);
    if (lastScores.length > 6) lastScores.pop();
    localStorage.setItem("scores", JSON.stringify(lastScores));

    showLastScores();
}

// =========================
// Affichage des derniers scores
// =========================
function showLastScores() {
    lastScoresEl.innerHTML = "";
    lastScores.forEach(s => {
        let li = document.createElement("li");
        li.textContent = s;
        lastScoresEl.appendChild(li);
    });
}

// =========================
// Recommencer
// =========================
restartBtn.addEventListener("click", () => {
    scoreContainer.classList.add("hidden");
});
