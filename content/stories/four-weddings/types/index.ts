export interface WeddingScoresReceived {
  dress: number;
  venue: number;
  food: number;
  experience: number;
}

export interface WeddingData {
  season: number;
  episode: number;
  title: string;
  date: string;
  name: string;
  age: number | null;
  spouseName: string;
  spouseAge: number | null;
  guests: number | null;
  budget: number | null;
  description: string;
  state: string;
  scoresGiven: number[];
  scoresReceived: WeddingScoresReceived;
  ranking: number | null;
  expGivenRanking: number | null;
  expDiffRanking: number | null;
  expReceivedRanking: number | null;
  budgetRanking: number | null;
  budgetPerGuestRanking: number | null;
  // Dynamic fields from config accessors
  budgetPerGuest?: number | null;
  ageGap?: number | null;
}

export interface SelectOption<T = any, R = number | null> {
  value: string;
  label: string;
  accessor: (d: T) => R;
  format?: string;
}

export interface HistogramOption extends SelectOption<WeddingData> {
  step: number;
}

export interface MapOption extends SelectOption<any> {
  colors: string[];
}

export interface PieOption extends SelectOption<WeddingData[], number[]> {
  // No extra fields
}

export interface ScatterOption extends SelectOption<WeddingData> {
  // No extra fields
}
