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

export { handleCSV };
