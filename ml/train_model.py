"""
BMSIT Placement Prediction Model Training
Trains a Random Forest model on BMSIT-specific placement data
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import os
import json

def train_model():
    # Paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, 'data', 'bmsit_placement_data.csv')
    model_dir = os.path.join(script_dir, 'models')
    os.makedirs(model_dir, exist_ok=True)
    
    # Load data
    print("📂 Loading BMSIT placement data...")
    df = pd.read_csv(data_path)
    print(f"   Total records: {len(df)}")
    
    # Features and target
    feature_cols = [
        'Branch', 'Gender', 'CGPA', 'Backlogs', 
        'DSA_Score', 'Projects', 'LeetCode_Problems',
        'Certifications', 'Internship', 'Communication_Score'
    ]
    target_col = 'PlacedOrNot'
    
    X = df[feature_cols].copy()
    y = df[target_col].copy()
    
    # Encode categorical features
    print("🔄 Encoding categorical features...")
    encoders = {}
    
    # Encode Branch
    le_branch = LabelEncoder()
    X['Branch'] = le_branch.fit_transform(X['Branch'])
    encoders['Branch'] = le_branch
    print(f"   Branches: {list(le_branch.classes_)}")
    
    # Encode Gender
    le_gender = LabelEncoder()
    X['Gender'] = le_gender.fit_transform(X['Gender'])
    encoders['Gender'] = le_gender
    print(f"   Genders: {list(le_gender.classes_)}")
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    print("📏 Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest
    print("🌲 Training Random Forest...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    print("\n📊 Model Evaluation:")
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"   Accuracy: {accuracy*100:.2f}%")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
    print(f"   5-Fold CV Accuracy: {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*100:.2f}%)")
    
    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Not Placed', 'Placed']))
    
    # Feature importance
    print("\n🎯 Feature Importance:")
    feature_importance = dict(zip(feature_cols, model.feature_importances_))
    for feature, importance in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True):
        print(f"   {feature}: {importance*100:.1f}%")
    
    # Save artifacts
    print("\n💾 Saving model artifacts...")
    
    with open(os.path.join(model_dir, 'placement_model.pkl'), 'wb') as f:
        pickle.dump(model, f)
    
    with open(os.path.join(model_dir, 'scaler.pkl'), 'wb') as f:
        pickle.dump(scaler, f)
    
    with open(os.path.join(model_dir, 'encoders.pkl'), 'wb') as f:
        pickle.dump(encoders, f)
    
    # Save metadata
    metadata = {
        'features': feature_cols,
        'target': target_col,
        'accuracy': round(accuracy * 100, 2),
        'cv_accuracy': round(cv_scores.mean() * 100, 2),
        'feature_importance': {k: round(v * 100, 1) for k, v in feature_importance.items()},
        'branches': list(le_branch.classes_),
        'n_samples': len(df)
    }
    
    with open(os.path.join(model_dir, 'model_metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("✅ Model training complete!")
    print(f"   Model saved to: {model_dir}")
    
    return model, scaler, encoders

if __name__ == "__main__":
    train_model()
