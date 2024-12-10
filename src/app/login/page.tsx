"use client";

import { FormWrapper } from "@components/Form/FormWrapper";
import formStyles from "@components/Form/index.module.scss";
import { Label } from "@components/Form/Label";
import { EditableField } from "@components/EditableField";
import { useState } from "react";
import { Button } from "@components/Button";
import { login } from "@actions/auth/login";
import { Margin } from "@components/Margin";
import Link from "next/link";
import styles from "./page.module.scss";
import { showToast } from "../utils/toastUtils";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { fetchUser } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      fetchUser();
      showToast({ message: "로그인 성공", type: "success" });
    } catch {
      showToast({ message: "로그인에 실패했습니다", type: "error" });
    }
  };

  return (
    <FormWrapper>
      <div
        style={{
          maxWidth: "500px",
          marginBottom: "40px",
          marginTop: "20px",
        }}
      >
        <h1>로그인</h1>
        <section className={formStyles.sectionWrapper}>
          <Label title="Email" />
          <EditableField
            placeholder="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </section>
        <section className={formStyles.sectionWrapper}>
          <Label title="비밀번호" />
          <EditableField
            placeholder="비밀번호를 입력해주세요."
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </section>
        <Button
          size="Medium"
          style={{
            width: "100%",
          }}
          onClick={handleLogin}
        >
          로그인
        </Button>
        <Margin top={40} bottom={20}>
          <Link className={styles.signupButton} href={"/signup"}>
            회원가입 하기
          </Link>
        </Margin>
      </div>
    </FormWrapper>
  );
};

export default LoginPage;
