import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, Pie, PieChart, Sector, Label } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

export const title = "Tooltip - Custom Label";

const chartData = [
    { date: "2024-07-15", running: 450, swimming: 300 },
    { date: "2024-07-16", running: 380, swimming: 420 },
    { date: "2024-07-17", running: 520, swimming: 120 },
    { date: "2024-07-18", running: 140, swimming: 550 },
    { date: "2024-07-19", running: 600, swimming: 350 },
    { date: "2024-07-20", running: 480, swimming: 400 },
];

const barChartConfig = {
    activities: {
        label: "Activities",
    },
    running: {
        label: "Running",
        color: "var(--chart-1)",
    },
    swimming: {
        label: "Swimming",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

const desktopData = [
    { month: "january", desktop: 186, fill: "var(--color-january)" },
    { month: "february", desktop: 305, fill: "var(--color-february)" },
    { month: "march", desktop: 237, fill: "var(--color-march)" },
    { month: "april", desktop: 173, fill: "var(--color-april)" },
    { month: "may", desktop: 209, fill: "var(--color-may)" },
];

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    desktop: {
        label: "Desktop",
    },
    mobile: {
        label: "Mobile",
    },
    january: {
        label: "January",
        color: "var(--chart-1)",
    },
    february: {
        label: "February",
        color: "var(--chart-2)",
    },
    march: {
        label: "March",
        color: "var(--chart-3)",
    },
    april: {
        label: "April",
        color: "var(--chart-4)",
    },
    may: {
        label: "May",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig;

export default function ChartDashboard() {
    const activeIndex = 0;

    return (
        <div className="grid grid-cols-2 gap-2">
            <div className="w-full rounded-md border bg-background p-4">
                <ChartContainer config={barChartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <XAxis
                            axisLine={false}
                            dataKey="date"
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("en-US", {
                                    weekday: "short",
                                })
                            }
                            tickLine={false}
                            tickMargin={10}
                        />
                        <Bar
                            dataKey="running"
                            fill="var(--color-running)"
                            radius={[0, 0, 4, 4]}
                            stackId="a"
                        />
                        <Bar
                            dataKey="swimming"
                            fill="var(--color-swimming)"
                            radius={[4, 4, 0, 0]}
                            stackId="a"
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent indicator="line" labelKey="activities" />
                            }
                            cursor={false}
                            defaultIndex={1}
                        />
                    </BarChart>
                </ChartContainer>
            </div>
            <div className="w-full rounded-md border bg-background p-4">
                <ChartContainer
                    className="mx-auto aspect-square w-full max-w-[300px]"
                    config={chartConfig}
                    id="pie-interactive"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                            cursor={false}
                        />
                        <Pie
                            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                                <g>
                                    <Sector {...props} outerRadius={outerRadius + 10} />
                                    <Sector
                                        {...props}
                                        innerRadius={outerRadius + 12}
                                        outerRadius={outerRadius + 25}
                                    />
                                </g>
                            )}
                            data={desktopData}
                            dataKey="desktop"
                            innerRadius={60}
                            nameKey="month"
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                dominantBaseline="middle"
                                                textAnchor="middle"
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                            >
                                                <tspan
                                                    className="fill-foreground text-3xl font-bold"
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                >
                                                    {desktopData[activeIndex].desktop.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    className="fill-muted-foreground"
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                >
                                                    Visitors
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </div>
        </div>

    )
}
