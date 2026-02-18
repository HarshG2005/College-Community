"""
Synthetic Student Dataset Generator
Generates realistic Indian student data with BMSIT USN format for ML training
"""

import json
import random
import os

# Indian Names Database
FIRST_NAMES_MALE = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Shaurya", "Atharva", "Advait", "Pranav", "Dhruv", "Kabir", "Ritvik", "Aaditya", "Darsh", "Arnav",
    "Rohan", "Rahul", "Amit", "Suresh", "Rajesh", "Vikram", "Nikhil", "Akash", "Karthik", "Sanjay",
    "Deepak", "Manoj", "Anil", "Varun", "Tarun", "Gaurav", "Abhishek", "Prateek", "Sachin", "Ajay",
    "Ravi", "Sunil", "Harish", "Ganesh", "Naveen", "Mohan", "Venkat", "Prasad", "Ramesh", "Mahesh"
]

FIRST_NAMES_FEMALE = [
    "Aadhya", "Ananya", "Diya", "Myra", "Saanvi", "Aanya", "Pari", "Anika", "Navya", "Aarohi",
    "Ishita", "Kavya", "Shreya", "Tanvi", "Priya", "Sneha", "Pooja", "Divya", "Neha", "Megha",
    "Swati", "Anjali", "Riya", "Nisha", "Shalini", "Deepika", "Pallavi", "Rashmi", "Sunita", "Lakshmi",
    "Bhavana", "Chandana", "Vidya", "Aparna", "Krithika", "Meghana", "Sahana", "Tejaswini", "Chaitra", "Akshata"
]

LAST_NAMES = [
    "Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Reddy", "Rao", "Nair", "Menon",
    "Iyer", "Iyengar", "Hegde", "Shetty", "Gowda", "Naidu", "Choudhary", "Joshi", "Kulkarni", "Deshmukh",
    "Patil", "Jain", "Agarwal", "Bansal", "Malhotra", "Kapoor", "Khanna", "Bhat", "Kamath", "Pai",
    "Murthy", "Krishnan", "Rajan", "Pillai", "Varma", "Das", "Bose", "Sen", "Ghosh", "Chatterjee",
    "Saxena", "Tiwari", "Pandey", "Mishra", "Dubey", "Srivastava", "Rastogi", "Mahajan", "Goyal", "Mittal"
]

# Branch configurations
BRANCHES = {
    "CSE": {"code": "CS", "skills": ["Python", "Java", "C++", "Web Development", "Data Structures", "Machine Learning", "DBMS", "Cloud Computing"]},
    "ISE": {"code": "IS", "skills": ["Python", "Java", "Software Engineering", "Web Development", "Data Structures", "Testing", "DBMS", "DevOps"]},
    "ECE": {"code": "EC", "skills": ["Embedded Systems", "VLSI", "Signal Processing", "IoT", "C", "Microcontrollers", "Communication Systems", "PCB Design"]},
    "EEE": {"code": "EE", "skills": ["Power Systems", "Control Systems", "Electrical Machines", "PLC", "MATLAB", "Renewable Energy", "Circuit Design"]},
    "MECH": {"code": "ME", "skills": ["AutoCAD", "SolidWorks", "Thermodynamics", "Manufacturing", "CNC", "CATIA", "Fluid Mechanics", "FEA"]},
    "CIVIL": {"code": "CV", "skills": ["AutoCAD", "STAAD Pro", "Structural Design", "Surveying", "Concrete Technology", "Project Management", "Revit"]},
    "AIML": {"code": "AI", "skills": ["Python", "Machine Learning", "Deep Learning", "Data Science", "TensorFlow", "SQL", "Statistics", "NLP"]}
}

# Companies that recruit from each branch
COMPANIES = {
    "CSE": ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "IBM", "Microsoft", "Google", "Amazon", "Capgemini", "HCL", "Tech Mahindra", "Mindtree", "Mphasis", "L&T Infotech"],
    "ISE": ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "IBM", "Capgemini", "HCL", "Tech Mahindra", "Mindtree", "Mphasis", "Oracle", "SAP"],
    "ECE": ["TCS", "Infosys", "Wipro", "Bosch", "Samsung", "Texas Instruments", "Qualcomm", "Intel", "L&T", "Siemens", "ABB", "Schneider"],
    "EEE": ["L&T", "Siemens", "ABB", "Schneider", "BHEL", "NTPC", "Tata Power", "Adani", "Torrent Power", "Crompton"],
    "MECH": ["L&T", "Tata Motors", "Mahindra", "Ashok Leyland", "Bosch", "TVS", "Caterpillar", "JCB", "Toyota", "Honda"],
    "CIVIL": ["L&T", "Shapoorji Pallonji", "Sobha", "Prestige", "Brigade", "DLF", "Godrej Properties", "NHAI", "KPWD"],
    "AIML": ["TCS", "Infosys", "Wipro", "Mu Sigma", "Fractal Analytics", "Tiger Analytics", "Latent View", "Amazon", "Microsoft", "Google"]
}

def generate_usn(branch_code, year, roll_number):
    """Generate USN in format: 1BY23CS001"""
    return f"1BY{year}{branch_code}{roll_number:03d}"

def generate_cgpa(placed=None):
    """Generate realistic CGPA distribution"""
    if placed is True:
        # Placed students tend to have higher CGPA
        return round(random.triangular(6.5, 10.0, 8.0), 2)
    elif placed is False:
        # Not placed students have varied CGPA
        return round(random.triangular(4.0, 9.0, 6.5), 2)
    else:
        # General distribution
        return round(random.triangular(4.0, 10.0, 7.0), 2)

def generate_student(branch, year, roll_number):
    """Generate a single student record"""
    is_male = random.random() > 0.35  # 65% male ratio typical in engineering
    
    first_name = random.choice(FIRST_NAMES_MALE if is_male else FIRST_NAMES_FEMALE)
    last_name = random.choice(LAST_NAMES)
    
    branch_info = BRANCHES[branch]
    usn = generate_usn(branch_info["code"], year, roll_number)
    
    # Determine placement status based on multiple factors
    cgpa = generate_cgpa()
    num_skills = random.randint(2, 6)
    skills = random.sample(branch_info["skills"], min(num_skills, len(branch_info["skills"])))
    
    has_internship = random.random() > 0.4  # 60% have internship
    num_projects = random.randint(0, 4)
    has_certifications = random.random() > 0.5
    num_certifications = random.randint(1, 4) if has_certifications else 0
    backlogs = random.choices([0, 0, 0, 0, 1, 1, 2, 3], weights=[40, 20, 10, 5, 10, 8, 5, 2])[0]
    
    # Calculate placement probability
    placement_score = 0
    placement_score += min(cgpa / 10 * 40, 40)  # CGPA contributes up to 40%
    placement_score += len(skills) * 3  # Skills contribute
    placement_score += 15 if has_internship else 0  # Internship is big factor
    placement_score += num_projects * 5  # Projects help
    placement_score += num_certifications * 3  # Certifications help
    placement_score -= backlogs * 15  # Backlogs hurt significantly
    
    # Add some randomness
    placement_score += random.uniform(-10, 10)
    
    is_placed = placement_score >= 50 and cgpa >= 5.0 and backlogs <= 1
    
    # If placed, assign a company
    company = None
    package = None
    if is_placed:
        company = random.choice(COMPANIES[branch])
        # Package based on CGPA and company tier
        if company in ["Google", "Microsoft", "Amazon"]:
            package = round(random.uniform(15, 45), 2)
        elif company in ["TCS", "Infosys", "Wipro", "Cognizant"]:
            package = round(random.uniform(3.5, 7), 2)
        else:
            package = round(random.uniform(4, 12), 2)
    
    return {
        "usn": usn,
        "name": f"{first_name} {last_name}",
        "gender": "Male" if is_male else "Female",
        "branch": branch,
        "year": f"20{year}",
        "cgpa": cgpa,
        "backlogs": backlogs,
        "skills": skills,
        "num_skills": len(skills),
        "has_internship": has_internship,
        "internship_months": random.randint(1, 6) if has_internship else 0,
        "num_projects": num_projects,
        "num_certifications": num_certifications,
        "placed": is_placed,
        "company": company,
        "package_lpa": package,
        "placement_score": round(placement_score, 2)
    }

def generate_dataset(num_students_per_branch=100, year="23"):
    """Generate complete dataset"""
    students = []
    
    for branch in BRANCHES.keys():
        for i in range(1, num_students_per_branch + 1):
            student = generate_student(branch, year, i)
            students.append(student)
    
    return students

def save_dataset(students, output_dir):
    """Save dataset in multiple formats"""
    os.makedirs(output_dir, exist_ok=True)
    
    # Save as JSON
    with open(os.path.join(output_dir, "students.json"), "w") as f:
        json.dump(students, f, indent=2)
    
    # Save as CSV
    import csv
    csv_file = os.path.join(output_dir, "students.csv")
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        if students:
            writer = csv.DictWriter(f, fieldnames=students[0].keys())
            writer.writeheader()
            writer.writerows(students)
    
    # Print statistics
    total = len(students)
    placed = sum(1 for s in students if s["placed"])
    print(f"\n📊 Dataset Statistics:")
    print(f"   Total Students: {total}")
    print(f"   Placed: {placed} ({placed/total*100:.1f}%)")
    print(f"   Not Placed: {total-placed} ({(total-placed)/total*100:.1f}%)")
    
    print(f"\n📁 Branch-wise breakdown:")
    for branch in BRANCHES.keys():
        branch_students = [s for s in students if s["branch"] == branch]
        branch_placed = sum(1 for s in branch_students if s["placed"])
        print(f"   {branch}: {len(branch_students)} students, {branch_placed} placed ({branch_placed/len(branch_students)*100:.1f}%)")
    
    print(f"\n✅ Dataset saved to: {output_dir}")
    print(f"   - students.json")
    print(f"   - students.csv")

if __name__ == "__main__":
    # Generate dataset with 100 students per branch
    print("🎓 Generating BMSIT Student Dataset...")
    students = generate_dataset(num_students_per_branch=100, year="23")
    
    # Save to ml directory
    output_dir = os.path.join(os.path.dirname(__file__), "data")
    save_dataset(students, output_dir)
