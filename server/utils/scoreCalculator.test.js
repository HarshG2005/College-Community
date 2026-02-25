import { calculateScore } from './scoreCalculator.js';
import assert from 'assert';

console.log('🧪 Testing Score Calculator...');

try {
    // Case 1: Correct answers for DSA
    // DSA Questions: 20
    // Q1: id 1, correct 0
    // Q2: id 2, correct 2
    const answers1 = [
        { questionId: 1, selectedOption: 0 },
        { questionId: 2, selectedOption: 2 }
    ];
    // This is 2 correct out of 20
    const result1 = calculateScore('dsa', answers1);
    console.log('Test Case 1 (2/20 correct):', result1);
    assert.strictEqual(result1.correctAnswers, 2);
    assert.strictEqual(result1.totalQuestions, 20);
    assert.strictEqual(result1.score, 10); // (2/20)*100 = 10%
    console.log('✅ Passed');

    // Case 2: Manipulated answers (wrong selected option)
    const answers2 = [
        { questionId: 1, selectedOption: 1 } // Wrong (correct is 0)
    ];
    const result2 = calculateScore('dsa', answers2);
    console.log('Test Case 2 (0/20 correct):', result2);
    assert.strictEqual(result2.correctAnswers, 0);
    assert.strictEqual(result2.score, 0);
    console.log('✅ Passed');

    // Case 3: Empty answers
    const result3 = calculateScore('dsa', []);
    console.log('Test Case 3 (Empty answers):', result3);
    assert.strictEqual(result3.correctAnswers, 0);
    assert.strictEqual(result3.score, 0);
    console.log('✅ Passed');

    // Case 4: Communication test
    // Communication Questions: 15
    // Q1: id 1, correct 2
    const answers4 = [
        { questionId: 1, selectedOption: 2 }
    ];
    const result4 = calculateScore('communication', answers4);
    console.log('Test Case 4 (1/15 correct):', result4);
    assert.strictEqual(result4.correctAnswers, 1);
    assert.strictEqual(result4.totalQuestions, 15);
    // 1/15 * 100 = 6.666... -> 7
    assert.strictEqual(result4.score, 7);
    console.log('✅ Passed');

    // Case 5: Invalid test type
    const result5 = calculateScore('invalid', []);
    console.log('Test Case 5 (Invalid Type):', result5);
    assert.strictEqual(result5.totalQuestions, 0);
    assert.strictEqual(result5.score, 0);
    console.log('✅ Passed');

    // Case 6: Replay Attack (Duplicate correct answers)
    // Submitting Q1 correct answer multiple times should count as 1
    const answers6 = [
        { questionId: 1, selectedOption: 0 },
        { questionId: 1, selectedOption: 0 },
        { questionId: 1, selectedOption: 0 }
    ];
    const result6 = calculateScore('dsa', answers6);
    console.log('Test Case 6 (Replay Attack):', result6);
    assert.strictEqual(result6.correctAnswers, 1); // Should only count 1
    assert.strictEqual(result6.score, 5); // 1/20 * 100 = 5%
    console.log('✅ Passed');

    console.log('🎉 All tests passed!');
} catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
}
