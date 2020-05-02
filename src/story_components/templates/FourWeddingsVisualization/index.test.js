import React from "react";
import { render } from "@testing-library/react";
import { PureFourWeddingsVis } from ".";

describe("smoke and snapshot tests", () => {
  const data = [
    {
      season: 1,
      episode: 1,
      title: "...and a Racetrack",
      date: "2009-12-18T08:00:00.000Z",
      name: "Nic",
      age: 27,
      spouseName: "Joe",
      spouseAge: 28,
      guests: 250,
      budget: 45000,
      description: "DJ Dance Party",
      state: "New Jersey",
      scoresGiven: [5, 7, 8],
      scoresReceived: {
        dress: 19,
        venue: 19,
        food: 26,
        experience: 23
      },
      ranking: 2,
      expGivenRanking: 4,
      expDiffRanking: 1,
      expReceivedRanking: 2,
      budgetRanking: 2,
      budgetPerGuestRanking: 3
    },
    {
      season: 1,
      episode: 1,
      title: "...and a Racetrack",
      date: "2009-12-18T08:00:00.000Z",
      name: "Nadine",
      age: 30,
      spouseName: "Quincy",
      spouseAge: 32,
      guests: 140,
      budget: 25000,
      description: "Garden Paradise",
      state: "New York",
      scoresGiven: [6, 6, 9],
      scoresReceived: {
        dress: 12,
        venue: 16,
        food: 19,
        experience: 21
      },
      ranking: 3,
      expGivenRanking: 3,
      expDiffRanking: 3,
      expReceivedRanking: 3,
      budgetRanking: 4,
      budgetPerGuestRanking: 4
    },
    {
      season: 1,
      episode: 1,
      title: "...and a Racetrack",
      date: "2009-12-18T08:00:00.000Z",
      name: "Nicole",
      age: 40,
      spouseName: "Rob",
      spouseAge: 40,
      guests: 140,
      budget: 35000,
      description: "Day at the Races",
      state: "New York",
      scoresGiven: [9, 7, 8],
      scoresReceived: {
        dress: 19,
        venue: 19,
        food: 9,
        experience: 20
      },
      ranking: 4,
      expGivenRanking: 1,
      expDiffRanking: 4,
      expReceivedRanking: 4,
      budgetRanking: 3,
      budgetPerGuestRanking: 1
    },
    {
      season: 1,
      episode: 1,
      title: "...and a Racetrack",
      date: "2009-12-18T08:00:00.000Z",
      name: "Dimitra",
      age: 24,
      spouseName: "John",
      spouseAge: 29,
      guests: 300,
      budget: 70000,
      description: "Big Fat Greek Wedding",
      state: "New York",
      scoresGiven: [8, 9, 7],
      scoresReceived: {
        dress: 26,
        venue: 19,
        food: 22,
        experience: 25
      },
      ranking: 1,
      expGivenRanking: 1,
      expDiffRanking: 2,
      expReceivedRanking: 1,
      budgetRanking: 1,
      budgetPerGuestRanking: 2
    },
    {
      season: 1,
      episode: 2,
      title: "...and Something Blue",
      date: "2010-05-07T07:00:00.000Z",
      name: "Emilee",
      age: 23,
      spouseName: "Drew",
      spouseAge: 23,
      guests: 130,
      budget: 55000,
      description: "Japanese Garden Gala",
      state: "Florida",
      scoresGiven: [7, 5, 8],
      scoresReceived: {
        dress: 19,
        venue: 26,
        food: 15,
        experience: 22
      },
      ranking: 2,
      expGivenRanking: 4,
      expDiffRanking: 1,
      expReceivedRanking: 3,
      budgetRanking: 1,
      budgetPerGuestRanking: 1
    },
    {
      season: 1,
      episode: 2,
      title: "...and Something Blue",
      date: "2010-05-07T07:00:00.000Z",
      name: "Danielle",
      age: 22,
      spouseName: "Ed",
      spouseAge: 32,
      guests: 100,
      budget: 20000,
      description: "By the Book",
      state: "Florida",
      scoresGiven: [7, 6, 8],
      scoresReceived: {
        dress: 30,
        venue: 12,
        food: 26,
        experience: 23
      },
      ranking: 1,
      expGivenRanking: 3,
      expDiffRanking: 1,
      expReceivedRanking: 1,
      budgetRanking: 3,
      budgetPerGuestRanking: 2
    },
    {
      season: 1,
      episode: 2,
      title: "...and Something Blue",
      date: "2010-05-07T07:00:00.000Z",
      name: "Keshia",
      age: 36,
      spouseName: "Tony",
      spouseAge: 28,
      guests: 140,
      budget: 12500,
      description: "Sunrise Surprise",
      state: "Florida",
      scoresGiven: [7, 8, 7],
      scoresReceived: {
        dress: 15,
        venue: 19,
        food: 9,
        experience: 18
      },
      ranking: 4,
      expGivenRanking: 2,
      expDiffRanking: 4,
      expReceivedRanking: 4,
      budgetRanking: 4,
      budgetPerGuestRanking: 4
    },
    {
      season: 1,
      episode: 2,
      title: "...and Something Blue",
      date: "2010-05-07T07:00:00.000Z",
      name: "Tonya",
      age: 28,
      spouseName: "Andrew",
      spouseAge: 35,
      guests: 160,
      budget: 25000,
      description: "Beach Ball",
      state: "Florida",
      scoresGiven: [8, 8, 7],
      scoresReceived: {
        dress: 12,
        venue: 19,
        food: 26,
        experience: 23
      },
      ranking: 3,
      expGivenRanking: 1,
      expDiffRanking: 3,
      expReceivedRanking: 1,
      budgetRanking: 2,
      budgetPerGuestRanking: 3
    }
  ];
  const visTypes = ["map", "histogram", "pie", "scatter"];

  it("renders each visualization successfully", () => {
    visTypes.forEach(type => {
      render(<PureFourWeddingsVis data={data} caption="foo" visType={type} />);
    });
  });

  it("matches snapshots", () => {
    visTypes.forEach(type => {
      const { asFragment } = render(
        <PureFourWeddingsVis data={data} caption="foo" visType={type} />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
