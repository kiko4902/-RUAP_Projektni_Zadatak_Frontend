import React, { useState } from "react";
import './App.css';

function Modal({ prediction, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Prediction Result</h2>
        <p>{prediction}</p>
        <p style={{ color: "gray", fontSize: "0.8em" }}>
          Disclaimer: This prediction is based on a machine learning model and is not entirely accurate.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const [formData, setFormData] = useState({
    General_Health: "",
    Checkup: "",
    Exercise: false,
    Skin_Cancer: false,
    Other_Cancer: false,
    Depression: false,
    Diabetes: false,
    Arthritis: false,
    Age_Category: "",
    Height_cm: "",
    Weight_kg: "",
    BMI: "",
    Smoking_History: false,
    Alcohol_Consumption: "",
    Fruit_Consumption: "",
    Green_Vegetables_Consumption: "",
    FriedPotato_Consumption: "",
    Sex_Female: false,
    Sex_Male: false,
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" || type === "radio") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateNumericInput = (value) => {
    return !isNaN(value) && value >= 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure numeric values and calculate BMI
    if (!validateNumericInput(formData.Height_cm) || !validateNumericInput(formData.Weight_kg)) {
      alert("Height and Weight must be numeric and positive values.");
      return;
    }

    const heightInMeters = formData.Height_cm / 100;
    const bmi = (formData.Weight_kg / (heightInMeters * heightInMeters)).toFixed(2);
    setFormData({ ...formData, BMI: bmi });

    // Validate numeric consumption values
    const consumptionFields = [
      "Alcohol_Consumption",
      "Fruit_Consumption",
      "Green_Vegetables_Consumption",
      "FriedPotato_Consumption",
    ];

    for (const field of consumptionFields) {
      if (!validateNumericInput(formData[field])) {
        alert(`${field} must be a positive numeric value.`);
        return;
      }
    }

    const requestData = {
      data: [
        [
          parseInt(formData.General_Health),
          parseInt(formData.Checkup),
          formData.Exercise ? 1 : 0,
          formData.Skin_Cancer ? 1 : 0,
          formData.Other_Cancer ? 1 : 0,
          formData.Depression ? 1 : 0,
          formData.Diabetes ? 1 : 0,
          formData.Arthritis ? 1 : 0,
          parseInt(formData.Age_Category),
          parseInt(formData.Height_cm),
          parseInt(formData.Weight_kg),
          parseFloat(bmi),
          formData.Smoking_History ? 1 : 0,
          parseInt(formData.Alcohol_Consumption),
          parseInt(formData.Fruit_Consumption),
          parseInt(formData.Green_Vegetables_Consumption),
          parseInt(formData.FriedPotato_Consumption),
          formData.Sex_Female ? 1 : 0,
          formData.Sex_Male ? 1 : 0,
        ]
      ]
    };

    console.log("Sending request:", JSON.stringify(requestData));

    try {
      const response = await fetch("/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const result = await response.json();
      console.log("Response from model:", result); // Log the response
  
      // Check the prediction result
      const predictionText = result.predictions[0] === 1
        ? "You have a higher risk of cardiovascular diseases."
        : "You are at lower risk for cardiovascular diseases.";
  
      setPrediction(predictionText);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Failed to get a prediction.");
      setIsModalOpen(true);
    }
  };
  return (
    <div>
      <h1>Cardiovascular Diseases Risk Predictor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>General Health: </label>
          <select
            name="General_Health"
            value={formData.General_Health}
            onChange={handleChange}
            required
          >
            <option value="" disabled selected>Select an option</option>
            <option value="0">Poor</option>
            <option value="1">Fair</option>
            <option value="2">Good</option>
            <option value="3">Very Good</option>
            <option value="4">Excellent</option>
          </select>
        </div>

        <div>
          <label>Checkup: </label>
          <select
            name="Checkup"
            value={formData.Checkup}
            onChange={handleChange}
            required
          >
            <option value="" disabled selected>Select an option</option>
            <option value="4">Within the past year</option>
            <option value="2">Within the past 2 years</option>
            <option value="1">Within the past 5 years</option>
            <option value="0.2">5 or more years ago</option>
            <option value="0">Never</option>
          </select>
        </div>

        <div className="checkbox-group">
          <label>Do you exercise regularly?</label>
          <input
            type="checkbox"
            name="Exercise"
            checked={formData.Exercise}
            onChange={handleChange}
          />
        </div>

        <div className="checkbox-group">
          <label>Did you ever have skin cancer?</label>
          <input
            type="checkbox"
            name="Skin_Cancer"
            checked={formData.Skin_Cancer}
            onChange={handleChange}
          />
        </div>

        <div className="checkbox-group">
          <label>Did you ever have any other type of cancer?</label>
          <input
            type="checkbox"
            name="Other_Cancer"
            checked={formData.Other_Cancer}
            onChange={handleChange}
          />
        </div>

        <div className="checkbox-group">
          <label>Did you ever have depression?</label>
          <input
            type="checkbox"
            name="Depression"
            checked={formData.Depression}
            onChange={handleChange}
          />
        </div>

        <div className="checkbox-group">
          <label>Do you have diabetes?</label>
          <input
            type="checkbox"
            name="Diabetes"
            checked={formData.Diabetes}
            onChange={handleChange}
          />
        </div>

        <div className="checkbox-group">
          <label>Do you have arthritis?</label>
          <input
            type="checkbox"
            name="Arthritis"
            checked={formData.Arthritis}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Age Category: </label>
          <select
            name="Age_Category"
            value={formData.Age_Category}
            onChange={handleChange}
            required
          >
            <option value="" disabled selected>Select an option</option>
            <option value="0">18-24</option>
            <option value="1">25-29</option>
            <option value="2">30-34</option>
            <option value="3">35-39</option>
            <option value="4">40-44</option>
            <option value="5">45-49</option>
            <option value="6">50-54</option>
            <option value="7">55-59</option>
            <option value="8">60-64</option>
            <option value="9">65-69</option>
            <option value="10">70-74</option>
            <option value="11">75-79</option>
            <option value="12">80+</option>
          </select>
        </div>

        <div>
          <label>Height (cm): </label>
          <input
            type="number"
            name="Height_cm"
            value={formData.Height_cm}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Weight (kg): </label>
          <input
            type="number"
            name="Weight_kg"
            value={formData.Weight_kg}
            onChange={handleChange}
            required
          />
        </div>

        <div className="checkbox-group">
          <label>Smoking History: </label>
          <input
            type="checkbox"
            name="Smoking_History"
            checked={formData.Smoking_History}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>How many times a month do you consume Alcohol? </label>
          <input
            type="number"
            name="Alcohol_Consumption"
            value={formData.Alcohol_Consumption}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div>
          <label>How many times a month do you consume Fruit? </label>
          <input
            type="number"
            name="Fruit_Consumption"
            value={formData.Fruit_Consumption}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div>
          <label>How many times a month do you consume Vegetables? </label>
          <input
            type="number"
            name="Green_Vegetables_Consumption"
            value={formData.Green_Vegetables_Consumption}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div>
          <label>How many times a month do you consume Fried Potatoes? </label>
          <input
            type="number"
            name="FriedPotato_Consumption"
            value={formData.FriedPotato_Consumption}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="radio-group">
          <label>Sex: </label>
          <input
            type="radio"
            name="Sex_Female"
            value="true"
            checked={formData.Sex_Female}
            onChange={(e) => {
              setFormData({ ...formData, Sex_Female: true, Sex_Male: false });
            }}
          />
          Female
          <input
            type="radio"
            name="Sex_Male"
            value="true"
            checked={formData.Sex_Male}
            onChange={(e) => {
              setFormData({ ...formData, Sex_Female: false, Sex_Male: true });
            }}
          />
          Male
        </div>


        <button type="submit">Submit</button>
      </form>

      {isModalOpen && <Modal prediction={prediction} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
export default App;
