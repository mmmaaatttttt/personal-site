"use client";

import React, { useState } from "react";
import Scatterplot from "@/components/story/shared/Scatterplot";
import Select from "@/components/story/shared/Select";
import FlexContainer from "@/components/story/shared/FlexContainer";
import NarrowContainer from "@/components/story/shared/NarrowContainer";

interface SelectableScatterplotProps {
    data: any[];
    selectOptions: any[];
    graphOptions: any;
}

const SelectableScatterplot: React.FC<SelectableScatterplotProps> = ({
    data,
    selectOptions,
    graphOptions,
}) => {
    const [selectedOptionX, setSelectedOptionX] = useState(selectOptions[0]);
    const [selectedOptionY, setSelectedOptionY] = useState(selectOptions[1]);
    const [selectedOptionR, setSelectedOptionR] = useState(null);

    const { accessor: accessorX, value: valueX, format: formatX, label: labelX } = selectedOptionX;
    const { accessor: accessorY, value: valueY, format: formatY, label: labelY } = selectedOptionY;
    const accessorR = (selectedOptionR as any)?.accessor || ((d: any) => 100);
    const { colorScale } = graphOptions;

    const scatterData = data
        .filter(d => accessorX(d) !== null && accessorY(d) !== null && accessorR(d) !== null)
        .map(d => ({
            cx: accessorX(d),
            cy: accessorY(d),
            area: accessorR(d),
            fill: colorScale(d.ranking),
            key: `${d.season}:${d.episode} - ${d.name}`
        }));

    return (
        <NarrowContainer width="100%" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <FlexContainer cross="center" className="flex-1">
                    <span className="text-sm font-semibold text-gray-500 mr-2 whitespace-nowrap uppercase tracking-wider">X-Axis</span>
                    <Select
                        name="scatter-data-x"
                        value={valueX}
                        onChange={setSelectedOptionX}
                        options={selectOptions}
                        className="flex-1"
                    />
                </FlexContainer>
                <FlexContainer cross="center" className="flex-1">
                    <span className="text-sm font-semibold text-gray-500 mr-2 whitespace-nowrap uppercase tracking-wider">Y-Axis</span>
                    <Select
                        name="scatter-data-y"
                        value={valueY}
                        onChange={setSelectedOptionY}
                        options={selectOptions}
                        className="flex-1"
                    />
                </FlexContainer>
            </div>
            <Scatterplot
                data={scatterData}
                {...graphOptions}
                graphPadding={55}
                tickFormatX={formatX}
                tickFormatY={formatY}
            />
        </NarrowContainer>
    );
};

export default SelectableScatterplot;
