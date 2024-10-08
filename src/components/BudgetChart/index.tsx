import { PieChart, Pie, Label } from "recharts";
import {
  ChartTooltip,
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const BudgetChart = ({ salary, budgetRule }: BudgetChartProps) => {
  const chartConfig = {
    value: {
      label: "Value",
    },
    needs: {
      label: `Needs (${budgetRule.needs}%)`,
      color: "#0088FE",
    },
    wants: {
      label: `Wants (${budgetRule.wants}%)`,
      color: "#00C49F",
    },
    savings: {
      label: `Savings (${budgetRule.savings}%)`,
      color: "#FFBB28",
    },
  } satisfies ChartConfig;

  const data = [
    {
      name: `Needs (${budgetRule.needs}%)`,
      value: salary * (budgetRule.needs / 100),
      fill: "#0088FE",
    },
    {
      name: `Wants (${budgetRule.wants}%)`,
      value: salary * (budgetRule.wants / 100),
      fill: "#00C49F",
    },
    {
      name: `Savings (${budgetRule.savings}%)`,
      value: salary * (budgetRule.savings / 100),
      fill: "#FFBB28",
    },
  ];

  return !salary ? (
    <div className="bg-popover rounded-lg p-6 h-full flex flex-col justify-center">
      <p className="text-muted-foreground text-center">
        Please enter your income to see your budget chart.
      </p>
    </div>
  ) : (
    <div className="bg-popover rounded-lg p-6 h-full flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-4">Budget Chart</h2>
      <div className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-square mx-auto max-h-[500px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={100}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {salary.toFixed(2).toLocaleString()} €
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Net Salary
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 space-y-2">
          {data.map(({ name, value, fill }) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 bg-[${fill}] rounded-full`} />
                <span className="text-sm">{name}</span>
              </div>
              <span className="text-sm font-medium">{value.toFixed(2)} €</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
