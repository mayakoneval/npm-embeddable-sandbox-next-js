import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { ApolloSandbox } from "@apollo/sandbox/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <ApolloSandbox
            graphRef="Apollo-Fullstack-Demo-o3tsz8@current"
            className={styles.embeddedSandbox}
          />
        </div>
      </main>
    </>
  );
}
