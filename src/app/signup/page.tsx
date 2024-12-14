"use client";

import { FormWrapper } from "@components/Form/FormWrapper";
import formStyles from "@components/Form/index.module.scss";
import { Label } from "@components/Form/Label";
import { EditableField } from "@components/EditableField";
import { useMemo, useState } from "react";
import { Button } from "@components/Button";
import { signup } from "@/app/login/actions/auth/login";
import { Margin } from "@components/Margin";
import Link from "next/link";
import styles from "./page.module.scss";
import { CustomError } from "../class/CustomError";
import { ErrorMessage } from "../components/Message/ErrorMessage";
import { showToast } from "../utils/toastUtils";

const SignUpPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isPasswordMatch = useMemo(() => {
    return password === confirmPassword;
  }, [confirmPassword, password]);

  const handleSignUp = async () => {
    if (!isPasswordMatch) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await signup({ email, password });
      showToast({
        message: "회원가입이 완료되었습니다.",
        type: "success",
      });
    } catch (e) {
      const errorMessage = (e as CustomError).message || "알 수 없는 에러 발생";
      setErrorMessage(errorMessage);
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
        <h1>회원가입</h1>
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
        <section className={formStyles.sectionWrapper}>
          <Label title="비밀번호 확인" />
          <EditableField
            placeholder="비밀번호를 입력해주세요."
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </section>
        {errorMessage && (
          <Margin bottom={20}>
            <ErrorMessage message={errorMessage} />
          </Margin>
        )}

        <Button
          size="Medium"
          style={{
            width: "100%",
          }}
          onClick={handleSignUp}
        >
          회원가입
        </Button>
        <Margin top={40} bottom={20}>
          <Link className={styles.signupButton} href={"/login"}>
            로그인 하기
          </Link>
        </Margin>
      </div>
    </FormWrapper>
  );
};

export default SignUpPage;
