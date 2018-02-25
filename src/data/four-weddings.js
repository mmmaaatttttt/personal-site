import { csv } from "d3-fetch";
import { withPrefix } from "gatsby-link";

const getData = () => csv(withPrefix("data/four_weddings.csv"), handleCSV);

const selectOptionsHistogram = [
  {
    value: "cost",
    label: "Wedding Cost",
    accessor: d => d.cost,
    step: 10000,
    format: "$.2s"
  },
  {
    value: "guests",
    label: "Guest Count",
    accessor: d => d.guests,
    step: 50,
    format: ".0f"
  },
  {
    value: "costPerGuest",
    label: "Wedding Cost Per Guest",
    accessor: d => (d.guests ? d.cost / d.guests : null),
    step: 100,
    format: "$.0f"
  },
  {
    value: "age",
    label: "Bride Age",
    accessor: d => d.age,
    step: 2,
    format: ".0f"
  },
  {
    value: "ageGap",
    label: "Age Gap (Spouse Age - Bride Age)",
    accessor: d => (d.spouseAge ? d.spouseAge - d.age : null),
    step: 2,
    format: ".0f"
  }
];

const handleCSV = (row, i, columns) => ({
  season: +row["Season"],
  episode: +row["Episode"],
  title: row["Title"],
  date: new Date(row["Date"]),
  name: row["Name"],
  age: +row["Age"],
  spouseName: row["Spouse Name"],
  spouseAge: +row["Spouse Age"] || null,
  guests: +row["Guest Count"] || null,
  cost: +row["Budget"] || null,
  state: row["State"],
  scoresGiven: columns
    .filter(colName => /Contestant \d Experience/.test(colName))
    .map(colName => +row[colName])
    .filter(Boolean),
  scoresReceived: {
    dress: +row["Dress"],
    venue: +row["Venue"],
    food: +row["Food"],
    experience: +row["Experience"]
  }
});

export { getData, selectOptionsHistogram };
