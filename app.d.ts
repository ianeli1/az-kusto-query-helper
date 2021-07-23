interface TableEntry {
  id: number;
  pos: [number, number];
  connectedTo?: (
    | {
        id: number;
        name: string;
      }
    | number
  )[];
  icon: string;
  name: string;
}

type TableData = TableEntry[];

interface NeovisEvent {
  type: "node" | "edge";
  id: number;
  properties: {
    [name: string]: string | number;
  };
  label: string;
}
