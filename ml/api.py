"""
BMSIT Placement Prediction API
Flask API for placement prediction with BMSIT-specific features
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
import json

app = Flask(__name__)
CORS(app)

# Load Model & Artifacts
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
model = None
scaler = None
encoders = None
metadata = None

try:
    with open(os.path.join(MODEL_DIR, 'placement_model.pkl'), 'rb') as f:
        model = pickle.load(f)
    with open(os.path.join(MODEL_DIR, 'scaler.pkl'), 'rb') as f:
        scaler = pickle.load(f)
    with open(os.path.join(MODEL_DIR, 'encoders.pkl'), 'rb') as f:
        encoders = pickle.load(f)
    with open(os.path.join(MODEL_DIR, 'model_metadata.json'), 'r') as f:
        metadata = json.load(f)
    print("✅ Model, Scaler, and Encoders loaded successfully!")
    print(f"   Model Accuracy: {metadata.get('accuracy', 'N/A')}%")
    print(f"   Branches: {metadata.get('branches', [])}")
except Exception as e:
    print(f"❌ Error loading model artifacts: {str(e)}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("📥 Received Prediction Request:", data)
        
        # Extract features with safe defaults
        branch = data.get('Branch', 'CSE')
        gender = data.get('Gender', 'Male')
        
        cgpa = float(data.get('CGPA')) if data.get('CGPA') is not None else 7.0
        backlogs = int(data.get('Backlogs')) if data.get('Backlogs') is not None else 0
        dsa_score = int(data.get('DSA_Score')) if data.get('DSA_Score') is not None else 50
        projects = int(data.get('Projects')) if data.get('Projects') is not None else 1
        leetcode = int(data.get('LeetCode_Problems')) if data.get('LeetCode_Problems') is not None else 0
        certifications = int(data.get('Certifications')) if data.get('Certifications') is not None else 0
        internship = 1 if data.get('Internship') else 0
        communication = int(data.get('Communication_Score')) if data.get('Communication_Score') is not None else 3
        
        # Encode categorical features
        try:
            branch_enc = encoders['Branch'].transform([branch])[0]
        except:
            print(f"⚠️ Unknown branch: {branch}, defaulting to CSE")
            branch_enc = encoders['Branch'].transform(['CSE'])[0]
            
        try:
            gender_enc = encoders['Gender'].transform([gender])[0]
        except:
            gender_enc = 0
        
        # Feature order: Branch, Gender, CGPA, Backlogs, DSA_Score, Projects, LeetCode_Problems, Certifications, Internship, Communication_Score
        features = np.array([[
            branch_enc,
            gender_enc,
            cgpa,
            backlogs,
            dsa_score,
            projects,
            leetcode,
            certifications,
            internship,
            communication
        ]])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Predict
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]
        
        # Get feature importance from metadata
        feature_importance = metadata.get('feature_importance', {
            'DSA_Score': 25,
            'CGPA': 20,
            'Projects': 15,
            'Branch': 12,
            'LeetCode_Problems': 10,
            'Certifications': 8,
            'Communication_Score': 5,
            'Internship': 3,
            'Backlogs': 2
        })
        
        result = {
            'placed': bool(prediction),
            'confidence': round(max(probability) * 100, 2),
            'probability': {
                'placed': round(probability[1] * 100, 2),
                'not_placed': round(probability[0] * 100, 2)
            },
            'tips': generate_tips(cgpa, dsa_score, projects, leetcode, backlogs, internship, branch),
            'feature_importance': feature_importance
        }
        
        print(f"📤 Prediction: {'Placed' if prediction else 'Not Placed'} ({result['confidence']}% confidence)")
        return jsonify(result)

    except Exception as e:
        print(f"❌ Error predicting: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

def generate_tips(cgpa, dsa_score, projects, leetcode, backlogs, internship, branch):
    """Generate personalized improvement tips"""
    tips = []
    
    # CGPA tips
    if cgpa < 6.5:
        tips.append("🎯 Focus on improving your CGPA to at least 6.5. Many companies have this as a cutoff.")
    elif cgpa < 7.5:
        tips.append("📚 Try to push your CGPA above 7.5 for better opportunities.")
    
    # DSA tips (very important for tech)
    if dsa_score < 40:
        tips.append("💻 DSA is crucial! Practice on LeetCode/GeeksForGeeks daily. Aim for 50+ problems.")
    elif dsa_score < 60:
        tips.append("📝 Good DSA foundation! Focus on medium-hard problems to stand out in coding rounds.")
    
    # Projects tips
    if projects < 2:
        tips.append("🔧 Build at least 2-3 quality projects. Recruiters love seeing practical work!")
    
    # LeetCode tips
    if leetcode < 50 and branch in ['CSE', 'ISE', 'AIML']:
        tips.append("🏋️ Solve at least 100+ LeetCode problems before placement season.")
    
    # Backlogs penalty
    if backlogs > 0:
        tips.append("⚠️ Clear your backlogs ASAP! Many companies don't allow candidates with active backlogs.")
    
    # Internship tips
    if not internship and branch in ['CSE', 'ISE', 'AIML']:
        tips.append("💼 Try to get at least one internship - it significantly boosts your profile!")
    
    # Strong profile
    if cgpa >= 7.5 and dsa_score >= 60 and projects >= 2 and backlogs == 0:
        tips.append("🌟 Your profile looks strong! Focus on mock interviews and aptitude practice.")
    
    return tips

@app.route('/branches', methods=['GET'])
def get_branches():
    """Return available branches"""
    return jsonify({
        'branches': metadata.get('branches', ['CSE', 'ISE', 'ECE', 'EEE', 'ETE', 'AIML', 'Mechanical', 'Civil'])
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'accuracy': metadata.get('accuracy') if metadata else None
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
