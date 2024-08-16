interface RuleSelectorProps {
  onRuleChange: (rule: BudgetRule) => void;
  budgetRule: BudgetRule;
}

type BudgetRule = {
  needs: number;
  wants: number;
  savings: number;
};
