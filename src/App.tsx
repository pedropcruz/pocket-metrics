import { useState } from "react";

import BudgetChart from "@/components/BudgetChart";
import SalaryForm from "@/components/SalaryForm";

export default function App() {
  const [salary, setSalary] = useState(0);
  const [budgetRule, setBudgetRule] = useState<BudgetRule>({
    needs: 50,
    wants: 30,
    savings: 20,
  });

  const handleSubmit = (newSalary: number, newBudgetRule: BudgetRule) => {
    setSalary(newSalary);
    setBudgetRule(newBudgetRule);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center w-full bg-slate-100">
      <h1 className="text-4xl font-bold mb-12">Pocket Metrics</h1>
      <main className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto items-center">
        <SalaryForm onSubmit={handleSubmit} />
        <BudgetChart salary={salary} budgetRule={budgetRule} />
      </main>

      <footer className="fixed bottom-0 left-0 z-20 w-full p-4  border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Devsplan™
          </a>
          . All Rights Reserved.
        </span>
      </footer>
    </div>
  );
}
