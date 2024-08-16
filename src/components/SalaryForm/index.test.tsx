import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    expect(screen.getByLabelText(/net salary/i)).toBeInTheDocument();
  });

  it("should allow the user to enter a valid net salary and auto-submit", async () => {
    render(<SalaryForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/net salary/i);
    fireEvent.change(input, { target: { value: "10000" } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(10000, expect.any(Object));
    });
    expect(screen.queryByText(/salary must be/i)).not.toBeInTheDocument();
  });

  it("should display an error for negative salary", async () => {
    render(<SalaryForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/net salary/i);
    fireEvent.change(input, { target: { value: "-1" } });
    fireEvent.blur(input);

    expect(
      await screen.findByText(/salary must be positive number/i)
    ).toBeInTheDocument();
  });

  it("should update submission when input changes", async () => {
    render(<SalaryForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/net salary/i);
    fireEvent.change(input, { target: { value: "5000" } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(5000, expect.any(Object));
    });

    fireEvent.change(input, { target: { value: "7000" } });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(7000, expect.any(Object));
    });
  });
});
