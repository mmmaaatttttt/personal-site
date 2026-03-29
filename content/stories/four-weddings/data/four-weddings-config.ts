import { format } from "d3-format";
import { scaleOrdinal } from "d3-scale";

// Colors from legacy utils/styles.js (re-implementing or importing)
const COLORS = {
  BLUE: "#3182bd",
  GREEN: "#31a354",
  ORANGE: "#e6550d",
  RED: "#d62728",
};

// Simplified lighten helper to avoid polished dependency if possible, 
// or I can just use hex codes. I'll use hex codes for now for simplicity.
const RED_LIGHT = "#ff9896"; 

const selectOptionsHistogram = [
  {
    value: "budget",
    label: "Wedding Budget",
    accessor: (d: any) => d.budget,
    step: 10000,
    format: "$.2s"
  },
  {
    value: "guests",
    label: "Guest Count",
    accessor: (d: any) => d.guests,
    step: 50,
    format: ".0f"
  },
  {
    value: "budgetPerGuest",
    label: "Wedding Budget Per Guest",
    accessor: (d: any) => d.guests && d.budget / d.guests,
    step: 100,
    format: "$.0f"
  },
  {
    value: "age",
    label: "Bride Age",
    accessor: (d: any) => d.age,
    step: 2,
    format: ".0f"
  },
  {
    value: "spouseAge",
    label: "Spouse Age",
    accessor: (d: any) => d.spouseAge,
    step: 2,
    format: ".0f"
  },
  {
    value: "ageGap",
    label: "Age Gap (Spouse Age - Bride Age)",
    accessor: (d: any) => d.spouseAge && d.spouseAge - d.age,
    step: 2,
    format: ".0f"
  }
];

const selectOptionsMap = [
  {
    value: "weddingCount",
    label: "Color by Number of Weddings",
    accessor: (properties: any) => properties.values.length,
    colors: [RED_LIGHT, COLORS.RED]
  },
  {
    value: "avgBudget",
    label: "Color by Average Wedding Budget",
    accessor: (properties: any) => {
      const values = properties.values;
      if (!values || values.length === 0) return 0;
      return values.reduce((acc: number, cur: any) => acc + cur.budget, 0) / values.length;
    },
    colors: [RED_LIGHT, COLORS.RED]
  }
];

const __pieHelper = (data: any[], rankKey: string) =>
  data.filter(d => d.ranking === 1).reduce(
    (totals, bride) => {
      const rankValue = bride[rankKey];
      if (rankValue >= 1 && rankValue <= 4) {
        totals[rankValue - 1]++;
      }
      return totals;
    },
    [0, 0, 0, 0]
  );

const selectOptionsPieChart = [
  {
    value: "budget",
    label: "Rankings by Budget",
    accessor: (data: any[]) => __pieHelper(data, "budgetRanking")
  },
  {
    value: "budgetPerGuest",
    label: "Rankings by Budget Per Guest",
    accessor: (data: any[]) => __pieHelper(data, "budgetPerGuestRanking")
  },
  {
    value: "expGiven",
    label: "Rankings by Overall Experience Points Given",
    accessor: (data: any[]) => __pieHelper(data, "expGivenRanking")
  },
  {
    value: "expReceived",
    label: "Rankings by Overall Experience Points Received",
    accessor: (data: any[]) => __pieHelper(data, "expReceivedRanking")
  },
  {
    value: "expDiff",
    label: "Rankings by Exp Gap (Received - Given)",
    accessor: (data: any[]) => __pieHelper(data, "expDiffRanking")
  }
];

const selectOptionsScatter = [
  {
    value: "budget",
    label: "Wedding Budget",
    accessor: (d: any) => d.budget,
    format: "$.2s"
  },
  {
    value: "guestCount",
    label: "Guest Count",
    accessor: (d: any) => d.guests,
    format: ".0f"
  },
  {
    value: "budgetPerGuest",
    label: "Budget Per Guest",
    accessor: (d: any) => d.guests && d.budget / d.guests,
    format: "$.0f"
  },
  {
    value: "brideAge",
    label: "Bride's Age",
    accessor: (d: any) => d.age,
    format: ".0f"
  },
  {
    value: "spouseAge",
    label: "Spouse's Age",
    accessor: (d: any) => d.spouseAge,
    format: ".0f"
  },
  {
    value: "ageGap",
    label: "Age Gap (Spouse Age - Bride Age)",
    accessor: (d: any) => d.spouseAge && d.spouseAge - d.age,
    format: ".0f"
  },
  {
    value: "totalPoints",
    label: "Total Points Received",
    accessor: (d: any) => {
      let total = 0;
      for (let key in d.scoresReceived) {
        total += (d.scoresReceived as any)[key];
      }
      return total;
    },
    format: ".0f"
  },
  {
    value: "expPointsReceived",
    label: "Overall Experience Points Received",
    accessor: (d: any) => d.scoresReceived.experience,
    format: ".0f"
  },
  {
    value: "expPointsGiven",
    label: "Overall Experience Points Given",
    accessor: (d: any) => d.scoresGiven.reduce((total: number, score: number) => total + score, 0),
    format: ".0f"
  },
  {
    value: "expPointsGap",
    label: "Overall Exp Gap (Received - Given)",
    accessor: (d: any) =>
      d.scoresReceived.experience -
      d.scoresGiven.reduce((total: number, score: number) => total + score, 0),
    format: ".0f"
  },
  {
    value: "dressScore",
    label: "Dress Score",
    accessor: (d: any) => d.scoresReceived.dress,
    format: ".0f"
  },
  {
    value: "foodScore",
    label: "Food Score",
    accessor: (d: any) => d.scoresReceived.food,
    format: ".0f"
  },
  {
    value: "venueScore",
    label: "Venue Score",
    accessor: (d: any) => d.scoresReceived.venue,
    format: ".0f"
  }
];

const mapTooltipTitle = (properties: any) => properties.name;

const mapTooltipBody = (properties: any) => {
  const weddingCount = properties.values && properties.values.length;
  if (weddingCount) {
    const totalBudget = properties.values.reduce((acc: number, cur: any) => acc + cur.budget, 0);
    const averageBudget = totalBudget / weddingCount;
    return [
      `Number of weddings: ${weddingCount}`,
      `Average Budget: ${format("$,.0f")(averageBudget)}`
    ];
  }
  return `No weddings for this state.`;
};

export const selectOptions: any = {
  map: selectOptionsMap,
  histogram: selectOptionsHistogram,
  pie: selectOptionsPieChart,
  scatter: selectOptionsScatter
};

export const tooltipHelpers: any = {
  map: {
    title: mapTooltipTitle,
    body: mapTooltipBody
  }
};

export const graphOptions: any = {
  pie: {
    colorScale: scaleOrdinal<string>().range([
      COLORS.BLUE,
      COLORS.GREEN,
      COLORS.ORANGE,
      COLORS.RED
    ])
  },
  scatter: {
    colorScale: scaleOrdinal<number, string>()
      .domain([1, 2, 3, 4])
      .range([COLORS.BLUE, COLORS.GREEN, COLORS.ORANGE, COLORS.RED])
  }
};
