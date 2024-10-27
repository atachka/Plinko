export const checkPositiveInputValue = (
  value: string,
  minValue: number,
  maxValue: number
) => {
  value = value.replace(/[^0-9.]/g, "");

  value = value.replaceAll(" ", "").replaceAll(/-/g, "");

  let parsedValue = Number.parseFloat(value);

  if (parsedValue < minValue) {
    return "0";
  }

  if (parsedValue > maxValue) {
    return maxValue.toFixed(2);
  }

  const parts: string[] = value.split(".");

  if (parts.length > 2) {
    value = parts[0] + "." + parts[1];
  }

  if (parts.length === 2) {
    parts[1] = parts[1].slice(0, 2);
    value = parts[0] + "." + parts[1];
  }

  if (value[0] === ".") {
    value = "0" + value;
  }

  return value;
};
