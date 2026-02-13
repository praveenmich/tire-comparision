import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import {
  TireComparisonView,
  extractComparisonData,
} from "../components/TireComparisonView";
import "@/index.css";

function TireComparison() {
  let output;
  try {
    const toolInfo = useToolInfo();
    output = toolInfo.output;
  } catch (error) {
    return (
      <div className="tire-error">
        <h3>Widget Loading Error</h3>
      </div>
    );
  }

  if (!output) return <div>Loading tire data...</div>;

  const data = extractComparisonData(output);
  if (!data) return <div>No tires available for comparison</div>;

  return <TireComparisonView {...data} />;
}

export default TireComparison;
mountWidget(<TireComparison />);
