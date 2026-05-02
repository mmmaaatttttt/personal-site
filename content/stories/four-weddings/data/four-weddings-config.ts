import { format } from "d3-format";
import { scaleOrdinal } from "d3-scale";
import { 
  HistogramOption, 
  MapOption, 
  PieOption, 
  ScatterOption, 
  WeddingData 
} from "../types";

// Colors from legacy utils/styles.js
const COLORS = {
  BLUE: "#3182bd",
  GREEN: "#31a354",
  ORANGE: "#e6550d",
  RED: "#d62728",
};

const RED_LIGHT = "#ff9896"; 

const selectOptionsHistogram: HistogramOption[] = [
  {
    value: "budget",
    label: "Wedding Budget",
    accessor: (d: WeddingData) => d.budget,
    step: 10000,
    format: "$.2s"
  },
  {
    value: "guests",
    label: "Guest Count",
    accessor: (d: WeddingData) => d.guests,
    step: 50,
    format: ".0f"
  },
  {
    value: "budgetPerGuest",
    label: "Wedding Budget Per Guest",
    accessor: (d: WeddingData) => (d.guests && d.budget !== null) ? d.budget / d.guests : null,
    step: 100,
    format: "$.0f"
  },
  {
    value: "age",
    label: "Bride Age",
    accessor: (d: WeddingData) => d.age,
    step: 2,
    format: ".0f"
  },
  {
    value: "spouseAge",
    label: "Spouse Age",
    accessor: (d: WeddingData) => d.spouseAge,
    step: 2,
    format: ".0f"
  },
  {
    value: "ageGap",
    label: "Age Gap (Spouse Age - Bride Age)",
    accessor: (d: WeddingData) => (d.spouseAge !== null && d.age !== null) ? d.spouseAge - d.age : null,
    step: 2,
    format: ".0f"
  }
];

const selectOptionsMap: MapOption[] = [
  {
    value: "weddingCount",
    label: "Color by Number of Weddings",
    accessor: (properties: any) => properties.values?.length || 0,
    colors: [RED_LIGHT, COLORS.RED]
  },
  {
    value: "avgBudget",
    label: "Color by Average Wedding Budget",
    accessor: (properties: any) => {
      const values = properties.values;
      if (!values || values.length === 0) return 0;
      return values.reduce((acc: number, cur: WeddingData) => acc + (cur.budget ?? 0), 0) / values.length;
    },
    colors: [RED_LIGHT, COLORS.RED]
  }
];

const __pieHelper = (data: WeddingData[], rankKey: keyof WeddingData) =>
  data.filter(d => d.ranking === 1).reduce(
    (totals, bride) => {
      const rankValue = bride[rankKey] as number | null;
      if (rankValue !== null && rankValue >= 1 && rankValue <= 4) {
        totals[rankValue - 1]++;
      }
      return totals;
    },
    [0, 0, 0, 0]
  );

const selectOptionsPieChart: PieOption[] = [
  {
    value: "budget",
    label: "Rankings by Budget",
    accessor: (data: WeddingData[]) => __pieHelper(data, "budgetRanking")
  },
  {
    value: "budgetPerGuest",
    label: "Rankings by Budget Per Guest",
    accessor: (data: WeddingData[]) => __pieHelper(data, "budgetPerGuestRanking")
  },
  {
    value: "expGiven",
    label: "Rankings by Overall Experience Points Given",
    accessor: (data: WeddingData[]) => __pieHelper(data, "expGivenRanking")
  },
  {
    value: "expReceived",
    label: "Rankings by Overall Experience Points Received",
    accessor: (data: WeddingData[]) => __pieHelper(data, "expReceivedRanking")
  },
  {
    value: "expDiff",
    label: "Rankings by Exp Gap (Received - Given)",
    accessor: (data: WeddingData[]) => __pieHelper(data, "expDiffRanking")
  }
];

const selectOptionsScatter: ScatterOption[] = [
  {
    value: "budget",
    label: "Wedding Budget",
    accessor: (d: WeddingData) => d.budget,
    format: "$.2s"
  },
  {
    value: "guestCount",
    label: "Guest Count",
    accessor: (d: WeddingData) => d.guests,
    format: ".0f"
  },
  {
    value: "budgetPerGuest",
    label: "Budget Per Guest",
    accessor: (d: WeddingData) => (d.guests && d.budget !== null) ? d.budget / d.guests : null,
    format: "$.0f"
  },
  {
    value: "brideAge",
    label: "Bride's Age",
    accessor: (d: WeddingData) => d.age,
    format: ".0f"
  },
  {
    value: "spouseAge",
    label: "Spouse's Age",
    accessor: (d: WeddingData) => d.spouseAge,
    format: ".0f"
  },
  {
    value: "ageGap",
    label: "Age Gap (Spouse Age - Bride Age)",
    accessor: (d: WeddingData) => (d.spouseAge !== null && d.age !== null) ? d.spouseAge - d.age : null,
    format: ".0f"
  },
  {
    value: "totalPoints",
    label: "Total Points Received",
    accessor: (d: WeddingData) => {
      let total = 0;
      for (const key in d.scoresReceived) {
        total += (d.scoresReceived as any)[key];
      }
      return total;
    },
    format: ".0f"
  },
  {
    value: "expPointsReceived",
    label: "Overall Experience Points Received",
    accessor: (d: WeddingData) => d.scoresReceived.experience,
    format: ".0f"
  },
  {
    value: "expPointsGiven",
    label: "Overall Experience Points Given",
    accessor: (d: WeddingData) => d.scoresGiven.reduce((total: number, score: number) => total + score, 0),
    format: ".0f"
  },
  {
    value: "expPointsGap",
    label: "Overall Exp Gap (Received - Given)",
    accessor: (d: WeddingData) =>
      d.scoresReceived.experience -
      d.scoresGiven.reduce((total: number, score: number) => total + score, 0),
    format: ".0f"
  },
  {
    value: "dressScore",
    label: "Dress Score",
    accessor: (d: WeddingData) => d.scoresReceived.dress,
    format: ".0f"
  },
  {
    value: "foodScore",
    label: "Food Score",
    accessor: (d: WeddingData) => d.scoresReceived.food,
    format: ".0f"
  },
  {
    value: "venueScore",
    label: "Venue Score",
    accessor: (d: WeddingData) => d.scoresReceived.venue,
    format: ".0f"
  }
];

const mapTooltipTitle = (properties: any) => properties.name || "";

const mapTooltipBody = (properties: any) => {
  const weddingCount = properties.values?.length;
  if (weddingCount) {
    const totalBudget = properties.values.reduce((acc: number, cur: WeddingData) => acc + (cur.budget ?? 0), 0);
    const averageBudget = totalBudget / weddingCount;
    return [
      `Number of weddings: ${weddingCount}`,
      `Average Budget: ${format("$,.0f")(averageBudget)}`
    ];
  }
  return `No weddings for this state.`;
};

const scatterColorScale = (ranking: number | null) => {
  if (ranking === 1) return COLORS.BLUE;
  if (ranking === 2) return COLORS.GREEN;
  if (ranking === 3) return COLORS.ORANGE;
  if (ranking === 4) return COLORS.RED;
  return "#ccc";
};

export const selectOptions = {
  map: selectOptionsMap,
  histogram: selectOptionsHistogram,
  pie: selectOptionsPieChart,
  scatter: selectOptionsScatter
};

export const tooltipHelpers = {
  map: {
    title: mapTooltipTitle,
    body: mapTooltipBody
  },
  histogram: null,
  pie: null,
  scatter: null
};

export const graphOptions = {
  pie: {
    colorScale: scaleOrdinal<number, string>().range([
      COLORS.BLUE,
      COLORS.GREEN,
      COLORS.ORANGE,
      COLORS.RED
    ])
  },
  scatter: {
    colorScale: scatterColorScale
  }
};
