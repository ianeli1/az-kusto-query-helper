import { useMemo, useState } from "react";
import classes from "../styles/prop.module.css";
import { pick } from "../tools";

export interface PropertiesProps {
  data: {
    [name: string]: any;
  };
}

export function PropertiesViewer({ data }: PropertiesProps) {
  const elements = useMemo(
    () => Object.entries(data).sort((a, b) => +(a > b)),
    [data]
  );

  return (
    <div className="w-full flex flex-col font-sans">
      <div className="m-2 p-2 rounded-lg bg-gray-50 flex-col">
        {elements.map(([name, value]) => (
          <PropertyEntry key={name + value} name={name} value={value} />
        ))}
      </div>
    </div>
  );
}

interface PropertyEntryProps {
  name: string;
  value: string | object;
}

function PropertyEntry({ name, value }: PropertyEntryProps) {
  //TODO add tooltips

  const valueJSONd = JSON.stringify(value, null, 2);
  const [copied, setCopied] = useState(false);

  function onClickText() {
    navigator.clipboard.writeText(valueJSONd);
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  }

  return (
    <section
      className={`flex flex-1 m-1 p-1 bg-gray-200 rounded ${classes.entry}`}
    >
      <h1 className="w-1/6 overflow-hidden overflow-ellipsis border-r border-gray-300 mr-2 pr-2">
        {name}
      </h1>

      {typeof value === "object" ? (
        <PropertiesViewer data={value} />
      ) : (
        <code onClick={onClickText} className="flex-1">
          {valueJSONd}
          <span className="font-sans bg-gray-900 text-white w-32 text-center rounded p-1">
            {copied
              ? pick(["😄", "🤗", "🙂", "😬", "😂", "🦝", "✅"])
              : "Click to copy"}
          </span>
        </code>
      )}
    </section>
  );
}
