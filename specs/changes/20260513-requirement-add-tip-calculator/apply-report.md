# Apply Report: 小费计算器

## Summary

- Branch: feat/tip-calculator
- New: converter/TipCalculator.ets (53 lines)
- Modified: CalculatorPage.ets (+115/-2)
- Total: 2 files, 168 insertions, 2 deletions

## Code

### TipCalculator.ets
- calculate(amount, people, percent) → { perPerson, tipAmount, total }
- Validates: people > 0, amount > 0, percent >= 0
- Rounding: Math.round(x * 100) / 100
- Presets: [10, 15, 18, 20]

### CalculatorPage.ets Changes
1. Import TipCalculator, TipResult
2. State: showTip, tipAmount, tipPeople, tipPercent(15), tipCustomPercent, tipResult, tipError
3. ToggleRow: "小费" mode button
4. TipPanel: amount input + people input + preset buttons + custom% + result display
5. Result: perPerson (large), breakdown (original + tip + total)
6. Original ButtonGrid untouched (AC6)

## AC Matrix

| AC | Status |
|----|--------|
| AC1 Amount/people input | Done |
| AC2 Presets 10/15/18/20 + custom | Done |
| AC3 Per-person 2 decimals | Done |
| AC4 Breakdown (original+tip+total) | Done |
| AC5 People <= 0 error | Done |
| AC6 Regression | Done (conditional render) |

⚠️ No local SDK — needs 爹助 DevEco Studio verification.
