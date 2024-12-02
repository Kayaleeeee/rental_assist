import { updateQuote } from "@/app/api/quote";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { ReservationFormState } from "../hooks/useReservationForm";
import {
  getEquipmentTotalPrice,
  getValidReservationForm,
} from "../utils/reservationUtils";
import {
  createQuoteItemList,
  createQuoteSet,
  deleteQuoteItemList,
  deleteQuoteSetList,
  updateQuoteItem,
  updateQuoteSet,
} from "@/app/api/quoteItems";

import { isEmpty, isEqual } from "lodash";

export const onUpdateReservation = async ({
  quoteId,
  reservationId,
  form,
  dateRange,
  originQuoteItemList,
  originSetList,
  equipmentItemList,
  groupEquipmentList,
  rentalDays,
}: {
  quoteId: number;
  reservationId: number;
  originQuoteItemList: EquipmentListItemState[];
  originSetList: SetEquipmentStateType[];
  form: ReservationFormState;
  dateRange: { startDate?: string; endDate?: string };
  equipmentItemList: EquipmentListItemState[];
  groupEquipmentList: SetEquipmentStateType[];
  rentalDays: number;
}) => {
  try {
    const validForm = await getValidReservationForm({
      form,
      dateRange,
      equipmentItemList,
      groupEquipmentList,
      rentalDays,
    });

    if (!validForm) throw new Error("form validation 실패");

    // Step 1: Set 변경 사항 계산
    const {
      added: addedSets,
      removed: removedSets,
      updated: updatedSets,
    } = calculateDifferences(originSetList, groupEquipmentList, "id");

    // Step 2: 각 Set의 `equipmentList` 변경 사항 확인
    const equipmentChangesBySet = updatedSets.map((updatedSet) => {
      const originSet = originSetList.find((set) => set.id === updatedSet.id);
      if (!originSet) return null;

      const {
        added: addedItems,
        removed: removedItems,
        updated: updatedItems,
      } = calculateDifferences(
        originSet.equipmentList,
        updatedSet.equipmentList,
        "equipmentId"
      );

      return {
        setId: updatedSet.id,
        addedItems,
        removedItems,
        updatedItems,
      };
    });

    // Step 3: 독립적인 Item 변경 사항 계산
    const {
      added: addedItems,
      removed: removedItems,
      updated: updatedItems,
    } = calculateDifferences(
      originQuoteItemList,
      equipmentItemList,
      "equipmentId"
    );

    // Step 4: 처리 로직
    // 4-1. 삭제된 Sets
    if (!isEmpty(removedSets)) {
      const removeSetIds = removedSets.map((set) => set.id).join(",");
      await deleteQuoteSetList(removeSetIds);

      // 처리 후 삭제된 세트 안의 원래 equipmentList item 삭제
      for (const set of removedSets) {
        const removeItemIds = set.equipmentList
          .map((item) => item.equipmentId)
          .join(",");
        if (removeItemIds) {
          await deleteQuoteItemList(removeItemIds);
        }
      }
    }

    // 4-2. 추가된 Sets
    if (!isEmpty(addedSets)) {
      const newSetPayload = addedSets.map((set) => ({
        setId: set.id,
        quoteId,
        price: set.price,
        totalPrice: set.totalPrice,
        discountPrice: set.discountPrice,
      }));

      const result = await createQuoteSet(newSetPayload);

      // result 값으로 받은 retId로 addedSet 내 equipmentList 생성
      //   if (result) {
      //     for (const set of addedSets) {
      //       const newItemPayload = set.equipmentList.map((item) => ({
      //         equipmentId: item.equipmentId,
      //         quantity: item.quantity,
      //         price: 0, // 세트 내 아이템들은 0원으로 처리
      //         totalPrice: 0,
      //         quoteId,
      //         setId: result.setId, // 반환된 setId로 설정
      //       }));
      //       await createQuoteItemList(newItemPayload);
      //     }
      //   }
      // }

      // 4-3. 수정된 Sets
      // if (!isEmpty(updatedSets)) {
      //   await Promise.all(
      //     updatedSets.map((set) =>
      //       updateQuoteSet(set.id, {
      //         quoteId: set.quoteId,
      //         price: set.price,
      //         totalPrice: set.totalPrice,
      //         discountPrice: set.discountPrice,
      //       })
      //     )
      //   );

      // 수정된 Set 내 equipmentList 변경 사항 처리
      for (const changes of equipmentChangesBySet) {
        if (!changes) continue;

        const { setId, addedItems, removedItems, updatedItems } = changes;

        if (!isEmpty(removedItems)) {
          const removeItemIds = removedItems
            .map((item) => item.equipmentId)
            .join(",");
          await deleteQuoteItemList(removeItemIds);
        }

        if (!isEmpty(addedItems)) {
          const newItemPayload = addedItems.map((item) => ({
            equipmentId: item.equipmentId,
            quantity: item.quantity,
            price: 0,
            totalPrice: 0,
            quoteId,
            setId,
          }));
          await createQuoteItemList(newItemPayload);
        }

        if (!isEmpty(updatedItems)) {
          await Promise.all(
            updatedItems.map((item) =>
              updateQuoteItem(item.id, {
                quantity: item.quantity,
                totalPrice: getEquipmentTotalPrice(item, rentalDays),
              })
            )
          );
        }
      }
    }

    // 4-4. 독립적인 Items 처리
    if (!isEmpty(removedItems)) {
      const removeItemIds = removedItems
        .map((item) => item.equipmentId)
        .join(",");
      await deleteQuoteItemList(removeItemIds);
    }

    if (!isEmpty(addedItems)) {
      const newItemPayload = addedItems.map((item) => ({
        equipmentId: item.equipmentId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: getEquipmentTotalPrice(item, rentalDays),
        quoteId,
        setId: null,
      }));
      await createQuoteItemList(newItemPayload);
    }

    if (!isEmpty(updatedItems)) {
      await Promise.all(
        updatedItems.map((item) =>
          updateQuoteItem(item.id, {
            quantity: item.quantity,
            price: item.price,
            totalPrice: getEquipmentTotalPrice(item, rentalDays),
          })
        )
      );
    }

    // Step 5: Quote 업데이트
    await updateQuote(quoteId, validForm);

    return { reservationId };
  } catch (error) {
    throw error;
  }
};

const calculateDifferences = <T>(
  originList: T[],
  updatedList: T[],
  key: keyof T
) => {
  // 추가된 항목
  const added = updatedList.filter(
    (updatedItem) =>
      !originList.some((originItem) => originItem[key] === updatedItem[key])
  );

  // 삭제된 항목
  const removed = originList.filter(
    (originItem) =>
      !updatedList.some((updatedItem) => updatedItem[key] === originItem[key])
  );

  // 수정된 항목
  const updated = updatedList.filter((updatedItem) =>
    originList.some(
      (originItem) =>
        originItem[key] === updatedItem[key] &&
        !isEqual(originItem, updatedItem)
    )
  );

  return { added, removed, updated };
};
