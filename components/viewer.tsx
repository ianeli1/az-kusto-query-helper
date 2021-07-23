import Neovis, { INeovisConfig } from "neovis.js";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useEffect, useRef } from "react";
import { flattenProperties } from "../tools";

export interface ViewerProps {
  query: string;
  url: string;
  user: string;
  pass: string;
  onClick: (t: NeovisEvent) => void;
}

export function Viewer({ query, pass, user, url, onClick }: ViewerProps) {
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const config: INeovisConfig = {
      container_id: "coolDiv",
      server_url: url,
      server_password: pass,
      server_user: user,
      initial_cypher: query,
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
    const vis = new Neovis(config);
    vis.render();

    vis.registerOnEvent("completed", (e) => {
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
  }, [onClick, pass, url, user, query]);

  return (
    <div
      id="coolDiv"
      className="h-full w-full"
      ref={(r) => (divRef.current = r ?? undefined)}
    />
  );
}

export default Viewer;
