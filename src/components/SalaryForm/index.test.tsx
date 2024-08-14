import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SalaryForm from "./";
import { beforeEach } from "node:test";

describe("SalaryForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("should render the SalaryForm component", () => {
    render(<SalaryForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText("What's your net salary?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Calculate/i })
    ).toBeInTheDocument();
  });

  it("should allow the user to enter a valid net salary", () => {
    render(<SalaryForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/net salary/i);
    fireEvent.change(input, { target: { value: "10000" } });

    const button = screen.getByRole("button", { name: /calculate/i });
    fireEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalledWith(10000);
    expect(screen.queryByText(/salary must be/i)).not.toBeInTheDocument();
  });

  it("displays an error for negative salary", async () => {
    render(<SalaryForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/net salary/i);
    fireEvent.change(input, { target: { value: -1 } });

    const submitButton = screen.getByRole("button", { name: /calculate/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/salary must be positive number/i)
    ).toBeInTheDocument();
  });

  it("displays an error for salary exceeding the maximum", async () => {
    render(<SalaryForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/net salary/i);
    fireEvent.change(input, { target: { value: "2000000" } });

    const submitButton = screen.getByRole("button", { name: /calculate/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/salary must be less than 1,000,000/i)
    ).toBeInTheDocument();
  });
});
