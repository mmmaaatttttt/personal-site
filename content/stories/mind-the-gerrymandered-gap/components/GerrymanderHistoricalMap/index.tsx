import { electionData, stateSummaries } from "../../data";
import HistoricalMap from "./HistoricalMap";

const GerrymanderHistoricalMap = () => {
  return (
    <HistoricalMap
      electionData={electionData}
      stateSummaries={stateSummaries}
    />
  );
};

export default GerrymanderHistoricalMap;
