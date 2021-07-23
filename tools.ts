interface rawProperties {
  [name: string]:
    | string
    | {
        low: number;
        high: number;
      };
}

export const flattenProperties = (input: rawProperties) =>
  Object.entries(input).reduce(
    (acc, [name, val]) => ({
      ...acc,
      [name]:
        typeof val != "string"
          ? Math.max(...(Object.values(val as object) as number[]))
          : val,
    }),
    {}
  ) as NeovisEvent["properties"];

export function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}
