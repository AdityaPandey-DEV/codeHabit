"use client";

import { useMemo } from "react";

interface HeatmapProps {
    data: { date: string; count: number }[];
    colorEmpty?: string;
    colorScale?: string[];
    tooltip?: boolean;
}

const DAYS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function Heatmap({ 
    data, 
    colorEmpty = "#161b22", 
    colorScale = ["#0e4429", "#006d32", "#26a641", "#39d353"],
    tooltip = true,
}: HeatmapProps) {
    const { cells, monthLabels } = useMemo(() => {
        const dataMap = new Map<string, number>();
        data.forEach(d => dataMap.set(d.date, d.count));

        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364); // 365 days including today
        
        // Adjust to start on a Sunday
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);

        const cells: { date: string; count: number; col: number; row: number }[] = [];
        const monthLabels: { label: string; col: number }[] = [];
        
        let lastMonth = -1;
        const currentDate = new Date(startDate);
        
        while (currentDate <= today) {
            const col = Math.floor((currentDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
            const row = currentDate.getDay();
            const dateStr = currentDate.toISOString().split('T')[0];
            const count = dataMap.get(dateStr) || 0;

            cells.push({ date: dateStr, count, col, row });

            // Track month labels
            const month = currentDate.getMonth();
            if (month !== lastMonth) {
                monthLabels.push({ label: MONTHS[month], col });
                lastMonth = month;
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return { cells, monthLabels };
    }, [data]);

    const maxCount = Math.max(...cells.map(c => c.count), 1);

    const getColor = (count: number) => {
        if (count === 0) return colorEmpty;
        const ratio = count / maxCount;
        if (ratio <= 0.25) return colorScale[0];
        if (ratio <= 0.5) return colorScale[1];
        if (ratio <= 0.75) return colorScale[2];
        return colorScale[3];
    };

    const totalCols = Math.max(...cells.map(c => c.col)) + 1;
    const cellSize = 13;
    const cellGap = 3;
    const labelWidth = 32;
    const headerHeight = 20;
    const svgWidth = labelWidth + totalCols * (cellSize + cellGap);
    const svgHeight = headerHeight + 7 * (cellSize + cellGap);

    return (
        <div className="overflow-x-auto">
            <svg width={svgWidth} height={svgHeight} className="block">
                {/* Month labels */}
                {monthLabels.map((m, i) => (
                    <text
                        key={i}
                        x={labelWidth + m.col * (cellSize + cellGap)}
                        y={12}
                        fontSize={10}
                        fill="#8b949e"
                        fontFamily="inherit"
                    >
                        {m.label}
                    </text>
                ))}

                {/* Day labels */}
                {DAYS.map((day, i) => (
                    <text
                        key={i}
                        x={0}
                        y={headerHeight + i * (cellSize + cellGap) + cellSize - 2}
                        fontSize={10}
                        fill="#8b949e"
                        fontFamily="inherit"
                    >
                        {day}
                    </text>
                ))}

                {/* Cells */}
                {cells.map((cell, i) => (
                    <g key={i}>
                        <rect
                            x={labelWidth + cell.col * (cellSize + cellGap)}
                            y={headerHeight + cell.row * (cellSize + cellGap)}
                            width={cellSize}
                            height={cellSize}
                            rx={2}
                            ry={2}
                            fill={getColor(cell.count)}
                            className="transition-all duration-150 hover:stroke-white hover:stroke-1"
                        >
                            {tooltip && (
                                <title>{`${cell.date}: ${cell.count} submission${cell.count !== 1 ? 's' : ''}`}</title>
                            )}
                        </rect>
                    </g>
                ))}
            </svg>

            {/* Legend */}
            <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm" style={{ background: colorEmpty }} />
                {colorScale.map((color, i) => (
                    <div key={i} className="w-3 h-3 rounded-sm" style={{ background: color }} />
                ))}
                <span>More</span>
            </div>
        </div>
    );
}
