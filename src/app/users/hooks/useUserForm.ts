import { registerUser } from "@/app/api/users";
import { showToast } from "@/app/utils/toastUtils";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const useUserForm = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [company, setCompany] = useState<string>("");

  const submitUserForm = useCallback(async () => {
    try {
      await registerUser({ name, email, phoneNumber, company });

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
  }, [name, email, phoneNumber, company]);

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
  };
};
