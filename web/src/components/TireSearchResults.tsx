import { SearchHeader } from "../widgets/components/SearchHeader";
import { TireGrid } from "../widgets/components/TireGrid";

export interface Tire {
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

export interface TireSearchData {
  tires: Tire[];
  message: string;
  totalFound: number;
  vehicleQuery: string;
  serverUrl?: string;
}

// Helper to extract tire data from any output shape
export function extractTireData(output: any): TireSearchData | null {
  if (!output) return null;

  const structuredData = output?.structuredContent;
  const outputData = output;

  // Path 1: structuredContent.tires
  if (structuredData?.tires?.length > 0) {
    return {
      tires: structuredData.tires,
      message: structuredData.message || "Tire Search Results",
      totalFound: structuredData.tires.length,
      vehicleQuery: structuredData.vehicleQuery || "",
      serverUrl: structuredData.serverUrl,
    };
  }

  // Path 2: output.tires directly
  if (outputData?.tires?.length > 0) {
    return {
      tires: outputData.tires,
      message: outputData.message || "Tire Search Results",
      totalFound: outputData.tires.length,
      vehicleQuery: outputData.vehicleQuery || "",
      serverUrl: outputData.serverUrl,
    };
  }

  // Path 3: searchResults nested structure
  if (structuredData?.searchResults?.data?.length > 0) {
    return {
      tires: structuredData.searchResults.data,
      message: structuredData.searchResults.message || "Tire Search Results",
      totalFound: structuredData.searchResults.data.length,
      vehicleQuery: structuredData.searchResults.vehicleQuery || "",
      serverUrl: structuredData.serverUrl,
    };
  }

  // Path 4: Deep search for tire data
  const findTireData = (obj: any): any => {
    if (!obj || typeof obj !== "object") return null;
    for (const [key, value] of Object.entries(obj)) {
      if (
        key === "data" &&
        Array.isArray(value) &&
        value.length > 0 &&
        (value[0] as any)?.brand
      ) {
        return { data: value, parent: obj };
      }
      if (typeof value === "object" && value !== null) {
        const result = findTireData(value);
        if (result) return result;
      }
    }
    return null;
  };

  const foundData = findTireData(output);
  if (foundData) {
    return {
      tires: foundData.data,
      message:
        foundData.parent.message ||
        structuredData?.message ||
        "Tire Search Results",
      totalFound: foundData.data.length,
      vehicleQuery:
        foundData.parent.vehicleQuery || structuredData?.vehicleQuery || "",
      serverUrl: foundData.parent.serverUrl || structuredData?.serverUrl,
    };
  }

  return null;
}

// Reusable UI component — no Skybridge hooks, pure props
export function TireSearchGrid({
  tires,
  message,
  totalFound,
  vehicleQuery,
  serverUrl,
  onCompare,
  isComparing,
}: TireSearchData & { onCompare?: () => void; isComparing?: boolean }) {
  return (
    <div className="tire-search-widget">
      <SearchHeader
        message={message}
        vehicleQuery={vehicleQuery}
        totalFound={totalFound}
      />
      <TireGrid tires={tires} serverUrl={serverUrl} />

      {onCompare && (
        <div className="compare-section">
          <button
            className="compare-button"
            onClick={onCompare}
            disabled={isComparing}
          >
            <span className="compare-icon">🔄</span>
            {isComparing ? "Comparing..." : "Compare These Tires"}
          </button>
        </div>
      )}

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
          background: #27509b;
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
        }
        .compare-button:hover {
          background: #3a61a6;
          box-shadow: 0 .4rem .8rem 0 rgba(51, 51, 51, .12);
        }
        .compare-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .compare-icon { font-size: 20px; }
        @media (max-width: 768px) {
          .compare-section { padding: 16px; }
          .compare-button { font-size: 14px; padding: 12px 24px; }
        }
      `}</style>
    </div>
  );
}
