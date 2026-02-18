// DSA Test Questions - 20 MCQs covering Data Structures and Algorithms
export const dsaQuestions = [
    {
        id: 1,
        topic: "Arrays",
        difficulty: "Easy",
        question: "What is the time complexity of accessing an element in an array by index?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Array access by index is O(1) because arrays provide direct memory access."
    },
    {
        id: 2,
        topic: "Arrays",
        difficulty: "Medium",
        question: "What is the time complexity of finding an element in an unsorted array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 2,
        explanation: "Linear search in unsorted array requires checking each element, hence O(n)."
    },
    {
        id: 3,
        topic: "Linked List",
        difficulty: "Easy",
        question: "Which of the following is NOT an advantage of a linked list over an array?",
        options: ["Dynamic size", "Easy insertion/deletion", "Random access", "Memory efficiency"],
        correctAnswer: 2,
        explanation: "Linked lists don't support O(1) random access like arrays do."
    },
    {
        id: 4,
        topic: "Stack",
        difficulty: "Easy",
        question: "Stack follows which principle?",
        options: ["FIFO", "LIFO", "LILO", "FILO"],
        correctAnswer: 1,
        explanation: "Stack follows LIFO (Last In First Out) principle."
    },
    {
        id: 5,
        topic: "Queue",
        difficulty: "Easy",
        question: "Which data structure is used for BFS (Breadth-First Search)?",
        options: ["Stack", "Queue", "Heap", "Tree"],
        correctAnswer: 1,
        explanation: "BFS uses Queue to explore nodes level by level."
    },
    {
        id: 6,
        topic: "Binary Search",
        difficulty: "Medium",
        question: "What is the time complexity of Binary Search?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 2,
        explanation: "Binary search divides the search space in half each time, giving O(log n)."
    },
    {
        id: 7,
        topic: "Sorting",
        difficulty: "Medium",
        question: "Which sorting algorithm has the best average case time complexity?",
        options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
        correctAnswer: 2,
        explanation: "Merge Sort has O(n log n) average case, better than O(n²) of others."
    },
    {
        id: 8,
        topic: "Recursion",
        difficulty: "Medium",
        question: "What is the time complexity of calculating Fibonacci using simple recursion?",
        options: ["O(n)", "O(log n)", "O(2^n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Simple recursive Fibonacci has exponential O(2^n) complexity."
    },
    {
        id: 9,
        topic: "Hash Table",
        difficulty: "Medium",
        question: "What is the average time complexity of search in a hash table?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctAnswer: 0,
        explanation: "Hash tables provide O(1) average case for search operations."
    },
    {
        id: 10,
        topic: "Trees",
        difficulty: "Medium",
        question: "What is the maximum number of nodes at level k in a binary tree?",
        options: ["k", "2k", "2^k", "k²"],
        correctAnswer: 2,
        explanation: "At level k (0-indexed), maximum nodes = 2^k."
    },
    {
        id: 11,
        topic: "BST",
        difficulty: "Medium",
        question: "What is the worst-case time complexity of searching in a Binary Search Tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 2,
        explanation: "In worst case (skewed tree), BST search becomes O(n)."
    },
    {
        id: 12,
        topic: "Heap",
        difficulty: "Medium",
        question: "Which operation is NOT O(log n) in a binary heap?",
        options: ["Insert", "Delete Min", "Find Min", "Heapify"],
        correctAnswer: 2,
        explanation: "Find Min is O(1) in a min-heap as min is always at root."
    },
    {
        id: 13,
        topic: "Graph",
        difficulty: "Medium",
        question: "What data structure is used for DFS (Depth-First Search)?",
        options: ["Queue", "Stack", "Heap", "Hash Map"],
        correctAnswer: 1,
        explanation: "DFS uses Stack (or recursion) to explore depth-first."
    },
    {
        id: 14,
        topic: "Graph",
        difficulty: "Hard",
        question: "Dijkstra's algorithm does NOT work correctly for graphs with:",
        options: ["Directed edges", "Undirected edges", "Negative weight edges", "Weighted edges"],
        correctAnswer: 2,
        explanation: "Dijkstra's fails with negative weights; use Bellman-Ford instead."
    },
    {
        id: 15,
        topic: "Dynamic Programming",
        difficulty: "Hard",
        question: "What is the time complexity of solving 0/1 Knapsack using DP?",
        options: ["O(n)", "O(nW)", "O(2^n)", "O(n²)"],
        correctAnswer: 1,
        explanation: "0/1 Knapsack DP solution is O(n*W) where n=items, W=capacity."
    },
    {
        id: 16,
        topic: "Strings",
        difficulty: "Easy",
        question: "What is the time complexity of string concatenation using + in a loop (n times)?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 1,
        explanation: "String immutability causes O(n²) due to copying on each concat."
    },
    {
        id: 17,
        topic: "Two Pointers",
        difficulty: "Medium",
        question: "Two pointer technique is most useful for:",
        options: ["Sorting arrays", "Finding pairs in sorted array", "Binary search", "Graph traversal"],
        correctAnswer: 1,
        explanation: "Two pointers efficiently find pairs/subarrays in sorted arrays."
    },
    {
        id: 18,
        topic: "Sorting",
        difficulty: "Medium",
        question: "Which sorting algorithm is stable?",
        options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
        correctAnswer: 2,
        explanation: "Merge Sort preserves relative order of equal elements (stable)."
    },
    {
        id: 19,
        topic: "Space Complexity",
        difficulty: "Medium",
        question: "What is the space complexity of Merge Sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Merge Sort needs O(n) auxiliary space for merging."
    },
    {
        id: 20,
        topic: "Dynamic Programming",
        difficulty: "Hard",
        question: "Which problem CANNOT be solved using Dynamic Programming?",
        options: ["Longest Common Subsequence", "Travelling Salesman", "Tower of Hanoi (optimal)", "Longest Increasing Subsequence"],
        correctAnswer: 2,
        explanation: "Tower of Hanoi has a fixed recursive solution, not DP optimization."
    }
];

// Communication Test Questions - 15 MCQs
export const communicationQuestions = [
    {
        id: 1,
        topic: "Grammar",
        difficulty: "Easy",
        question: "Choose the correct sentence:",
        options: [
            "He don't like coffee.",
            "He doesn't likes coffee.",
            "He doesn't like coffee.",
            "He not like coffee."
        ],
        correctAnswer: 2,
        explanation: "Correct: 'doesn't' + base verb 'like'."
    },
    {
        id: 2,
        topic: "Grammar",
        difficulty: "Easy",
        question: "Identify the correct passive voice of: 'The teacher teaches the students.'",
        options: [
            "The students are taught by the teacher.",
            "The students is taught by the teacher.",
            "The students was taught by the teacher.",
            "The students being taught by the teacher."
        ],
        correctAnswer: 0,
        explanation: "Passive: Subject + be + past participle + by + agent."
    },
    {
        id: 3,
        topic: "Vocabulary",
        difficulty: "Medium",
        question: "Choose the synonym of 'Eloquent':",
        options: ["Silent", "Articulate", "Confused", "Nervous"],
        correctAnswer: 1,
        explanation: "Eloquent means fluent and persuasive in speaking."
    },
    {
        id: 4,
        topic: "Vocabulary",
        difficulty: "Medium",
        question: "Choose the antonym of 'Verbose':",
        options: ["Wordy", "Concise", "Lengthy", "Detailed"],
        correctAnswer: 1,
        explanation: "Verbose means using too many words; antonym is concise."
    },
    {
        id: 5,
        topic: "Email Writing",
        difficulty: "Medium",
        question: "Which is the most appropriate email sign-off for a formal business email?",
        options: [
            "Cheers!",
            "TTYL",
            "Best regards,",
            "Bye bye!"
        ],
        correctAnswer: 2,
        explanation: "'Best regards' is professional and widely accepted."
    },
    {
        id: 6,
        topic: "Grammar",
        difficulty: "Medium",
        question: "Choose the correct sentence:",
        options: [
            "Neither the manager nor the employees was present.",
            "Neither the manager nor the employees were present.",
            "Neither the manager nor the employees is present.",
            "Neither the manager nor the employees be present."
        ],
        correctAnswer: 1,
        explanation: "Verb agrees with the nearer subject (employees)."
    },
    {
        id: 7,
        topic: "Comprehension",
        difficulty: "Medium",
        question: "'The project deadline was moved up by two weeks.' This means:",
        options: [
            "The deadline was extended",
            "The deadline was made earlier",
            "The project was cancelled",
            "The deadline remains unchanged"
        ],
        correctAnswer: 1,
        explanation: "'Moved up' means brought forward/made earlier."
    },
    {
        id: 8,
        topic: "Professional Communication",
        difficulty: "Medium",
        question: "Which is the best response when you don't understand something in a meeting?",
        options: [
            "Stay silent and figure it out later",
            "Could you please clarify that point?",
            "That's confusing, explain again.",
            "I wasn't listening, repeat that."
        ],
        correctAnswer: 1,
        explanation: "Politely asking for clarification is professional."
    },
    {
        id: 9,
        topic: "Grammar",
        difficulty: "Easy",
        question: "Fill in the blank: 'If I ___ rich, I would travel the world.'",
        options: ["am", "was", "were", "will be"],
        correctAnswer: 2,
        explanation: "Subjunctive mood uses 'were' for hypothetical situations."
    },
    {
        id: 10,
        topic: "Vocabulary",
        difficulty: "Easy",
        question: "Choose the correct word: 'Please find the document ___ for your reference.'",
        options: ["attached", "attaching", "attach", "attachment"],
        correctAnswer: 0,
        explanation: "'Attached' is the correct past participle form here."
    },
    {
        id: 11,
        topic: "Interview Skills",
        difficulty: "Medium",
        question: "What is the best response to 'Tell me about yourself' in an interview?",
        options: [
            "Detail your entire life story",
            "Give a brief professional summary relevant to the role",
            "Talk about your hobbies",
            "Say 'What do you want to know?'"
        ],
        correctAnswer: 1,
        explanation: "Keep it professional, relevant, and concise (2-3 minutes)."
    },
    {
        id: 12,
        topic: "Grammar",
        difficulty: "Medium",
        question: "Choose the correct form: 'Each of the students ___ completed their assignment.'",
        options: ["have", "has", "having", "had been"],
        correctAnswer: 1,
        explanation: "'Each' is singular and takes 'has'."
    },
    {
        id: 13,
        topic: "Email Writing",
        difficulty: "Medium",
        question: "Which email subject line is most effective?",
        options: [
            "Hi",
            "Important!!!",
            "Meeting Request: Project Review - March 15",
            "Please Read"
        ],
        correctAnswer: 2,
        explanation: "Specific, clear subject lines improve open rates."
    },
    {
        id: 14,
        topic: "Presentation Skills",
        difficulty: "Medium",
        question: "Which is NOT a good practice during a presentation?",
        options: [
            "Maintaining eye contact",
            "Reading directly from slides",
            "Using appropriate gestures",
            "Engaging with the audience"
        ],
        correctAnswer: 1,
        explanation: "Reading from slides shows poor preparation."
    },
    {
        id: 15,
        topic: "Professional Communication",
        difficulty: "Medium",
        question: "When giving feedback to a colleague, you should:",
        options: [
            "Be vague to avoid conflict",
            "Focus only on negatives",
            "Be specific, constructive, and balanced",
            "Wait until annual review"
        ],
        correctAnswer: 2,
        explanation: "Constructive feedback is specific, timely, and balanced."
    }
];

export default { dsaQuestions, communicationQuestions };
