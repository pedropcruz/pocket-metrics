import React from "react";
import { vi, describe, it, expect, beforeEach } from "vitest";

import { render, screen, fireEvent } from "@testing-library/react";

import { RuleSelector } from "./";

// Mock the UI components
vi.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
}));

vi.mock("@/components/ui/radio-group", () => ({
  RadioGroup: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode;
    onValueChange: (value: string) => void;
  }) => (
    <div
      data-testid="radio-group"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onValueChange(e.target.value)
      }
    >
      {children}
    </div>
  ),
  RadioGroupItem: ({ value, id }: { value: string; id: string }) => (
    <input type="radio" value={value} id={id} data-testid={`radio-${value}`} />
  ),
}));

vi.mock("@/components/ui/slider", () => ({
  Slider: ({
    id,
    value,
    onValueChange,
  }: {
    id: string;
    value: number[];
    onValueChange: (value: number[]) => void;
  }) => (
    <input
      type="range"
      id={id}
      data-testid={id}
      value={value[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value)])}
    />
  ),
}));

describe("RuleSelector", () => {
  const mockOnRuleChange = vi.fn();
  const defaultBudgetRule = { needs: 50, wants: 30, savings: 20 };

  beforeEach(() => {
    mockOnRuleChange.mockClear();
  });

  it("should render without crashing", () => {
    render(
      <RuleSelector
        onRuleChange={mockOnRuleChange}
        budgetRule={defaultBudgetRule}
      />
    );
    expect(screen.getByText("Select Budget Rule")).toBeInTheDocument();
  });

  it("should display all rule options", () => {
    render(
      <RuleSelector
        onRuleChange={mockOnRuleChange}
        budgetRule={defaultBudgetRule}
      />
    );
    expect(screen.getByLabelText("50/30/20 Rule")).toBeInTheDocument();
    expect(screen.getByLabelText("75/10/15 Rule")).toBeInTheDocument();
    expect(screen.getByLabelText("Custom")).toBeInTheDocument();
  });

  it("should call onRuleChange with correct values when selecting a preset rule", () => {
    render(
      <RuleSelector
        onRuleChange={mockOnRuleChange}
        budgetRule={defaultBudgetRule}
      />
    );
    const rule7515Radio = screen.getByTestId("radio-75-10-15");
    fireEvent.click(rule7515Radio);

    expect(mockOnRuleChange).toHaveBeenCalledWith({
      needs: 75,
      wants: 10,
      savings: 15,
    });
  });

  it('should display custom sliders when "Custom" is selected', () => {
    render(
      <RuleSelector
        onRuleChange={mockOnRuleChange}
        budgetRule={defaultBudgetRule}
      />
    );
    const customRadio = screen.getByTestId("radio-custom");
    fireEvent.click(customRadio);

    expect(screen.getByText("Needs 50%")).toBeInTheDocument();
    expect(screen.getByText("Wants 30%")).toBeInTheDocument();
    expect(screen.getByText("Savings 20%")).toBeInTheDocument();
  });

  it("should update custom rule values when sliders are adjusted", () => {
    render(
      <RuleSelector
        onRuleChange={mockOnRuleChange}
        budgetRule={defaultBudgetRule}
      />
    );
    const customRadio = screen.getByTestId("radio-custom");
    fireEvent.click(customRadio);

    const needsSlider = screen.getByTestId("slider-needs");
    fireEvent.change(needsSlider, { target: { value: "60" } });

    expect(mockOnRuleChange).toHaveBeenCalledWith(
      expect.objectContaining({ needs: 60 })
    );
  });

  it("should maintain 100% total allocation when adjusting sliders", () => {
    render(
      <RuleSelector
        onRuleChange={mockOnRuleChange}
        budgetRule={defaultBudgetRule}
      />
    );
    const customRadio = screen.getByTestId("radio-custom");
    fireEvent.click(customRadio);

    const needsSlider = screen.getByTestId("slider-needs");
    fireEvent.change(needsSlider, { target: { value: "70" } });

    const lastCall =
      mockOnRuleChange.mock.calls[mockOnRuleChange.mock.calls.length - 1][0];
    expect(lastCall.needs + lastCall.wants + lastCall.savings).toBe(100);
  });

  it("should round slider values to nearest 5%", () => {
    render(
      <RuleSelector
        onRuleChange={mockOnRuleChange}
        budgetRule={defaultBudgetRule}
      />
    );
    const customRadio = screen.getByTestId("radio-custom");
    fireEvent.click(customRadio);

    const needsSlider = screen.getByTestId("slider-needs");
    fireEvent.change(needsSlider, { target: { value: "53" } });

    expect(mockOnRuleChange).toHaveBeenCalledWith(
      expect.objectContaining({ needs: 55 })
    );
  });

  it("should update all sliders when switching between preset rules", async () => {
    render(
      <RuleSelector
        onRuleChange={mockOnRuleChange}
        budgetRule={defaultBudgetRule}
      />
    );

    const rule7515Radio = screen.getByTestId("radio-75-10-15");
    const customRadio = screen.getByTestId("radio-custom");

    fireEvent.click(rule7515Radio);

    fireEvent.click(customRadio);

    expect(screen.getByText("Needs 75%")).toBeInTheDocument();
    expect(screen.getByText("Wants 10%")).toBeInTheDocument();
    expect(screen.getByText("Savings 15%")).toBeInTheDocument();
  });
});
