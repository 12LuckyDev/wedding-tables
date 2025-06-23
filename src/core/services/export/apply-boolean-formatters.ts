import { BooleanFormatter } from '../../models';

export const applyBooleanFormatter = (value: boolean, formatters: BooleanFormatter[], formatterId?: string): string => {
  const formatter = formatters.find(({ id }) => id === formatterId);

  if (!formatter) {
    return String(value);
  }

  return value ? formatter.trueLabel : formatter.falseLabel;
};
