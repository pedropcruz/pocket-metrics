import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const RuleSelector = ({
  onRuleChange,
  budgetRule,
}: RuleSelectorProps) => {
  const [selectedRule, setSelectedRule] = useState<
    "50-30-20" | "75-10-15" | "custom"
  >("50-30-20");
  const [customRule, setCustomRule] = useState<BudgetRule>(budgetRule);

  const rules = [
    {
      value: "50-30-20",
      label: "50/30/20 Rule",
    },
    {
      value: "75-10-15",
      label: "75/10/15 Rule",
    },
    {
      value: "custom",
      label: "Custom",
    },
  ];

  const handleRuleChange = (value: string) => {
    setSelectedRule(value as "50-30-20" | "75-10-15" | "custom");
    let newRule: BudgetRule;

    if (value === "50-30-20") {
      newRule = { needs: 50, wants: 30, savings: 20 };
    } else if (value === "75-10-15") {
      newRule = { needs: 75, wants: 10, savings: 15 };
    } else {
      newRule = customRule;
    }

    setCustomRule(newRule);
    onRuleChange(newRule);
  };

  const handleCustomRuleChange = (
    category: keyof BudgetRule,
    value: number[]
  ) => {
    const newValue = Math.round(value[0] / 5) * 5; // Round to nearest 5
    const otherCategories = Object.keys(customRule).filter(
      (key) => key !== category
    ) as (keyof BudgetRule)[];

    const newCustomRule = { ...customRule };
    const oldValue = newCustomRule[category];
    newCustomRule[category] = newValue;

    const difference = oldValue - newValue;

    if (difference !== 0) {
      // Distribute the difference among other categories
      let remainingDifference = difference;
      otherCategories.forEach((key, index) => {
        if (index === otherCategories.length - 1) {
          // Last category gets the remaining difference
          newCustomRule[key] += remainingDifference;
        } else {
          const distribution =
            Math.round(difference / (otherCategories.length - index) / 5) * 5;
          newCustomRule[key] += distribution;
          remainingDifference -= distribution;
        }
        newCustomRule[key] = Math.max(0, Math.min(100, newCustomRule[key]));
      });
    }

    // Ensure total is exactly 100%
    const total = Object.values(newCustomRule).reduce(
      (sum, val) => sum + val,
      0
    );
    if (total !== 100) {
      const diff = 100 - total;
      const adjustableCategory = otherCategories.find(
        (cat) =>
          newCustomRule[cat] + diff >= 0 && newCustomRule[cat] + diff <= 100
      );
      if (adjustableCategory) {
        newCustomRule[adjustableCategory] += diff;
      }
    }

    setCustomRule(newCustomRule);
    onRuleChange(newCustomRule);
  };

  useEffect(() => {
    if (selectedRule === "custom") {
      onRuleChange(customRule);
    }
  }, [selectedRule, customRule, onRuleChange]);

  return (
    <div className="space-y-4">
      <Label>Select Budget Rule</Label>
      <RadioGroup
        defaultValue="50-30-20"
        onValueChange={handleRuleChange}
        className="flex items-center gap-4 hover:cursor-pointer"
      >
        {rules.map(({ value, label }) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem value={value} id={`option-${value}`} />
            <Label htmlFor={`option-${value}`}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
      {selectedRule === "custom" && (
        <>
          {(Object.keys(customRule) as (keyof BudgetRule)[]).map((category) => (
            <div key={category} className="space-y-4">
              <Label>
                {`${category.charAt(0).toUpperCase() + category.slice(1)} ${
                  customRule[category]
                }%`}
              </Label>
              <Slider
                id={`slider-${category}`}
                value={[customRule[category]]}
                max={100}
                step={5}
                onValueChange={(value) =>
                  handleCustomRuleChange(category, value)
                }
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};
