import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { useCallTool } from "skybridge/web";
import {
  TireSearchGrid,
  extractTireData,
} from "../components/TireSearchResults";
import {
  TireComparisonView,
  extractComparisonData,
} from "../components/TireComparisonView";

function SpecificVehicleSearch() {
  const {
    callTool: compareTires,
    data,
    isSuccess,
    isPending: isComparing,
  } = useCallTool<
    { urls: Array<string> },
    { structuredContent: { tires: any[] } }
  >("tire-comparison");

  let input, output;
  try {
    const toolInfo = useToolInfo();
    input = toolInfo.input;
    output = toolInfo.output;
  } catch (error) {
    return (
      <div className="tire-error">
        <h3>Widget Loading Error</h3>
        <p>Unable to initialize specific vehicle search widget.</p>
      </div>
    );
  }

  if (!output)
    return <div className="tire-loading">Searching for tires...</div>;

  const tireData = extractTireData(output);

  if (tireData) {
    return (
      <TireSearchGrid
        {...tireData}
        onCompare={() => {
          const urls = tireData.tires.map((t) => t.details_url).filter(Boolean);
          console.log("🔍 URLs for comparison specific vehicle:", urls);
          compareTires({ urls });
        }}
        isComparing={isComparing}
      />
    );
  }
  console.log(
    "🔍 Checking for comparison results - isComparisonSuccess specific vehicle",
    isSuccess,
    "comparisonData:",
    data,
  );

  if (isSuccess && data) {
    const parsed = extractComparisonData(data);
    console.log("🔍 Comparison data received:", data);
    if (parsed) return <TireComparisonView {...parsed} />;
  }

  // Fallback text
  const content = (output as any)?.content;
  if (content?.[0]?.text) {
    return (
      <div className="tire-search-fallback">
        <h3>Tire Search Results</h3>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>
          {content[0].text}
        </pre>
      </div>
    );
  }

  return (
    <div className="tire-search-error">
      <h3>Tire Search</h3>
      <p>No tire data available</p>
    </div>
  );
}

export default SpecificVehicleSearch;
mountWidget(<SpecificVehicleSearch />);
