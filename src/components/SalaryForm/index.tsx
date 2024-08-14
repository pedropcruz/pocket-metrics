import { useState } from "react";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const salarySchema = z
  .number({
    required_error: "Salary is required",
    invalid_type_error: "Salary must be a number",
  })
  .positive("Salary must be positive number")
  .lte(1000000, "Salary must be less than 1,000,000");

const SalaryForm = ({ onSubmit }: SalaryFormProps) => {
  const [salary, setSalary] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const parsedSalary = salarySchema.parse(Number(salary));
      setError("");
      onSubmit(parsedSalary);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.issues[0].message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-6">What's your net salary?</h1>
        <p className="text-muted-foreground">
          This information will be used solely to calculate your budget
          allocation based on the 50/30/20 rule. We prioritize your privacy; no
          personal data is stored or used for any other purpose. Our goal is to
          provide you with a helpful financial planning tool tailored to your
          income.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="net-salary">Net Salary</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-muted-foreground">€</span>
            </div>
            <Input
              id="net-salary"
              type="number"
              placeholder="Enter your net salary"
              className="pl-8"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
          {error && <p className="text-destructive">{error}</p>}
        </div>
        <Button type="submit" className="w-full">
          Calculate
        </Button>
      </form>
    </div>
  );
};

export default SalaryForm;
