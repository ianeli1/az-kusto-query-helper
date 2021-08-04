const NeovisVanilla = require("neovis.js").default;
import {
  ClickEdgeEvent,
  ClickNodeEvent,
  CompletionEvent,
  ErrorEvent,
} from "./events";
import { Neo4jApiBody } from "../pages/api/neo4j";
import * as vis from "vis-network/standalone";
import { INeovisConfig } from "neovis.js";

export class NeovisV extends NeovisVanilla {
  constructor(config: INeovisConfig) {
    super(config);
  }

  renderRecords(records: Neo4jApiBody) {
    let recordCount = 0;
    const _query = this._query as string;

    const dataBuildPromises = [];

    const dataPromises = records.map(async (v) => {
      if (v.n) {
        v.n.identity.toInt = function () {
          return Math.max(this.low, this.high);
        };
        let node = await this.buildNodeVisObject(v.n);
        try {
          this._addNode(node);
        } catch (e) {
          this._consoleLog(e, "error");
        }
      } else if (v.e /*v instanceof Neo4j.types.Relationship*/) {
        let edge = this.buildEdgeVisObject(v.e);
        this._addEdge(edge);
      } else if (v.p /*v instanceof Neo4j.types.Path*/) {
        this._consoleLog("PATH");
        this._consoleLog(v);
        let startNode = await this.buildNodeVisObject(v.p.start);
        let endNode = await this.buildNodeVisObject(v.p.end);

        this._addNode(startNode);
        this._addNode(endNode);

        for (let obj of v.p.segments) {
          this._addNode(await this.buildNodeVisObject(obj.start));
          this._addNode(await this.buildNodeVisObject(obj.end));
          this._addEdge(this.buildEdgeVisObject(obj.relationship));
        }
      } else if (v instanceof Array) {
        for (let obj of v) {
          this._consoleLog("Array element constructor:");
          this._consoleLog(obj && obj.constructor.name);
          if (obj.n /*obj instanceof Neo4j.types.Node*/) {
            let node = await this.buildNodeVisObject(obj);
            this._addNode(node);
          } else if (obj.r /*instanceof Neo4j.types.Relationship*/) {
            let edge = this.buildEdgeVisObject(obj);

            this._addEdge(edge);
          }
        }
      } else {
        console.error("Oops, idk what these keys are for", Object.keys(v));
      }
    });
    dataBuildPromises.push(Promise.all(dataPromises));

    Promise.all(dataBuildPromises).then(() => {
      if (this._network && this._network.body.data.nodes.length > 0) {
        this._data.nodes.update(Object.values(this._nodes));
        this._data.edges.update(Object.values(this._edges));
      } else {
        let options = {
          nodes: {
            //shape: 'dot',
            font: {
              size: 26,
              strokeWidth: 7,
            },
            scaling: {},
          },
          edges: {
            arrows: {
              to: { enabled: this._config.arrows || false }, // FIXME: handle default value
            },
            length: 200,
          },
          layout: {
            improvedLayout: false,
            hierarchical: {
              enabled: this._config.hierarchical || false,
              sortMethod: this._config.hierarchical_sort_method || "hubsize",
            },
          },
          physics: {
            // TODO: adaptive physics settings based on size of graph rendered
            // enabled: true,
            // timestep: 0.5,
            // stabilization: {
            //     iterations: 10
            // }

            adaptiveTimestep: true,
            // barnesHut: {
            //     gravitationalConstant: -8000,
            //     springConstant: 0.04,
            //     springLength: 95
            // },
            stabilization: {
              iterations: 200,
              fit: true,
            },
          },
        };

        const container = this._container;
        this._data = {
          nodes: new vis.DataSet(
            Object.values(this._nodes as Record<string, any>)
          ),
          edges: new vis.DataSet(
            Object.values(this._edges as Record<string, any>)
          ),
        };

        this._consoleLog(this._data.nodes);
        this._consoleLog(this._data.edges);

        // Create duplicate node for any this reference relationships
        // NOTE: Is this only useful for data model type data
        // this._data.edges = this._data.edges.map(
        //     function (item) {
        //          if (item.from == item.to) {
        //             const newNode = this._data.nodes.get(item.from)
        //             delete newNode.id;
        //             const newNodeIds = this._data.nodes.add(newNode);
        //             this._consoleLog("Adding new node and changing this-ref to node: " + item.to);
        //             item.to = newNodeIds[0];
        //          }
        //          return item;
        //     }
        // );
        this._network = new vis.Network(container, this._data, options);
      }
      this._consoleLog("completed");
      setTimeout(() => {
        this._network.stopSimulation();
      }, 10000);
      this._events.generateEvent(CompletionEvent, {
        record_count: recordCount,
      });

      let neoVis = this;
      this._network.on("click", function (this: vis.Network, params: any) {
        if (params.nodes.length > 0) {
          let nodeId = this.getNodeAt(params.pointer.DOM);
          neoVis._events.generateEvent(ClickNodeEvent, {
            nodeId: nodeId,
            node: neoVis._nodes[nodeId],
          });
        } else if (params.edges.length > 0) {
          let edgeId = this.getEdgeAt(params.pointer.DOM);
          neoVis._events.generateEvent(ClickEdgeEvent, {
            edgeId: edgeId,
            edge: neoVis._edges[edgeId],
          });
        }
      });
    });
  }
}
