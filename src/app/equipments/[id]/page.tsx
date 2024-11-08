"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import styles from "../page.module.scss";

import { EditableField } from "@/app/components/EditableField";
import { Label } from "@/app/components/Form/Label";
import { Button } from "@/app/components/Button";
import { formatKoreanCurrency } from "@/app/utils/priceUtils";
import { useEquipmentDetail } from "../hooks/useEquipmentDetail";
import { useParams, useRouter } from "next/navigation";

const EquipmentDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const equipmentId = Number(params.id);

  const { detail: equipmentDetail } = useEquipmentDetail(equipmentId);

  if (!equipmentDetail) return null;

  return (
    <FormWrapper>
      <div className={styles.sectionWrapper}>
        <Label title="카테고리" />
        <EditableField isEditable={false} value={equipmentDetail.category} />
      </div>

      <div className={styles.sectionWrapper}>
        <Label title="장비명" />
        <EditableField
          isEditable={false}
          fullWidth
          value={equipmentDetail.title}
        />
      </div>
      <div className={styles.sectionWrapper}>
        <Label title="렌탈 가격" />
        <div className={styles.detailPriceWrapper}>
          <EditableField
            isEditable={false}
            fullWidth
            value={equipmentDetail.price}
          />
          <div className={styles.convertedPrice} style={{ marginLeft: "10px" }}>
            ({formatKoreanCurrency(equipmentDetail.price)})
          </div>
        </div>
      </div>

      <div className={styles.sectionWrapper}>
        <Label title="상세 정보" />
        <EditableField
          isEditable={false}
          fullWidth
          multiline
          value={equipmentDetail.detail}
        />
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          size="Medium"
          style={{ width: "150px" }}
          onClick={() => router.push(`/equipments/${equipmentId}/edit`)}
        >
          수정
        </Button>
      </div>
    </FormWrapper>
  );
};

export default EquipmentDetailPage;
