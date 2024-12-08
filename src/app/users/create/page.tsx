"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { TextField } from "@mui/material";
import { Label } from "@/app/components/Form/Label";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { EditableField } from "@/app/components/EditableField";
import { useUserForm } from "../hooks/useUserForm";
import { formatPhoneNumber } from "@/app/utils/textUtils";

const UserRegisterPage = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    company,
    setCompany,
    submitUserForm,
  } = useUserForm();

  return (
    <FormWrapper title="회원 등록">
      <div className={formStyles.sectionWrapper}>
        <Label title="회원명" />
        <EditableField
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={formStyles.sectionWrapper}>
        <Label title="소속" />
        <EditableField
          fullWidth
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div className={formStyles.sectionWrapper}>
        <Label title="전화번호" />
        <EditableField
          value={formatPhoneNumber(phoneNumber || "")}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className={formStyles.sectionWrapper}>
        <Label title="이메일" />
        <TextField
          fullWidth
          multiline
          value={email}
          placeholder="customer@register.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={formStyles.rightAlignButtonWrapper}>
        <Button
          size="Medium"
          style={{ width: "250px" }}
          onClick={submitUserForm}
        >
          등록
        </Button>
      </div>
    </FormWrapper>
  );
};

export default UserRegisterPage;
