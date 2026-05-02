"use client";

import ColoredSpan from "@/components/story/shared/ColoredSpan";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import StyledTable from "@/components/story/shared/StyledTable";
import baCommonPhrases from "../../data/ba-common-phrases";
import { colorMap } from "../../data/beautiful-analysis";

const CollocationTable = () => {
  const headers = baCommonPhrases.collocation_lists.map(({ speaker }) => ({
    key: `header-${speaker}`,
    content: (
      <ColoredSpan bold color={colorMap[speaker as keyof typeof colorMap]}>
        {speaker}
      </ColoredSpan>
    ),
  }));

  const rows = baCommonPhrases.collocation_lists[0].collocations.map(
    (phrase, idx) => ({
      key: `${phrase}-${baCommonPhrases.collocation_lists[1].collocations[idx]}`,
      cells: [
        {
          key: "chris-collocation",
          content: <ColoredSpan color={colorMap.Chris}>{phrase}</ColoredSpan>,
        },
        {
          key: "caller-collocation",
          content: (
            <ColoredSpan color={colorMap.Caller}>
              {baCommonPhrases.collocation_lists[1].collocations[idx]}
            </ColoredSpan>
          ),
        },
      ],
    }),
  );

  return (
    <div className="w-full my-12" data-testid="collocation-table-container">
      <NarrowContainer width="70%" fullWidthAt="sm">
        <StyledTable padding="0.1rem" headers={headers} rows={rows} />
      </NarrowContainer>
    </div>
  );
};

export default CollocationTable;
