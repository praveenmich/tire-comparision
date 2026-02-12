import React, { useState } from "react";
import { mountWidget } from "skybridge/web";
import { useSendFollowUpMessage } from "skybridge/web";
import "@/index.css";

// Updated Colors matching Vehicle Types UI
const MICHELIN_COLORS = {
  primary: "#1e3a8a", // Deep blue
  secondary: "#27509b", // Bright blue
  accent: "#60a5fa", // Light blue accent
  light: "#eff6ff", // Very light blue background
  white: "#FFFFFF",
  gray: "#64748b", // Slate gray
  lightGray: "#f1f5f9", // Light slate
  border: "#e2e8f0", // Border slate
  text: "#1e293b", // Dark slate text
  textLight: "#475569", // Medium slate text
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

  const sendFollowUp = useSendFollowUpMessage();

  const handleSearch = async () => {
    console.log("🔍 === SEARCH BUTTON CLICKED === 🔍");
    console.log("🔍 Form data:", formData);
    console.log("🔍 Vehicle:", formData.vehicle);

    if (!formData.vehicle.trim()) {
      alert("Please enter your vehicle information");
      return;
    }

    setIsSearching(true);

    try {
      console.log(
        "📡 Sending follow-up message with vehicle:",
        formData.vehicle,
      );

      // Send a follow-up message that ChatGPT will interpret and route to specific-vehicle-search
      sendFollowUp(`Search tires for ${formData.vehicle}`);

      console.log("✅ Follow-up message sent");
    } catch (error) {
      console.error("❌ Search failed:", error);
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const isFormValid = formData.vehicle.trim().length > 0;

  return (
    <div className="questionnaire-container">
      {/* Compact Header */}
      <div className="michelin-header">
        <div className="michelin-logo">MICHELIN</div>
        <div className="tagline">Find Your Perfect Tire</div>
      </div>

      <form
        className="questionnaire-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        {/* Vehicle Input */}
        <div className="question-section full-width">
          <div className="question-header">
            <span className="question-icon">🚗</span>
            <label className="question-label">
              What is your vehicle? <span className="required">*</span>
            </label>
          </div>
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

        {/* Questions Grid - 2 columns */}
        <div className="questions-grid">
          {/* Question 1: Weather */}
          <div className="question-section">
            <div className="question-header">
              <span className="question-icon">🌤️</span>
              <label className="question-label">
                What kind of weather do you mostly drive in?
              </label>
            </div>
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
                <div className="radio-content">
                  <span className="radio-label">Mostly warm – Summer</span>
                </div>
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
                <div className="radio-content">
                  <span className="radio-label">Cold or snowy – Winter</span>
                </div>
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
                <div className="radio-content">
                  <span className="radio-label">
                    A mix of both – All season
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Question 2: Road Types */}
          <div className="question-section">
            <div className="question-header">
              <span className="question-icon">🛣️</span>
              <label className="question-label">
                What types of roads do you drive on most often?
              </label>
            </div>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="road_type"
                  value="city-highway"
                  checked={formData.road_type === "city-highway"}
                  onChange={(e) =>
                    handleInputChange("road_type", e.target.value)
                  }
                  disabled={isSearching}
                />
                <div className="radio-content">
                  <span className="radio-label">City streets and highways</span>
                </div>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="road_type"
                  value="mixed-rural"
                  checked={formData.road_type === "mixed-rural"}
                  onChange={(e) =>
                    handleInputChange("road_type", e.target.value)
                  }
                  disabled={isSearching}
                />
                <div className="radio-content">
                  <span className="radio-label">
                    A mix, including rural or hilly roads
                  </span>
                </div>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="road_type"
                  value="rough-unpaved"
                  checked={formData.road_type === "rough-unpaved"}
                  onChange={(e) =>
                    handleInputChange("road_type", e.target.value)
                  }
                  disabled={isSearching}
                />
                <div className="radio-content">
                  <span className="radio-label">
                    Mainly rough or unpaved roads
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Question 3: Priorities - Full Width */}
        <div className="question-section full-width">
          <div className="question-header">
            <span className="question-icon">🎯</span>
            <label className="question-label">
              What's most important to you when choosing tyres?
            </label>
          </div>
          <div className="radio-group horizontal">
            <label className="radio-option">
              <input
                type="radio"
                name="priority"
                value="comfort"
                checked={formData.priority === "comfort"}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                disabled={isSearching}
              />
              <div className="radio-content">
                <span className="radio-label">Ride comfort and quietness</span>
              </div>
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
              <div className="radio-content">
                <span className="radio-label">
                  Handling and cornering precision
                </span>
              </div>
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
              <div className="radio-content">
                <span className="radio-label">Durability and wear life</span>
              </div>
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
              <div className="radio-content">
                <span className="radio-label">Fuel efficiency</span>
              </div>
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
            {isSearching ? (
              <>
                <span className="button-spinner"></span>
                Searching for Perfect Tires...
              </>
            ) : (
              <>
                <span className="button-icon">🔍</span>
                Search Michelin Tires
              </>
            )}
          </button>
        </div>
      </form>

      <style>{getQuestionnaireStyles()}</style>
    </div>
  );
};

function getQuestionnaireStyles() {
  return `
    * {
      box-sizing: border-box;
    }

    .questionnaire-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      background: ${MICHELIN_COLORS.white};
    }

    /* Compact Header Section */
    .michelin-header {
      text-align: center;
      margin-bottom: 16px;
      padding: 16px 20px;
      background: linear-gradient(135deg, #00396B 0%, #004080 100%);
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 57, 107, 0.2);
    }

    .michelin-logo {
      font-size: 24px;
      font-weight: 700;
      color: ${MICHELIN_COLORS.white};
      letter-spacing: 2px;
      margin-bottom: 2px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .tagline {
      font-size: 13px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.9);
      letter-spacing: 0.3px;
    }

    /* Form Container */
    .questionnaire-form {
      background: ${MICHELIN_COLORS.white};
      padding: 24px;
      border-radius: 12px;
      border: 1px solid ${MICHELIN_COLORS.border};
    }

    /* Questions Grid for 2-column layout */
    .questions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }

    /* Question Sections */
    .question-section {
      margin-bottom: 20px;
    }

    .question-section.full-width {
      grid-column: 1 / -1;
    }

    .question-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .question-icon {
      font-size: 20px;
      line-height: 1;
    }

    .question-label {
      font-size: 15px;
      font-weight: 600;
      color: ${MICHELIN_COLORS.text};
      margin: 0;
      line-height: 1.4;
    }

    .required {
      color: #ef4444;
      font-weight: 700;
    }

    /* Vehicle Input */
    .vehicle-input {
      width: 100%;
      padding: 10px 14px;
      font-size: 14px;
      border: 1px solid ${MICHELIN_COLORS.border};
      border-radius: 8px;
      transition: all 0.2s ease;
      background: ${MICHELIN_COLORS.white};
      color: ${MICHELIN_COLORS.text};
      font-family: inherit;
    }

    .vehicle-input::placeholder {
      color: ${MICHELIN_COLORS.gray};
    }

    .vehicle-input:focus {
      outline: none;
      border-color: ${MICHELIN_COLORS.secondary};
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .vehicle-input:disabled {
      background-color: ${MICHELIN_COLORS.lightGray};
      color: ${MICHELIN_COLORS.gray};
      cursor: not-allowed;
    }

    /* Radio Group */
    .radio-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .radio-group.horizontal {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .radio-option {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      background: ${MICHELIN_COLORS.white};
      border: 1px solid ${MICHELIN_COLORS.border};
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .radio-option:hover:not(:has(input:disabled)) {
      border-color: ${MICHELIN_COLORS.secondary};
      background: ${MICHELIN_COLORS.light};
    }

    .radio-option:has(input:checked) {
      background: rgba(59, 130, 246, 0.08);
      border-color: ${MICHELIN_COLORS.secondary};
    }

    .radio-option:has(input:checked)::after {
      content: '✓';
      position: absolute;
      right: 12px;
      color: ${MICHELIN_COLORS.secondary};
      font-weight: 700;
      font-size: 16px;
    }

    .radio-option input[type="radio"] {
      width: 18px;
      height: 18px;
      margin-right: 12px;
      accent-color: ${MICHELIN_COLORS.secondary};
      cursor: pointer;
      flex-shrink: 0;
    }

    .radio-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      padding-right: 24px;
    }

    .radio-label {
      font-size: 14px;
      font-weight: 500;
      color: ${MICHELIN_COLORS.text};
      cursor: pointer;
      line-height: 1.3;
    }

    .radio-option:has(input:checked) .radio-label {
      color: ${MICHELIN_COLORS.secondary};
    }

    .radio-sublabel {
      font-size: 12px;
      color: ${MICHELIN_COLORS.textLight};
      line-height: 1.3;
    }

    /* Search Section */
    .search-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid ${MICHELIN_COLORS.border};
    }

    .search-button {
      width: 100%;
      background: ${MICHELIN_COLORS.secondary};
      color: ${MICHELIN_COLORS.white};
      font-size: 15px;
      font-weight: 600;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: inherit;
    }

    .search-button:hover:not(:disabled) {
      background: #3a61a6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .search-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .search-button:disabled {
      background: #e5e5e5;
      color: #999;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .button-icon {
      font-size: 16px;
      line-height: 1;
    }

    .button-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: ${MICHELIN_COLORS.white};
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .questionnaire-container {
        padding: 12px;
      }
      
      .michelin-header {
        padding: 16px;
        margin-bottom: 16px;
      }

      .michelin-logo {
        font-size: 24px;
      }

      .tagline {
        font-size: 13px;
      }
      
      .questionnaire-form {
        padding: 16px;
      }

      .questions-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .radio-group {
        grid-template-columns: 1fr;
      }

      .radio-group.horizontal {
        grid-template-columns: 1fr;
      }

      .question-section {
        margin-bottom: 16px;
      }

      .question-header {
        gap: 6px;
      }

      .question-icon {
        font-size: 18px;
      }
      
      .question-label {
        font-size: 14px;
      }

      .vehicle-input {
        padding: 10px 12px;
        font-size: 14px;
      }

      .radio-option {
        padding: 10px;
      }

      .radio-label {
        font-size: 13px;
      }

      .search-button {
        font-size: 14px;
        padding: 12px 20px;
      }
    }
  `;
}

export default MichelinTireQuestionnaire;

mountWidget(<MichelinTireQuestionnaire />);
