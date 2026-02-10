import React, { useState } from "react";
import { mountWidget } from "skybridge/web";
import { useCallTool, useSendFollowUpMessage } from "skybridge/web";
import { useToolInfo } from "../helpers";
import "@/index.css";

// Michelin Brand Colors
const MICHELIN_COLORS = {
  primary: "#003478", // Official Michelin Blue
  secondary: "#0066CC", // Secondary Blue
  accent: "#FF6B00", // Orange accent
  light: "#F0F4FF", // Light blue background
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  border: "#E5E7EB",
};

interface TireQuestionnaireProps {
  // No props needed - data comes from useToolInfo hook
}

interface QuestionnaireData {
  vehicle: string;
  weather: string;
  road_type: string;
  priority: string;
}

interface TireResult {
  brand: string;
  product_name: string;
  rating: number;
  review_count: number;
  season: string;
  ev_compatible?: boolean;
  claim: string;
  details_url: string;
  image_url?: string;
  price?: string;
  sizes?: string[];
}

const MichelinTireQuestionnaire: React.FC<TireQuestionnaireProps> = () => {
  const [formData, setFormData] = useState<QuestionnaireData>({
    vehicle: "",
    weather: "",
    road_type: "",
    priority: "",
  });

  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (field: keyof QuestionnaireData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const { callToolAsync, isPending } = useCallTool<{ query: string }>(
    "specific-vehicle-search",
  );
  const sendMessage = useSendFollowUpMessage();

  const handleSearch = async () => {
    console.log("🔍 === SEARCH BUTTON CLICKED === 🔍");
    console.log("🔍 Form data:", formData);
    console.log("🔍 Vehicle:", formData.vehicle);
    console.log("🔍 Current isSearching:", isSearching);

    if (!formData.vehicle.trim()) {
      alert("Please enter your vehicle information");
      return;
    }

    console.log("🔍 Setting search state to true...");
    setIsSearching(true);

    const message = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "michelin-tire-questionnaire",
        arguments: {
          query: `Search for ${formData.vehicle}`,
          responses: formData,
        },
      },
    };

    console.log("📤 Sending postMessage:", JSON.stringify(message, null, 2));

    // Send the completed questionnaire data back to the same widget for processing
    await callToolAsync({
      query: "Audi A3 2020",
    });

    // window.parent?.postMessage(message, "*");
    sendMessage(
      "Search tire for Audi A3 2020 with summer tires for city-highway driving prioritizing comfort",
    );

    console.log("✅ PostMessage sent successfully");
  };

  const isFormValid = formData.vehicle.trim().length > 0;

  return (
    <div className="questionnaire-container">
      <form
        className="questionnaire-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        {/* Vehicle Input */}
        <div className="question-section">
          <label className="question-label">
            🚗 What is your vehicle? <span className="required">*</span>
          </label>
          <input
            type="text"
            className="vehicle-input"
            placeholder="e.g. Audi A3 2020, BMW X5 2023, Honda Civic 2021"
            value={formData.vehicle}
            onChange={(e) => handleInputChange("vehicle", e.target.value)}
            disabled={isSearching}
            required
          />
        </div>

        {/* Question 1: Weather */}
        <div className="question-section">
          <label className="question-label">
            🌤️ What kind of weather do you mostly drive in?
          </label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="weather"
                value="summer"
                checked={formData.weather === "summer"}
                onChange={(e) => handleInputChange("weather", e.target.value)}
                disabled={isSearching}
              />
              <span className="radio-label">Mostly warm – Summer</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="weather"
                value="winter"
                checked={formData.weather === "winter"}
                onChange={(e) => handleInputChange("weather", e.target.value)}
                disabled={isSearching}
              />
              <span className="radio-label">Cold or snowy – Winter</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="weather"
                value="all-season"
                checked={formData.weather === "all-season"}
                onChange={(e) => handleInputChange("weather", e.target.value)}
                disabled={isSearching}
              />
              <span className="radio-label">A mix of both – All season</span>
            </label>
          </div>
        </div>

        {/* Question 2: Road Types */}
        <div className="question-section">
          <label className="question-label">
            🛣️ What types of roads do you drive on most often?
          </label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="road_type"
                value="city-highway"
                checked={formData.road_type === "city-highway"}
                onChange={(e) => handleInputChange("road_type", e.target.value)}
                disabled={isSearching}
              />
              <span className="radio-label">City streets and highways</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="road_type"
                value="mixed-rural"
                checked={formData.road_type === "mixed-rural"}
                onChange={(e) => handleInputChange("road_type", e.target.value)}
                disabled={isSearching}
              />
              <span className="radio-label">
                A mix, including rural or hilly roads
              </span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="road_type"
                value="rough-unpaved"
                checked={formData.road_type === "rough-unpaved"}
                onChange={(e) => handleInputChange("road_type", e.target.value)}
                disabled={isSearching}
              />
              <span className="radio-label">Mainly rough or unpaved roads</span>
            </label>
          </div>
        </div>

        {/* Question 3: Priorities */}
        <div className="question-section">
          <label className="question-label">
            🎯 What's most important to you when choosing tyres?
          </label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="priority"
                value="comfort"
                checked={formData.priority === "comfort"}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                disabled={isSearching}
              />
              <span className="radio-label">Ride comfort and quietness</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="priority"
                value="handling"
                checked={formData.priority === "handling"}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                disabled={isSearching}
              />
              <span className="radio-label">
                Handling and cornering precision
              </span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="priority"
                value="durability"
                checked={formData.priority === "durability"}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                disabled={isSearching}
              />
              <span className="radio-label">Durability and wear life</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="priority"
                value="fuel-efficiency"
                checked={formData.priority === "fuel-efficiency"}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                disabled={isSearching}
              />
              <span className="radio-label">Fuel efficiency</span>
            </label>
          </div>
        </div>

        {/* Search Button */}
        <div className="search-section">
          <button
            type="submit"
            className="search-button"
            disabled={isSearching || !isFormValid}
          >
            {isSearching ? "🔍 Searching..." : "🔍 Search Michelin Tires"}
          </button>
        </div>
      </form>

      <style>{getQuestionnaireStyles()}</style>
    </div>
  );
};

function getQuestionnaireStyles() {
  return `
    .questionnaire-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Arial', 'Helvetica', 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, ${MICHELIN_COLORS.light} 0%, ${MICHELIN_COLORS.white} 50%, ${MICHELIN_COLORS.light} 100%);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 52, 120, 0.12);
    }

    .michelin-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 30px 20px 20px;
      background: ${MICHELIN_COLORS.white};
      border-radius: 12px;
      border: 2px solid ${MICHELIN_COLORS.primary};
    }

    .michelin-title {
      font-size: 32px;
      font-weight: 700;
      color: ${MICHELIN_COLORS.primary};
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
    }

    .michelin-subtitle {
      font-size: 18px;
      color: ${MICHELIN_COLORS.gray};
      margin: 0;
      line-height: 1.6;
    }

    .questionnaire-form {
      background: ${MICHELIN_COLORS.white};
      padding: 40px;
      border-radius: 16px;
      border: 1px solid ${MICHELIN_COLORS.border};
      box-shadow: 0 4px 16px rgba(0, 52, 120, 0.08);
    }

    .question-section {
      margin-bottom: 10px;
      border-bottom: 1px solid ${MICHELIN_COLORS.lightGray};
    }

    .question-section:last-of-type {
      border-bottom: none;
    }

    .question-label {
      display: block;
      font-size: 18px;
      font-weight: 600;
      color: ${MICHELIN_COLORS.primary};
      margin-bottom: 16px;
      line-height: 1.4;
    }

    .required {
      color: ${MICHELIN_COLORS.accent};
    }

    .vehicle-input {
      width: 100%;
      padding: 5px 10px;
      font-size: 16px;
      border: 2px solid ${MICHELIN_COLORS.border};
      border-radius: 10px;
      transition: all 0.3s ease;
      box-sizing: border-box;
      margin-bottom: 16px;
    }

    .vehicle-input:focus {
      outline: none;
      border-color: ${MICHELIN_COLORS.primary};
      box-shadow: 0 0 0 4px rgba(0, 52, 120, 0.1);
    }

    .vehicle-input:disabled {
      background-color: ${MICHELIN_COLORS.lightGray};
      color: ${MICHELIN_COLORS.gray};
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .radio-option {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      background: ${MICHELIN_COLORS.lightGray};
      border: 2px solid transparent;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .radio-option:hover {
      border-color: ${MICHELIN_COLORS.secondary};
      background: rgba(0, 102, 204, 0.05);
    }

    .radio-option input[type="radio"] {
      width: 20px;
      height: 20px;
      margin-right: 16px;
      accent-color: ${MICHELIN_COLORS.primary};
      cursor: pointer;
    }

    .radio-option input[type="radio"]:checked + .radio-label {
      color: ${MICHELIN_COLORS.primary};
      font-weight: 600;
    }

    .radio-option:has(input:checked) {
      background: rgba(0, 52, 120, 0.08);
      border-color: ${MICHELIN_COLORS.primary};
    }

    .radio-label {
      font-size: 16px;
      color: #374151;
      cursor: pointer;
      line-height: 1.4;
    }

    .search-section {
      border-top: 2px solid ${MICHELIN_COLORS.lightGray};
    }

    .search-button {
      width: 100%;
      background: linear-gradient(135deg, ${MICHELIN_COLORS.primary} 0%, ${MICHELIN_COLORS.secondary} 100%);
      color: ${MICHELIN_COLORS.white};
      font-size: 18px;
      font-weight: 600;
      padding: 18px 32px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(0, 52, 120, 0.3);
    }

    .search-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 52, 120, 0.4);
    }

    .search-button:disabled {
      background: ${MICHELIN_COLORS.gray};
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    @media (max-width: 768px) {
      .questionnaire-container {
        margin: 10px;
        padding: 15px;
      }
      
      .questionnaire-form {
        padding: 10px;
      }
      
      .michelin-title {
        font-size: 26px;
      }
      
      .question-label {
        font-size: 16px;
      }
    }
  `;
}

function getResultsStyles() {
  return `
    .questionnaire-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Arial', 'Helvetica', 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, ${MICHELIN_COLORS.light} 0%, ${MICHELIN_COLORS.white} 50%, ${MICHELIN_COLORS.light} 100%);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 52, 120, 0.12);
    }

    .results-header {
      text-align: center;
      margin-bottom: 30px;
      padding: 30px;
      background: ${MICHELIN_COLORS.white};
      border-radius: 12px;
      border: 2px solid ${MICHELIN_COLORS.primary};
    }

    .michelin-title {
      font-size: 28px;
      font-weight: 700;
      color: ${MICHELIN_COLORS.primary};
      margin: 0 0 20px 0;
      letter-spacing: -0.5px;
    }

    .user-selections {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      margin-top: 20px;
    }

    .selection-item {
      background: ${MICHELIN_COLORS.lightGray};
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      color: ${MICHELIN_COLORS.primary};
    }

    .tire-results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 30px;
    }

    .tire-card {
      background: ${MICHELIN_COLORS.white};
      border: 1px solid ${MICHELIN_COLORS.border};
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(0, 52, 120, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .tire-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 52, 120, 0.15);
    }

    .tire-card-header {
      margin-bottom: 16px;
    }

    .tire-title {
      font-size: 18px;
      font-weight: 600;
      color: ${MICHELIN_COLORS.primary};
      margin: 0 0 8px 0;
      line-height: 1.3;
    }

    .tire-rating {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .rating-stars {
      color: ${MICHELIN_COLORS.accent};
      font-weight: 600;
    }

    .rating-count {
      color: ${MICHELIN_COLORS.gray};
      font-size: 14px;
    }

    .tire-details {
      margin-bottom: 16px;
    }

    .tire-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding: 8px 0;
    }

    .info-label {
      font-weight: 600;
      color: ${MICHELIN_COLORS.primary};
    }

    .info-value {
      color: #374151;
    }

    .ev-badge {
      background: ${MICHELIN_COLORS.accent};
      color: ${MICHELIN_COLORS.white};
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .tire-claim {
      color: ${MICHELIN_COLORS.gray};
      font-style: italic;
      margin-bottom: 20px;
      line-height: 1.4;
      min-height: 40px;
    }

    .view-details-btn {
      width: 100%;
      background: linear-gradient(135deg, ${MICHELIN_COLORS.secondary} 0%, ${MICHELIN_COLORS.primary} 100%);
      color: ${MICHELIN_COLORS.white};
      font-weight: 600;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .view-details-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 52, 120, 0.3);
    }

    .results-actions {
      text-align: center;
      margin-top: 30px;
    }

    .back-button {
      background: ${MICHELIN_COLORS.lightGray};
      color: ${MICHELIN_COLORS.primary};
      font-weight: 600;
      padding: 12px 24px;
      border: 2px solid ${MICHELIN_COLORS.border};
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .back-button:hover {
      background: ${MICHELIN_COLORS.primary};
      color: ${MICHELIN_COLORS.white};
      border-color: ${MICHELIN_COLORS.primary};
    }

    @media (max-width: 768px) {
      .tire-results-grid {
        grid-template-columns: 1fr;
      }
      
      .user-selections {
        flex-direction: column;
        align-items: center;
      }
    }
  `;
}

export default MichelinTireQuestionnaire;

mountWidget(<MichelinTireQuestionnaire />);
