import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BudgetChart from "./";

// Mock the chart components from @/components/ui/chart
vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}));

describe("BudgetChart", () => {
  const salary = 5000;
  const budgetRule = { needs: 50, wants: 30, savings: 20 };

  it("should render the chart when salary is provided", () => {
    render(<BudgetChart salary={salary} budgetRule={budgetRule} />);

    expect(screen.getByText("Budget Chart")).toBeInTheDocument();
  });

  it("should not render the chart when salary is 0", () => {
    render(<BudgetChart salary={0} budgetRule={budgetRule} />);

    expect(screen.queryByText("Budget Chart")).not.toBeInTheDocument();
  });

  it("should display correct budget breakdown", () => {
    render(<BudgetChart salary={salary} budgetRule={budgetRule} />);

    expect(screen.getByText("Needs (50%)")).toBeInTheDocument();
    expect(screen.getByText("Wants (30%)")).toBeInTheDocument();
    expect(screen.getByText("Savings (20%)")).toBeInTheDocument();

    expect(screen.getByText("2500.00 €")).toBeInTheDocument();
    expect(screen.getByText("1500.00 €")).toBeInTheDocument();
    expect(screen.getByText("1000.00 €")).toBeInTheDocument();
  });

  it("should use correct colors for budget categories", () => {
    render(<BudgetChart salary={salary} budgetRule={budgetRule} />);

    const needsColor = screen.getByText("Needs (50%)").previousElementSibling;
    const wantsColor = screen.getByText("Wants (30%)").previousElementSibling;
    const savingsColor =
      screen.getByText("Savings (20%)").previousElementSibling;

    expect(needsColor).toHaveClass("bg-[#0088FE]");
    expect(wantsColor).toHaveClass("bg-[#00C49F]");
    expect(savingsColor).toHaveClass("bg-[#FFBB28]");
  });
});
