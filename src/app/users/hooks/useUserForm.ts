import { patchUser, registerUser } from "@/app/api/users";
import { UserType } from "@/app/types/userType";
import { parseOnlyNumber } from "@/app/utils/textUtils";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const useUserForm = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [isBlackList, setIsBlackList] = useState<boolean>(false);
  const [memo, setMemo] = useState<string>("");

  const validateForm = useCallback(() => {
    if (isEmpty(name)) {
      showToast({
        message: "이름을 입력해주세요.",
        type: "error",
      });
      return false;
    }

    if (isEmpty(phoneNumber)) {
      showToast({
        message: "핸드폰 번호를 입력해주세요.",
        type: "error",
      });
      return false;
    }

    return true;
  }, [name, phoneNumber]);

  const submitUserForm = useCallback(async () => {
    if (!validateForm()) return;

    try {
      await registerUser({
        name,
        email,
        phoneNumber: parseOnlyNumber(phoneNumber),
        memo,
        isBlackList,
        company,
      });

      showToast({
        message: "회원이 등록되었습니다.",
        type: "success",
      });
      router.push("/users");
    } catch {
      showToast({
        message: "회원 등록에 실패했습니다.",
        type: "error",
      });
    }
  }, [name, email, phoneNumber, company, memo, isBlackList, validateForm]);

  const editUserForm = useCallback(
    async (id: UserType["id"]) => {
      if (!validateForm()) return;

      try {
        await patchUser(id, {
          name,
          email,
          phoneNumber: parseOnlyNumber(phoneNumber),
          memo,
          isBlackList,
          company,
        });

        showToast({
          message: "회원이 수정되었습니다.",
          type: "success",
        });
        router.push("/users");
      } catch {
        showToast({
          message: "회원 수정에 실패했습니다.",
          type: "error",
        });
      }
    },
    [name, email, phoneNumber, company, memo, isBlackList, validateForm]
  );

  return {
    name,
    setName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    company,
    setCompany,
    submitUserForm,
    isBlackList,
    setIsBlackList,
    memo,
    setMemo,
    editUserForm,
  };
};
