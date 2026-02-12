import React, { useState, useEffect } from "react";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import "@/index.css";
interface TireData {
  URL: string;
  "Product Name": string;
  Brand: string;
  "Product Image": string;
  "Global Rating %": number;
  "Recommended %": number;
  "Review Count": number;
  Indicators?: Array<{ label: string; icon?: string }>;
  Badges?: Array<{ label: string; info: string }>;
  "Key Benefits"?: Array<{
    icon: string;
    title: string;
    description: string;
    image: string;
  }>;
  Warranties?: Array<{
    type: string;
    title: string;
    description: string;
    badge: string;
  }>;
  "Star Distribution"?: { [key: string]: number };
}

interface TireComparisonProps {
  // No props needed - data comes from useToolInfo hook
}

const TireComparison: React.FC<TireComparisonProps> = () => {
  let input, output;

  try {
    const toolInfo = useToolInfo();
    input = toolInfo.input;
    output = toolInfo.output;
  } catch (error) {
    console.error("❌ TireComparison hook error:", error);
    return (
      <div className="tire-error">
        <h3>⚠️ Widget Loading Error</h3>
        <p>Unable to initialize tire comparison widget.</p>
      </div>
    );
  }

  const [selectedTires, setSelectedTires] = useState<TireData[]>([]);

  // Extract data from output with proper typing
  const data = (output as any)?.structuredContent || output;

  // Extract server URL if available, fallback to localhost
  const serverUrl = (output as any)?.serverUrl || "http://localhost:3000";

  useEffect(() => {
    console.log("🛞 Tire Comparison received input:", input);
    console.log("🛞 Tire Comparison received output:", output);
    console.log("🛞 Extracted data:", data);
    console.log("🛞 Server URL extracted:", serverUrl);

    if (data?.tyres && data.tyres.length > 0) {
      // Log tire image URLs for debugging
      data.tyres.forEach((tire: TireData, index: number) => {
        console.log(`🛞 Tire ${index + 1} (${tire["Product Name"]}):`, {
          "Product Image": tire["Product Image"],
          URL: tire.URL,
          Brand: tire.Brand,
          "Proxy URL": getProxyImageUrl(tire["Product Image"]),
        });
      });

      // Auto-select first 2 tires for comparison
      setSelectedTires(data.tyres.slice(0, 2));
    }
  }, [data, serverUrl]);

  const handleTireSelection = (tire: TireData, isRemoving: boolean = false) => {
    if (isRemoving) {
      setSelectedTires((prev) => prev.filter((t) => t.URL !== tire.URL));
    } else {
      if (selectedTires.length < 3) {
        setSelectedTires((prev) => [...prev, tire]);
      }
    }
  };

  const getProxyImageUrl = (originalUrl?: string) => {
    if (!originalUrl) {
      console.log("🔧 No originalUrl provided, returning placeholder");
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
    }

    // Use serverUrl like the tire search widget does
    const proxyUrl = `${serverUrl}/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
    return proxyUrl;
  };

  const formatRating = (rating?: number): string => {
    if (!rating) return "N/A";
    return (rating / 20).toFixed(1); // Convert percentage to 5-star rating
  };

  if (!output) {
    return (
      <div className="michelin-comparison-container">
        <div className="michelin-header">
          <h2 className="michelin-title">Tire Comparison</h2>
          <p className="michelin-subtitle">Loading tire data...</p>
        </div>
      </div>
    );
  }

  if (!data?.tyres || data.tyres.length === 0) {
    return (
      <div className="michelin-comparison-container">
        <div className="michelin-header">
          <h2 className="michelin-title">Tire Comparison</h2>
          <p className="michelin-subtitle">No tires available for comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className="michelin-comparison-container">
      <div className="michelin-header">
        <h2 className="michelin-title">🔧 Michelin Tire Finder + Specs</h2>
        <p className="michelin-subtitle">
          Tool found compatible tyres • Select up to 3 for comparison • Ready
          for your analysis: {selectedTires.length}/3
        </p>
      </div>

      {/* Available Tires Section */}
      <div className="available-tires-section">
        <h3 className="section-title">Available Tires</h3>
        <div className="available-tires-grid">
          {data.tyres.map((tire: TireData) => {
            const isSelected = selectedTires.find((t) => t.URL === tire.URL);
            return (
              <div
                key={tire.URL}
                className={`tire-card ${isSelected ? "selected" : ""}`}
              >
                <div className="tire-image-container">
                  {tire["Product Image"] ? (
                    <img
                      src={getProxyImageUrl(tire["Product Image"])}
                      alt={tire["Product Name"]}
                      className="tire-image"
                      onLoad={() => {
                        console.log(
                          "✅ Tire image loaded successfully via proxy:",
                          tire["Product Image"],
                        );
                      }}
                      onError={(e) => {
                        console.error(
                          "❌ Tire image failed to load via proxy:",
                          tire["Product Image"],
                        );
                        const imgElement = e.currentTarget;
                        if (!imgElement) {
                          console.error(
                            "❌ No image element available for fallback",
                          );
                          return;
                        }

                        // Try original URL as fallback
                        const originalUrl = tire["Product Image"];
                        imgElement.src = originalUrl;

                        // If original also fails, use placeholder
                        imgElement.onerror = () => {
                          console.error(
                            "❌ Original tire image URL also failed:",
                            originalUrl,
                          );
                          if (imgElement) {
                            imgElement.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIiBzdHJva2U9IiNkZWUyZTYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5u+PC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5UaXJlIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                            imgElement.onerror = null; // Prevent infinite loop
                          }
                        };
                      }}
                      crossOrigin="anonymous"
                      loading="lazy"
                    />
                  ) : (
                    <div className="tire-placeholder">
                      <svg
                        width="140"
                        height="140"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="100%"
                          height="100%"
                          fill="#f8f9fa"
                          stroke="#dee2e6"
                          strokeWidth="2"
                        />
                        <text
                          x="50%"
                          y="40%"
                          fontFamily="Arial"
                          fontSize="16"
                          fill="#6c757d"
                          textAnchor="middle"
                          dy=".3em"
                        >
                          🛞
                        </text>
                        <text
                          x="50%"
                          y="60%"
                          fontFamily="Arial"
                          fontSize="12"
                          fill="#6c757d"
                          textAnchor="middle"
                          dy=".3em"
                        >
                          Tire Image
                        </text>
                      </svg>
                    </div>
                  )}
                  {tire["Global Rating %"] && (
                    <div className="tire-rating">
                      <span>★ {formatRating(tire["Global Rating %"])}</span>
                    </div>
                  )}
                </div>
                <div className="tire-info">
                  <h4 className="tire-name">{tire["Product Name"]}</h4>
                  <p className="tire-brand">{tire.Brand}</p>
                  {tire.Indicators && tire.Indicators.length > 0 && (
                    <p className="tire-size">{tire.Indicators[0].label}</p>
                  )}
                  <p className="tire-reviews">{tire["Review Count"]} Reviews</p>
                </div>
                <div className="tire-actions">
                  {isSelected ? (
                    <button
                      className="remove-btn"
                      onClick={() => handleTireSelection(tire, true)}
                    >
                      Remove from Comparison
                    </button>
                  ) : (
                    <button
                      className="add-btn"
                      onClick={() => handleTireSelection(tire)}
                      disabled={selectedTires.length >= 3}
                    >
                      Add to Comparison
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Section */}
      {selectedTires.length > 0 && (
        <div className="comparison-section">
          <h3 className="section-title">Comparison</h3>
          {/* Specification Table */}
          {selectedTires.length >= 2 && (
            <div className="specification-section">
              <h4 className="spec-section-title">Detailed Specifications</h4>
              <div className="specification-table">
                <div className="spec-table-header">
                  <div className="spec-label-column">Specification</div>
                  {selectedTires.map((tire: TireData) => (
                    <div key={tire.URL} className="spec-tire-column">
                      <span className="spec-tire-name">
                        {tire["Product Name"]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Basic Info Rows */}
                <div className="spec-row">
                  <div className="spec-label">Brand</div>
                  {selectedTires.map((tire: TireData) => (
                    <div key={tire.URL} className="spec-value">
                      {tire.Brand}
                    </div>
                  ))}
                </div>

                <div className="spec-row">
                  <div className="spec-label">Overall Rating</div>
                  {selectedTires.map((tire: TireData) => (
                    <div key={tire.URL} className="spec-value">
                      ★ {formatRating(tire["Global Rating %"])}
                    </div>
                  ))}
                </div>

                <div className="spec-row">
                  <div className="spec-label">Recommended %</div>
                  {selectedTires.map((tire: TireData) => (
                    <div key={tire.URL} className="spec-value">
                      {tire["Recommended %"]}%
                    </div>
                  ))}
                </div>

                <div className="spec-row">
                  <div className="spec-label">Review Count</div>
                  {selectedTires.map((tire: TireData) => (
                    <div key={tire.URL} className="spec-value">
                      {tire["Review Count"]}
                    </div>
                  ))}
                </div>

                {/* Star Distribution */}
                {selectedTires.some(
                  (tire: TireData) => tire["Star Distribution"],
                ) && (
                  <>
                    <div className="spec-row">
                      <div className="spec-label">5 Star Reviews</div>
                      {selectedTires.map((tire: TireData) => (
                        <div key={tire.URL} className="spec-value">
                          {tire["Star Distribution"]?.["5"] || 0}%
                        </div>
                      ))}
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">4 Star Reviews</div>
                      {selectedTires.map((tire: TireData) => (
                        <div key={tire.URL} className="spec-value">
                          {tire["Star Distribution"]?.["4"] || 0}%
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Key Benefits */}
                <div className="spec-row">
                  <div className="spec-label">Key Benefits</div>
                  {selectedTires.map((tire: TireData) => (
                    <div key={tire.URL} className="spec-value">
                      {tire["Key Benefits"]?.length || 0} Features
                    </div>
                  ))}
                </div>

                {/* Warranty */}
                <div className="spec-row">
                  <div className="spec-label">Warranty</div>
                  {selectedTires.map((tire: TireData) => (
                    <div key={tire.URL} className="spec-value">
                      {tire.Warranties?.[0]?.type?.replace(/-/g, " ") ||
                        "Standard"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Key Benefits Comparison */}
          {selectedTires.length >= 2 &&
            selectedTires.some(
              (tire: TireData) => tire["Key Benefits"]?.length,
            ) && (
              <div className="benefits-section">
                <h4 className="spec-section-title">Key Benefits Comparison</h4>
                <div className="benefits-grid">
                  {selectedTires.map((tire: TireData) => (
                    <div key={tire.URL} className="benefits-card">
                      <h5 className="benefits-tire-name">
                        {tire["Product Name"]}
                      </h5>
                      <ul className="benefits-list">
                        {tire["Key Benefits"]
                          ?.slice(0, 3)
                          .map((benefit, index) => (
                            <li key={index} className="benefit-item">
                              <strong>{benefit.icon}</strong> {benefit.title}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default TireComparison;

mountWidget(<TireComparison />);
