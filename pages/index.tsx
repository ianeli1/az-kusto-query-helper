import Head from "next/head";
import styles from "../styles/Home.module.css";
import type { ViewerProps } from "../components/viewer";
import dynamic from "next/dynamic";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import SideWindow from "../components/SideWindow";
import { useState } from "react";
import { PropertiesViewer } from "../components/PropertiesViewer";

export function getServerSideProps({}: GetServerSidePropsContext) {
  const { N4J_URL, N4J_USER, N4J_PASS } = process.env;

  if (!N4J_URL || !N4J_USER || !N4J_PASS) {
    throw new Error("A environment variable is missing :(");
  }

  return {
    props: {
      conn: {
        query: "match (n) return n",
        url: N4J_URL,
        user: N4J_USER,
        pass: N4J_PASS,
      },
    },
  } as GetServerSidePropsResult<HomeProps>;
}

const Viewer = dynamic(() => import("../components/viewer"), { ssr: false });

interface HomeProps {
  conn: Omit<ViewerProps, "onClick">;
}

export default function Home({ conn }: HomeProps) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SideWindow show={open} onClose={() => setOpen(false)}>
        <PropertiesViewer data={data} />
      </SideWindow>

      <Viewer
        onClick={(x) => {
          setOpen(true);
          setData(x);
        }}
        {...conn}
      />
    </div>
  );
}
