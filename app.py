from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load the model and encoders
model = joblib.load('models/house_price_model_2.joblib')
encoders = joblib.load('encoders/encoders_2.joblib')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Create feature array
        features = []
        
        # Add numeric features
        features.append(float(data['area']))
        bt_encoded_value = encoders['building_type'].transform([data['building_type']])[0]
        features.append(bt_encoded_value)
        bn_encoded_value = encoders['building_nature'].transform([data['building_nature']])[0]
        features.append(bn_encoded_value)
        features.append(float(data['num_bath_rooms']))
        features.append(float(data['num_bed_rooms']))
        purpose_encoded_value = encoders['purpose'].transform([data['purpose']])[0]
        features.append(purpose_encoded_value)
        locality_encoded_value = encoders['locality'].transform([data['locality']])[0]
        features.append(locality_encoded_value)
        zone_encoded_value = encoders['zone'].transform([data['zone']])[0]
        features.append(zone_encoded_value)
        
        # Make prediction
        features = np.array(features).reshape(1, -1)
        prediction = model.predict(features)[0]
        
        return jsonify({'prediction': round(prediction, 2)})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=8080)