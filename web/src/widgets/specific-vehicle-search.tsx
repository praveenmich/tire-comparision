import "@/index.css";

import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { SearchHeader } from "./components/SearchHeader";
import { TireGrid } from "./components/TireGrid";

interface Tire {
  brand: string;
  product_name: string;
  rating: string;
  review_count: number;
  season: string;
  ev_compatible: boolean;
  claim: string;
  image_url: string;
  details_url: string;
  sizes_url: string;
}

export function TireSearchGrid({
  tires,
  message,
  totalFound,
  vehicleQuery,
  serverUrl,
}: {
  tires: Tire[];
  message: string;
  totalFound: number;
  vehicleQuery: string;
  serverUrl?: string;
}) {
  const handleCompare = () => {
    const tireDetailsUrls = tires?.map((tire) => tire.details_url).filter(Boolean) || [];
    
    console.log("🚀 Triggering tire comparison with URLs:", tireDetailsUrls);
    
    if (tireDetailsUrls.length > 0) {
      window.parent?.postMessage(
        {
          type: "mcp_tool_call",
          tool: "tire-comparison",
          args: {
            tireUrls: tireDetailsUrls,
          },
        },
        "*",
      );
    }
  };

  console.log("🛞 TireSearchGrid rendering with data:", {
    tiresCount: tires?.length || 0,
    message,
    totalFound,
    vehicleQuery,
    serverUrl,
  });

  // Log all tire image URLs for debugging
  tires?.forEach((tire, index) => {
    console.log(`🖼️ Tire ${index + 1} image URL:`, tire.image_url);
    console.log(`🛞 Tire ${index + 1} details:`, {
      brand: tire.brand,
      product_name: tire.product_name,
      image_url: tire.image_url,
      hasImageUrl: !!tire.image_url,
    });
  });

  return (
    <div className="tire-search-widget">
      <SearchHeader
        message={message}
        vehicleQuery={vehicleQuery}
        totalFound={totalFound}
      />

      <TireGrid tires={tires} serverUrl={serverUrl} />

      <div className="compare-section">
        <button className="compare-button" onClick={handleCompare}>
          <span className="compare-icon">🔄</span>
          Compare These Tires
        </button>
      </div>

      <style>{`
        .tire-search-widget {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0;
          font-family: 'Arial', 'Helvetica', 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f0f4ff 100%);
          height: auto;
        }

        .compare-section {
          padding: 20px;
          text-align: center;
          background: white;
          border-top: 1px solid #e2e8f0;
          margin-top: 20px;
        }

        .compare-button {
          background: linear-gradient(135deg, #00396B 0%, #004080 100%);
          color: white;
          font-size: 16px;
          font-weight: 600;
          padding: 14px 32px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(0, 57, 107, 0.3);
        }

        .compare-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 57, 107, 0.4);
        }

        .compare-button:active {
          transform: translateY(0);
        }

        .compare-icon {
          font-size: 20px;
        }

        @media (max-width: 768px) {
          .tire-search-widget {
            padding: 0;
          }
          
          .compare-section {
            padding: 16px;
          }
          
          .compare-button {
            font-size: 14px;
            padding: 12px 24px;
          }
        }
      `}</style>
    </div>
  );
}

function SpecificVehicleSearch() {
  let input, output;

  try {
    const toolInfo = useToolInfo();
    input = toolInfo.input;
    output = toolInfo.output;
  } catch (error) {
    console.error("❌ SpecificVehicleSearch hook error:", error);
    return (
      <div className="tire-error">
        <h3>⚠️ Widget Loading Error</h3>
        <p>Unable to initialize specific vehicle search widget.</p>
      </div>
    );
  }

  console.log("🔍 SpecificVehicleSearch Widget Rendering");
  console.log("📥 Input received:", JSON.stringify(input, null, 2));
  console.log("📤 Output received:", JSON.stringify(output, null, 2));
  console.log("📤 Output keys:", Object.keys(output || {}));
  console.log("📤 Output type:", typeof output);

  if (!output) {
    console.log("⏳ No output yet, showing loading state");
    return <div className="tire-loading">Searching for tires...</div>;
  }

  // Check all possible data structure paths
  const structuredData = (output as any)?.structuredContent;
  const outputData = output as any;

  console.log("🔧 Structured data:", structuredData);
  console.log("🔧 Output data keys:", Object.keys(outputData || {}));
  console.log("🛞 Checking for tires in various paths...");

  // Path 1: structuredContent.tires
  if (structuredData?.tires && structuredData.tires.length > 0) {
    console.log("✅ Found tires at structuredContent.tires");
    return (
      <TireSearchGrid
        tires={structuredData.tires}
        message={structuredData.message || "Tire Search Results"}
        totalFound={structuredData.tires?.length || 0}
        vehicleQuery={structuredData.vehicleQuery || ""}
        serverUrl={structuredData.serverUrl}
      />
    );
  }

  // Path 2: output.tires directly
  if (outputData?.tires && outputData.tires.length > 0) {
    console.log("✅ Found tires at output.tires");
    return (
      <TireSearchGrid
        tires={outputData.tires}
        message={outputData.message || "Tire Search Results"}
        totalFound={outputData.tires?.length || 0}
        vehicleQuery={outputData.vehicleQuery || ""}
        serverUrl={outputData.serverUrl}
      />
    );
  }

  // Path 3: searchResults nested structure
  if (
    structuredData?.searchResults?.data &&
    Array.isArray(structuredData.searchResults.data)
  ) {
    console.log("✅ Found tire data in structuredContent.searchResults.data");
    return (
      <TireSearchGrid
        tires={structuredData.searchResults.data}
        message={structuredData.searchResults.message || "Tire Search Results"}
        totalFound={structuredData.searchResults.data?.length || 0}
        vehicleQuery={structuredData.searchResults.vehicleQuery || ""}
        serverUrl={structuredData.serverUrl}
      />
    );
  }

  // Path 4: Check if there's tire data anywhere in the output
  const findTireData = (obj: any, path = ""): any => {
    if (!obj || typeof obj !== "object") return null;

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      console.log(`🔍 Checking path: ${currentPath}`, value);

      if (
        key === "data" &&
        Array.isArray(value) &&
        value.length > 0 &&
        value[0]?.brand
      ) {
        console.log(`✅ Found tire data at path: ${currentPath}`);
        return { path: currentPath, data: value, parent: obj };
      }

      if (typeof value === "object" && value !== null) {
        const result = findTireData(value, currentPath);
        if (result) return result;
      }
    }
    return null;
  };

  const foundData = findTireData(output);
  if (foundData) {
    console.log("✅ Found tire data dynamically at:", foundData.path);
    return (
      <TireSearchGrid
        tires={foundData.data}
        message={foundData.parent.message || (output as any)?.structuredContent?.message || "Tire Search Results"}
        totalFound={foundData.data?.length || 0}
        vehicleQuery={foundData.parent.vehicleQuery || (output as any)?.structuredContent?.vehicleQuery || ""}
        serverUrl={
          foundData.parent.serverUrl ||
          (output as any)?.structuredContent?.serverUrl
        }
      />
    );
  }

  // Fallback to text content
  const content = (output as any)?.content;
  if (content && content[0]?.text) {
    console.log("📝 Rendering fallback text content");
    return (
      <div className="tire-search-fallback">
        <h3>🔍 Tire Search Results</h3>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>
          {content[0].text}
        </pre>
      </div>
    );
  }

  console.log("❌ No valid data found in output");
  return (
    <div className="tire-search-error">
      <h3>🔍 Tire Search</h3>
      <p>No tire data available</p>
      <details>
        <summary>Debug Info (Click to expand)</summary>
        <pre style={{ fontSize: "10px", maxHeight: "300px", overflow: "auto" }}>
          {JSON.stringify(output, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default SpecificVehicleSearch;

mountWidget(<SpecificVehicleSearch />);
