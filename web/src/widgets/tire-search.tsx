import "@/index.css";

import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { SearchHeader } from "./components/SearchHeader";
import { TireGrid } from "./components/TireGrid";
import { FollowupActions } from "./components/FollowupActions";

// Define FollowupAction interface locally to avoid circular imports
interface FollowupAction {
  label: string;
  input: string;
  type?: "compare" | "search" | "filter" | "navigate";
}

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
  followupActions,
  serverUrl,
}: {
  tires: Tire[];
  message: string;
  totalFound: number;
  vehicleQuery: string;
  followupActions: FollowupAction[];
  serverUrl?: string;
}) {
  // Handle follow-up actions
  const handleFollowupAction = (action: FollowupAction) => {
    console.log("🎯 Handling followup action:", action);

    switch (action.type) {
      case "compare":
        // Collect details_url from all displayed tires
        const tireDetailsUrls =
          tires?.map((tire) => tire.details_url).filter(Boolean) || [];

        console.log("🔍 Triggering tire comparison with query:", action.input);
        console.log("📋 Collected tire details URLs:", tireDetailsUrls);

        if (tireDetailsUrls.length > 0) {
          console.log(
            "🚀 Triggering tire-comparison with URLs:",
            tireDetailsUrls,
          );

          // Call tire-comparison tool with only tireUrls parameter
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

          // Show user feedback
          alert(
            `Tire comparison initiated!\n\nTires found: ${tireDetailsUrls.length}\nAction: ${action.label}\n\nTire URLs are being passed to the comparison widget.`,
          );
        } else {
          console.warn("⚠️ No tire details URLs found for comparison");
          alert(
            "No tires available for comparison. Please ensure tires are loaded first.",
          );
        }
        break;

      case "search":
        // Trigger a new search with refined criteria
        console.log("🔍 Triggering new search with criteria:", action.input);
        alert(
          `New search initiated!\n\nCriteria: ${action.input}\nAction: ${action.label}\n\nThis would normally trigger a new tire search with updated parameters.`,
        );
        break;

      case "filter":
        // Apply filter to current results
        console.log("🔽 Applying filter:", action.input);
        alert(
          `Filter applied!\n\nFilter: ${action.input}\nAction: ${action.label}\n\nThis would normally filter the current tire results.`,
        );
        break;

      default:
        // Generic action
        console.log("💡 Generic action:", action.input);
        alert(
          `Action executed!\n\nDetails: ${action.input}\nAction: ${action.label}`,
        );
        break;
    }
  };

  console.log("🛞 TireSearchGrid rendering with data:", {
    tiresCount: tires?.length || 0,
    message,
    totalFound,
    vehicleQuery,
    followupActionsCount: followupActions?.length || 0,
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

      <FollowupActions
        followupActions={followupActions}
        onAction={handleFollowupAction}
      />

      <style>{`
        .tire-search-widget {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0;
          font-family: 'Arial', 'Helvetica', 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f0f4ff 100%);
          height: auto;
        }

        @media (max-width: 768px) {
          .tire-search-widget {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}

function TireSearch() {
  let input, output;

  try {
    const toolInfo = useToolInfo();
    input = toolInfo.input;
    output = toolInfo.output;
  } catch (error) {
    console.error("❌ TireSearch hook error:", error);
    return (
      <div className="tire-error">
        <h3>⚠️ Widget Loading Error</h3>
        <p>Unable to initialize tire search widget.</p>
      </div>
    );
  }

  console.log("🔍 TireSearch Widget Rendering");
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
        message={structuredData.message || "Tire search completed"}
        totalFound={structuredData.totalFound || 0}
        vehicleQuery={structuredData.vehicleQuery || ""}
        followupActions={structuredData.followupActions || []}
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
        message={outputData.message || "Tire search completed"}
        totalFound={outputData.totalFound || 0}
        vehicleQuery={outputData.vehicleQuery || ""}
        followupActions={outputData.followupActions || []}
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
        message={
          structuredData.searchResults.message || "Tire search completed"
        }
        totalFound={structuredData.searchResults.data.length || 0}
        vehicleQuery={structuredData.searchQuery || ""}
        followupActions={structuredData.searchResults.followups || []}
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
        message={foundData.parent.message || "Tire search completed"}
        totalFound={foundData.data.length || 0}
        vehicleQuery={(output as any)?.searchQuery || ""}
        followupActions={foundData.parent.followups || []}
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

export default TireSearch;

mountWidget(<TireSearch />);
