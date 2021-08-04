import { NextApiRequest, NextApiResponse } from "next";
import { driver as Neo4jDriver, auth, QueryResult } from "neo4j-driver";

if (!process.env.N4J_URL || !process.env.N4J_USER || !process.env.N4J_PASS) {
  throw new Error("Missing credentials for N4j");
}

const driver = Neo4jDriver(
  process.env.N4J_URL,
  auth.basic(process.env.N4J_USER, process.env.N4J_PASS),
  {
    maxConnectionPoolSize: 100,
    connectionAcquisitionTimeout: 10000,
  }
);

export type Neo4jApiBody = ReturnType<QueryResult["records"][0]["toObject"]>[];

export default async function Neo4jAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.body;

  if (!query) {
    res.status(400).json({
      error: "query not provided",
    });
    return;
  }

  const session = driver.session();
  const result = await session.run(query);
  const body: Neo4jApiBody = result.records.map((v) => v.toObject());
  res.json(body);
  session.close();
  return;
}
