import { NeovisV } from "../neovis/index";
import type { INeovisConfig } from "neovis.js";
import { useEffect, useRef } from "react";
import { flattenProperties } from "../tools";

export interface ViewerProps {
  query: string;
  onClick: (t: NeovisEvent) => void;
}

export function Viewer({ query, onClick }: ViewerProps) {
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const config: INeovisConfig = {
      container_id: "coolDiv",
      server_url: "",
      server_password: "",
      server_user: "",
      initial_cypher: query,
      console_debug: true,
      labels: {
        Table: {
          caption: "tableName",
          image: "/table.png",
        },
        Movie: {
          caption: "title",
          image: "/functions.png",
        },
      },
    };
    fetch("/api/neo4j", {
      body: JSON.stringify({
        query,
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    })
      .then((v) => v.json())

      .then((records) => {
        console.log(records);
        //@ts-ignore
        vis.renderRecords(records);
      });

    const vis = new NeovisV(config);

    vis.registerOnEvent("completed", () => {
      //@ts-ignore
      vis["_network"].on("click", (event) => {
        if (event.nodes.length > 0) {
          const props = vis.nodes.get(event.nodes[0]);
          onClick({
            type: "node",
            id: event.nodes[0],
            //@ts-ignore
            properties: flattenProperties(
              //@ts-ignore
              props.raw.properties
            ),
            //@ts-ignore
            label: props.raw.labels[0],
          });
          return;
        }

        if (event.edges.length > 0) {
          const props = vis.edges.get(event.edges[0]);
          onClick({
            type: "edge",
            id: event.edges[0],
            //@ts-ignore
            properties: flattenProperties(
              //@ts-ignore
              props.raw.properties
            ),
            //@ts-ignore
            label: props.raw.type,
          });
          return;
        }

        return;
      });
    });
  }, [onClick, query]);

  return (
    <div
      id="coolDiv"
      className="h-full w-full"
      ref={(r) => (divRef.current = r ?? undefined)}
    />
  );
}

export default Viewer;
