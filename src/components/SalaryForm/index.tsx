import { useEffect, useState } from "react";
import { z } from "zod";

import { RuleSelector } from "@/components/RuleSelector";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const [touched, setTouched] = useState(false);
  const [budgetRule, setBudgetRule] = useState<BudgetRule>({
    needs: 50,
    wants: 30,
    savings: 20,
  });

  useEffect(() => {
    if (touched && salary !== "") {
      try {
        const parsedSalary = salarySchema.parse(Number(salary));
        setError("");
        onSubmit(parsedSalary, budgetRule);
      } catch (error) {
        if (error instanceof z.ZodError) {
          setError(error.issues[0].message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      }
    } else if (salary === "" && touched) {
      setError("Salary is required");
    } else {
      setError("");
    }
  }, [salary, budgetRule, onSubmit, touched]);

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalary(e.currentTarget.value);
    if (!touched) setTouched(true);
  };

  const handleRuleChange = (newBudgetRule: BudgetRule) => {
    setBudgetRule(newBudgetRule);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-6">What's your net salary?</h1>
        <p className="text-muted-foreground">
          This information will be used solely to calculate your budget
          allocation based on the 50/30/20 rule or your custom budget rule. We
          prioritize your privacy; no personal data is stored or used for any
          other purpose. Our goal is to provide you with a helpful financial
          planning tool tailored to your income.
        </p>
      </div>
      <RuleSelector onRuleChange={handleRuleChange} budgetRule={budgetRule} />
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
            onChange={handleSalaryChange}
            onBlur={() => setTouched(true)}
          />
        </div>
        {error && <p className="text-destructive">{error}</p>}
      </div>
    </div>
  );
};

export default SalaryForm;
