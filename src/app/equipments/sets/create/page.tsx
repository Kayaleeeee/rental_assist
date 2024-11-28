"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { TextField } from "@mui/material";
import { Label } from "@/app/components/Form/Label";
import styles from "../../page.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { formatKoreanCurrency } from "@/app/utils/priceUtils";
import { EditableField } from "@/app/components/EditableField";
import { useSetEquipmentForm } from "./hooks/useSetEquipmentForm";
import { EquipmentSearchModal } from "@/app/reservations/modules/form/EquipmentSearchModal";
import { useState } from "react";
import { isEmpty } from "lodash";
import { SetEquipmentItemEditor } from "../modules/SetEquipmentItemEditor";
import { Margin } from "@/app/components/Margin";

const EquipmentCreatePage = () => {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);

  const {
    title,
    setTitle,
    price,
    setPrice,
    detail,
    setDetail,
    memo,
    setMemo,
    submitEquipmentSetForm,
    equipmentList,
    setEquipmentList,
  } = useSetEquipmentForm();

  return (
    <div>
      <FormWrapper title="풀세트 등록">
        <div className={formStyles.sectionWrapper}>
          <Label title="세트명" />
          <EditableField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={formStyles.sectionWrapper}>
          <Label title="렌탈 가격" />
          <TextField
            fullWidth
            value={price}
            onChange={(e) => {
              const value = Number(e.target.value);

              if (isNaN(value)) return;
              if (value < 0) return;

              setPrice(value);
            }}
          />
          <div style={{ marginTop: "10px" }} />
          <div className={styles.convertedPrice}>
            {formatKoreanCurrency(price)}
          </div>
        </div>

        <div className={formStyles.sectionWrapper}>
          <Label title="상세 정보" />
          <TextField
            fullWidth
            multiline
            value={detail}
            placeholder="상세 정보를 입력해주세요."
            onChange={(e) => setDetail(e.target.value)}
          />
        </div>

        <div className={formStyles.sectionWrapper}>
          <Label title="포함 장비" />
          <Button
            variant="outlined"
            size="Small"
            style={{
              width: "200px",
            }}
            onClick={() => setIsOpenSearchModal(true)}
          >
            장비 추가하기
          </Button>

          {!isEmpty(equipmentList) && (
            <Margin top={20}>
              <div className={styles.equipmentListWrapper}>
                {equipmentList.map((item) => {
                  return (
                    <SetEquipmentItemEditor
                      key={item.id}
                      item={item}
                      onChangeField={(state) =>
                        setEquipmentList((prev) =>
                          prev.map((item) =>
                            item.id === state.id ? state : item
                          )
                        )
                      }
                      onDeleteEquipment={() =>
                        setEquipmentList((prev) =>
                          prev.filter((prevItem) => prevItem.id !== item.id)
                        )
                      }
                    />
                  );
                })}
              </div>
            </Margin>
          )}
        </div>

        <div className={formStyles.sectionWrapper}>
          <Label title="메모" />
          <TextField
            fullWidth
            multiline
            value={memo}
            placeholder="메모를 입력해주세요."
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <div className={styles.buttonWrapper}>
          <Button
            size="Medium"
            style={{ width: "150px" }}
            onClick={submitEquipmentSetForm}
          >
            등록
          </Button>
        </div>
      </FormWrapper>

      {isOpenSearchModal && (
        <EquipmentSearchModal
          onCloseModal={() => setIsOpenSearchModal(false)}
          onConfirm={setEquipmentList}
          disabledIdList={equipmentList.map((item) => item.id)}
        />
      )}
    </div>
  );
};

export default EquipmentCreatePage;
