document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const optionsContainer = document.getElementById('options-container');
    const questionText = document.getElementById('question-text');
    const questionNumber = document.getElementById('question-number');
    const progressBar = document.getElementById('progress-bar');

    let currentQuestionIndex = 0;
    let answers = [];

    // Start Quiz
    startBtn.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        showQuestion();
    });

    // Restart Quiz
    restartBtn.addEventListener('click', () => {
        resultScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        currentQuestionIndex = 0;
        answers = [];
    });

    function showQuestion() {
        const question = quizData.questions[currentQuestionIndex];
        questionText.textContent = question.text;
        questionNumber.textContent = `第 ${currentQuestionIndex + 1}/${quizData.questions.length} 题`;
        progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%`;

        optionsContainer.innerHTML = '';
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn w-full p-5 text-left border-2 border-gray-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 flex items-center group transition-all duration-200';
            button.innerHTML = `
                <span class="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center font-bold text-gray-500 mr-4 transition-colors">
                    ${option.label}
                </span>
                <span class="text-gray-700 font-medium group-hover:text-indigo-700">${option.text}</span>
            `;
            button.addEventListener('click', () => handleAnswer(option.label));
            optionsContainer.appendChild(button);
        });
    }

    function handleAnswer(label) {
        answers.push(label);
        if (currentQuestionIndex < quizData.questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        quizScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        const catType = calculateResult(answers);
        
        document.getElementById('result-cat-name').textContent = catType.name;
        document.getElementById('result-cat-title').textContent = catType.title;
        document.getElementById('result-psych').textContent = catType.psych;
        document.getElementById('result-traits').textContent = catType.traits;
        document.getElementById('result-zapping').textContent = `“${catType.zapping}”`;
    }

    function calculateResult(ans) {
        // 1. Try exact pattern matching first
        const patternKey = ans.map((a, i) => `${i + 1}${a}`).join('');
        if (quizData.catArchetypes[patternKey]) {
            return quizData.catArchetypes[patternKey];
        }

        // 2. Logic based on dominant letters and first question
        const counts = { A: 0, B: 0, C: 0, D: 0 };
        ans.forEach(a => counts[a]++);

        let dominant = 'A';
        let maxCount = 0;
        for (const [letter, count] of Object.entries(counts)) {
            if (count > maxCount) {
                maxCount = count;
                dominant = letter;
            }
        }

        const q1 = ans[0];
        
        // Mapping logic from abstract.markdown
        // A=缅因/布偶(A1/A2)
        // B=暹罗/三花(B3/B4)
        // C=狮子/黑猫(C3/C4)
        // D=森林/德文(D1/D2)
        
        const typeMap = {
            'A': { 'A': '缅因巨人', 'B': '布偶猫', 'C': '无毛猫', 'D': '奶牛猫' },
            'B': { 'A': '橘座', 'B': '暹罗猫', 'C': '三花猫', 'D': '俄罗斯蓝猫' },
            'C': { 'A': '临清狮子猫', 'B': '黑猫', 'C': '美短', 'D': '西伯利亚森林猫' },
            'D': { 'A': '德文卷毛猫', 'B': '折耳猫', 'C': '帕拉斯猫', 'D': '加菲猫' }
        };

        // If no exact match, find by name in archetypes
        const catName = typeMap[dominant][q1] || '缅因巨人';
        
        for (const key in quizData.catArchetypes) {
            if (quizData.catArchetypes[key].name === catName) {
                return quizData.catArchetypes[key];
            }
        }

        return quizData.catArchetypes["1A2A3D4A5A6A"]; // Default fallback
    }
});
