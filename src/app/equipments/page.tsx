"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { useEffect } from "react";
import { getEquipmentList } from "../api/equipments";

export default function EquipmentPage() {
  const router = useRouter();

  useEffect(() => {
    getEquipmentList().then((res) => console.log(res));
  });

  return (
    <div>
      <Button size="Medium" onClick={() => router.push("/equipments/create")}>
        장비 추가
      </Button>
      <div
        style={{
          background: "white",
          width: "100%",
          height: "600px",
          borderRadius: "16px",
          marginTop: "24px",
        }}
      ></div>
    </div>
  );
}
