"use client";

import { CalendarComponent } from "./components/Calendar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CalendarComponent />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
