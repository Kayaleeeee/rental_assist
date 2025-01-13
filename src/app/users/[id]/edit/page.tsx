"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { TextField } from "@mui/material";
import { Label } from "@/app/components/Form/Label";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { EditableField } from "@/app/components/EditableField";

import { formatPhoneNumber } from "@/app/utils/textUtils";
import { useUserForm } from "../../hooks/useUserForm";
import { useParams } from "next/navigation";
import { useUserDetail } from "../../hooks/useUserDetail";
import { useCallback, useEffect } from "react";
import { CustomCheckbox } from "@/app/components/Checkbox/Checkbox";

const UserEditPage = () => {
  const { id } = useParams();
  const userId = Number(id);

  const {
    name,
    setName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    company,
    setCompany,
    editUserForm,
    memo,
    setMemo,
    isBlackList,
    setIsBlackList,
  } = useUserForm();

  const { detail: userDetail, isLoading } = useUserDetail(userId);

  useEffect(() => {
    if (!userDetail) return;

    setName(userDetail.name);
    setEmail(userDetail.email || "");
    setPhoneNumber(userDetail.phoneNumber || "");
    setCompany(userDetail.company || "");
    setMemo(userDetail.memo || "");
    setIsBlackList(userDetail.isBlackList || false);
  }, [userDetail]);

  const handleEditUserForm = useCallback(async () => {
    if (!userId) return;

    await editUserForm(userId);
  }, [userId, editUserForm]);

  return (
    <FormWrapper title="회원 수정" isLoading={isLoading}>
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
          placeholder="010-0000-0000"
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

      <div className={formStyles.sectionWrapper}>
        <Label title="회원 상태" />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "14px",
            cursor: "pointer",
          }}
          onClick={() => setIsBlackList((prev) => !prev)}
        >
          <CustomCheckbox checked={isBlackList || false} />
          블랙리스트 등록
        </div>
      </div>

      <div className={formStyles.sectionWrapper}>
        <Label title="메모" />
        <TextField
          fullWidth
          multiline
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      <div className={formStyles.rightAlignButtonWrapper}>
        <Button
          size="Medium"
          style={{ width: "250px" }}
          onClick={handleEditUserForm}
        >
          수정
        </Button>
      </div>
    </FormWrapper>
  );
};

export default UserEditPage;
