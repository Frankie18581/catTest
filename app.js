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
        // 1. Try exact pattern matching first (only works for original 6-question patterns)
        const patternKey = ans.slice(0, 6).map((a, i) => `${i + 1}${a}`).join('');
        if (quizData.catArchetypes[patternKey]) {
            return quizData.catArchetypes[patternKey];
        }

        // 2. Advanced logic for 15 questions
        const counts = { A: 0, B: 0, C: 0, D: 0 };
        ans.forEach(a => counts[a]++);

        // Sort letters by frequency
        const sortedLetters = Object.entries(counts)
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .map(entry => entry[0]);

        const dominant = sortedLetters[0];
        const secondary = sortedLetters[1];
        const q1 = ans[0];

        // Map based on dominant, secondary and Q1 to reach all 24+ cats
        const extendedTypeMap = {
            'A': { // High Stability / Leadership
                'A': { 'A': '缅因巨人', 'B': '加菲猫', 'C': '中华狸花', 'D': '西伯利亚森林猫' },
                'B': { 'A': '缅因巨人', 'B': '伯曼猫', 'C': '新加坡猫', 'D': '美短' },
                'C': { 'A': '临清狮子猫', 'B': '新加坡猫', 'C': '俄罗斯蓝猫', 'D': '孟买猫' },
                'D': { 'A': '西伯利亚森林猫', 'B': '加菲猫', 'C': '中华狸花', 'D': '新加坡猫' }
            },
            'B': { // High Dependency / Social
                'A': { 'A': '布偶猫', 'B': '德文卷毛猫', 'C': '重点色布偶', 'D': '暹罗猫' },
                'B': { 'A': '布偶猫', 'B': '暹罗猫', 'C': '重点色布偶', 'D': '德文卷毛猫' },
                'C': { 'A': '暹罗猫', 'B': '重点色布偶', 'C': '折耳猫', 'D': '布偶猫' },
                'D': { 'A': '德文卷毛猫', 'B': '橘座', 'C': '布偶猫', 'D': '暹罗猫' }
            },
            'C': { // High Introversion / Sensitivity
                'A': { 'A': '临清狮子猫', 'B': '安哥拉猫', 'C': '无毛猫', 'D': '黑猫' },
                'B': { 'A': '无毛猫', 'B': '折耳猫', 'C': '暹罗猫', 'D': '安哥拉猫' },
                'C': { 'A': '无毛猫', 'B': '俄罗斯蓝猫', 'C': '临清狮子猫', 'D': '安哥拉猫' },
                'D': { 'A': '黑猫', 'B': '无毛猫', 'C': '俄罗斯蓝猫', 'D': '折耳猫' }
            },
            'D': { // High Independence / Chaos
                'A': { 'A': '中华狸花', 'B': '西伯利亚森林猫', 'C': '孟买猫', 'D': '奶牛猫' },
                'B': { 'A': '奶牛猫', 'B': '橘座', 'C': '德文卷毛猫', 'D': '三花猫' },
                'C': { 'A': '三花猫', 'B': '黑猫', 'C': '无毛猫', 'D': '帕拉斯猫' },
                'D': { 'A': '奶牛猫', 'B': '狞猫', 'C': '柯尼斯卷毛猫', 'D': '阿比西尼亚猫' }
            }
        };

        const catName = extendedTypeMap[dominant][secondary][q1] || '缅因巨人';
        
        for (const key in quizData.catArchetypes) {
            if (quizData.catArchetypes[key].name === catName) {
                return quizData.catArchetypes[key];
            }
        }

        return quizData.catArchetypes["1A2A3D4A5A6A"]; // Default fallback
    }
});
