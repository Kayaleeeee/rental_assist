"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/Button";

const QuoteListPage = () => {
  const router = useRouter();

  return (
    <div>
      <Button
        style={{ width: "200px" }}
        size="Medium"
        onClick={() => router.push("/quotes/create")}
      >
        견적서 만들기
      </Button>
    </div>
  );
};

export default QuoteListPage;
