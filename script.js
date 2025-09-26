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
            btn.style.marginBottom = "10px"; // espacement entre les boutons
            btn.onclick = () => {
                if (ans === item.en) {
                    score++;
                    btn.style.background = "#28a745"; // vert si correct
                } else {
                    btn.style.background = "#dc3545"; // rouge si faux
                }
                setTimeout(() => {
                    currentIndex++;
                    showQuestion();
                }, 600);
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
