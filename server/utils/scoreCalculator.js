import { dsaQuestions, communicationQuestions } from '../data/testQuestions.js';

export function calculateScore(testType, answers) {
    let questionSet = [];
    if (testType === 'dsa') {
        questionSet = dsaQuestions;
    } else if (testType === 'communication') {
        questionSet = communicationQuestions;
    }

    let calculatedCorrectAnswers = 0;
    const totalQuestions = questionSet.length;

    if (totalQuestions > 0 && answers && Array.isArray(answers)) {
        // Create a map of user answers for O(1) lookup
        // This also handles duplicate submissions for the same question ID by taking the last one
        const userAnswersMap = new Map();
        answers.forEach(a => {
            if (a.questionId !== undefined && a.selectedOption !== undefined) {
                userAnswersMap.set(a.questionId, a.selectedOption);
            }
        });

        // Iterate over official questions to prevent replay attacks
        questionSet.forEach(question => {
            if (userAnswersMap.has(question.id)) {
                const userSelectedOption = userAnswersMap.get(question.id);
                if (userSelectedOption === question.correctAnswer) {
                    calculatedCorrectAnswers++;
                }
            }
        });
    }

    const calculatedScore = totalQuestions > 0
        ? Math.round((calculatedCorrectAnswers / totalQuestions) * 100)
        : 0;

    return {
        score: calculatedScore,
        correctAnswers: calculatedCorrectAnswers,
        totalQuestions: totalQuestions
    };
}
