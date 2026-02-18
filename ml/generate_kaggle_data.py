"""
BMSIT-Specific Placement Data Generator
Generates realistic placement data based on Indian engineering college parameters
"""

import pandas as pd
import numpy as np
import os

# Set random seed for reproducibility
np.random.seed(42)

# BMSIT-specific branches
BRANCHES = ['CSE', 'ISE', 'ECE', 'EEE', 'ETE', 'AIML', 'Mechanical', 'Civil']

# Branch-wise placement rates (realistic Indian scenario)
BRANCH_PLACEMENT_RATES = {
    'CSE': 0.85,
    'ISE': 0.80,
    'AIML': 0.82,
    'ECE': 0.65,
    'EEE': 0.55,
    'ETE': 0.50,
    'Mechanical': 0.45,
    'Civil': 0.40
}

def generate_dataset(n_samples=2000):
    """Generate placement dataset with India-specific features"""
    
    data = []
    
    for _ in range(n_samples):
        # Basic demographics
        branch = np.random.choice(BRANCHES, p=[0.20, 0.15, 0.15, 0.10, 0.08, 0.12, 0.12, 0.08])
        gender = np.random.choice(['Male', 'Female'], p=[0.65, 0.35])
        
        # Academic performance
        cgpa = round(np.random.normal(7.2, 1.2), 2)
        cgpa = max(4.0, min(10.0, cgpa))  # Clamp between 4-10
        
        # Number of backlogs (heavy penalty for placement)
        if cgpa >= 8.0:
            backlogs = np.random.choice([0, 1], p=[0.95, 0.05])
        elif cgpa >= 6.5:
            backlogs = np.random.choice([0, 1, 2], p=[0.75, 0.20, 0.05])
        else:
            backlogs = np.random.choice([0, 1, 2, 3, 4], p=[0.40, 0.30, 0.15, 0.10, 0.05])
        
        # Technical skills (India-specific)
        # DSA Score (0-100) - very important for tech placements
        if branch in ['CSE', 'ISE', 'AIML']:
            dsa_score = int(np.random.normal(55, 20))
        else:
            dsa_score = int(np.random.normal(30, 15))
        dsa_score = max(0, min(100, dsa_score))
        
        # Projects (0-5)
        if branch in ['CSE', 'ISE', 'AIML']:
            projects = np.random.choice([0, 1, 2, 3, 4, 5], p=[0.05, 0.15, 0.30, 0.30, 0.15, 0.05])
        else:
            projects = np.random.choice([0, 1, 2, 3], p=[0.15, 0.35, 0.35, 0.15])
        
        # LeetCode/Coding Problems Solved
        if branch in ['CSE', 'ISE', 'AIML']:
            leetcode_problems = int(np.random.exponential(80))
        else:
            leetcode_problems = int(np.random.exponential(20))
        leetcode_problems = min(500, leetcode_problems)
        
        # Technical Certifications (0-5)
        certifications = np.random.choice([0, 1, 2, 3, 4], p=[0.20, 0.35, 0.30, 0.12, 0.03])
        
        # Internship (binary)
        if branch in ['CSE', 'ISE', 'AIML'] and cgpa >= 7.0:
            has_internship = np.random.choice([0, 1], p=[0.30, 0.70])
        else:
            has_internship = np.random.choice([0, 1], p=[0.60, 0.40])
        
        # Communication Score (1-5)
        communication = np.random.choice([1, 2, 3, 4, 5], p=[0.05, 0.15, 0.40, 0.30, 0.10])
        
        # Calculate placement probability based on all factors
        base_rate = BRANCH_PLACEMENT_RATES[branch]
        
        # CGPA impact (major factor)
        cgpa_factor = (cgpa - 6.0) / 4.0  # 0 to 1 scale
        cgpa_factor = max(0, min(1, cgpa_factor))
        
        # DSA impact (very important for tech)
        dsa_factor = dsa_score / 100.0
        
        # Projects impact
        project_factor = projects / 5.0
        
        # LeetCode impact
        leetcode_factor = min(leetcode_problems / 200.0, 1.0)
        
        # Backlogs penalty
        backlog_penalty = backlogs * 0.15
        
        # Combined probability
        if branch in ['CSE', 'ISE', 'AIML']:
            # Tech-heavy weights
            placement_prob = (
                base_rate * 0.12 +
                cgpa_factor * 0.22 +
                dsa_factor * 0.22 +
                project_factor * 0.12 +
                leetcode_factor * 0.08 +
                has_internship * 0.15 +  # Increased from 0.05 to 0.15
                (communication / 5.0) * 0.09
            ) - backlog_penalty
        else:
            # Core branches - more weight on CGPA and basics
            placement_prob = (
                base_rate * 0.20 +
                cgpa_factor * 0.28 +
                dsa_factor * 0.08 +
                project_factor * 0.08 +
                has_internship * 0.18 +  # Increased from 0.10 to 0.18
                (communication / 5.0) * 0.08 +
                (certifications / 4.0) * 0.10
            ) - backlog_penalty
        
        placement_prob = max(0.05, min(0.95, placement_prob))
        
        # Determine placement
        placed = 1 if np.random.random() < placement_prob else 0
        
        data.append({
            'Branch': branch,
            'Gender': gender,
            'CGPA': cgpa,
            'Backlogs': backlogs,
            'DSA_Score': dsa_score,
            'Projects': projects,
            'LeetCode_Problems': leetcode_problems,
            'Certifications': certifications,
            'Internship': has_internship,
            'Communication_Score': communication,
            'PlacedOrNot': placed
        })
    
    return pd.DataFrame(data)

if __name__ == "__main__":
    # Generate dataset
    print("🎓 Generating BMSIT Placement Dataset...")
    df = generate_dataset(2000)
    
    # Create output directory
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    # Save dataset
    output_path = os.path.join(output_dir, 'bmsit_placement_data.csv')
    df.to_csv(output_path, index=False)
    
    print(f"✅ Dataset saved to: {output_path}")
    print(f"📊 Total records: {len(df)}")
    print(f"📈 Placement rate: {df['PlacedOrNot'].mean()*100:.1f}%")
    print("\n📋 Sample data:")
    print(df.head(10).to_string())
    print("\n📊 Branch-wise placement rates:")
    print(df.groupby('Branch')['PlacedOrNot'].mean().sort_values(ascending=False))
