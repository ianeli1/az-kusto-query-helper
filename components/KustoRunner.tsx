import { useSession, signIn } from "next-auth/client";
import { useState } from "react";
import {
  KustoConnectionStringBuilder,
  Client as KustoClient,
} from "azure-kusto-data";
import Select from "react-select";

export interface KustoRunnerProps {
  query: string;
}

//todo implement templating
//todo install monaco and https://github.com/Azure/monaco-kusto

const kustoEndpoints = [
  {
    value: "https://wawscus.kusto.windows.net",
    label: "Wawscus",
  },
  {
    value: "https://wawseus.kusto.windows.net",
    label: "Wawseus",
  },
  {
    value: "https://wawswus.kusto.windows.net",
    label: "Wawswus",
  },
];

export function KustoRunner({ query: initialQuery }: KustoRunnerProps) {
  const [session] = useSession();
  const [query, setQuery] = useState(initialQuery);
  const [endpoint, setEndpoint] = useState<typeof kustoEndpoints[number]>(
    kustoEndpoints[0]
  );
  const [queryResult, setQueryResult] = useState<string | undefined>(undefined);

  async function onRun() {
    if (session) {
      const client = new KustoClient(
        KustoConnectionStringBuilder.withAccessToken(
          endpoint.value,
          session.accessToken as string
        )
      );

      const results = await client.execute("wawsprod", query);
      console.log("Query executed!!", { results });
      setQueryResult(JSON.stringify(results, null, 2));
    }
  }

  return (
    <div className="">
      <Select
        options={kustoEndpoints}
        value={endpoint}
        onChange={(e) => e && setEndpoint(e)}
      />
      <div>
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} />
        <button disabled={!session} onClick={onRun}>
          Run
        </button>
      </div>
      <div>{queryResult}</div>
    </div>
  );
}
