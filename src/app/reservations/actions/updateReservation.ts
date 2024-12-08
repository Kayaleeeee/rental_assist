import { updateQuote } from "@/app/api/quote";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";

import {
  checkUpdateEquipmentAvailability,
  getEquipmentGroupTotalPrice,
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
import { QuoteItemPostPayload, QuoteType } from "@/app/types/quoteType";
import { EquipmentAvailableItem } from "@/app/types/reservationType";
import { ReservationFormState } from "../hooks/useReservationForms";

const convertSetEquipmentListToQuoteItemPayload = (
  quoteId: QuoteType["id"],
  equipmentList: SetEquipmentStateType["equipmentList"],
  option?: Partial<QuoteItemPostPayload[number]>
): QuoteItemPostPayload => {
  return equipmentList.map((item) => ({
    equipmentId: item.equipmentId,
    quantity: item.quantity,
    price: 0,
    totalPrice: 0,
    quoteId,
    ...option,
  }));
};

export const onUpdateReservation = async ({
  quoteId,
  reservationId,
  form,
  dateRange,
  originQuoteItemList,
  originSetList,
  equipmentItemList,
  groupEquipmentList,
}: {
  quoteId: number;
  reservationId: number;
  originQuoteItemList: EquipmentListItemState[];
  originSetList: SetEquipmentStateType[];
  form: ReservationFormState;
  dateRange: { startDate?: string; endDate?: string };
  equipmentItemList: EquipmentListItemState[];
  groupEquipmentList: SetEquipmentStateType[];
}): Promise<
  | {
      isAvailable: false;
      checkedList: EquipmentAvailableItem[];
      reservationId: null;
    }
  | { reservationId: number }
> => {
  try {
    const validForm = await getValidReservationForm({
      form,
      dateRange,
      equipmentItemList,
      groupEquipmentList,
    });

    if (!validForm) throw new Error("form validation 실패");

    const { isAvailable, checkedList } = await checkUpdateEquipmentAvailability(
      {
        dateRange: {
          startDate: validForm.startDate,
          endDate: validForm.endDate,
        },
        equipmentItemList,
        groupEquipmentList,
        quoteId,
      }
    );

    if (!isAvailable) {
      return {
        reservationId: null,
        isAvailable,
        checkedList,
      };
    }

    //  Set 변경 사항 계산
    const {
      added: addedSets,
      removed: removedSets,
      updated: updatedSets,
    } = calculateDifferences(originSetList, groupEquipmentList, "setId");

    // Set 처리 로직
    // (1) 삭제된 Sets
    if (!isEmpty(removedSets)) {
      const removeSetIds = removedSets.map((set) => set.quoteSetId).join(",");
      await deleteQuoteSetList(removeSetIds);

      // 처리 후 삭제된 세트 안의 원래 equipmentList item 삭제
      for (const set of removedSets) {
        const removeItemIds = set.equipmentList
          .map((item) => item.id)
          .join(",");
        if (removeItemIds) {
          await deleteQuoteItemList(removeItemIds);
        }
      }
    }

    // (2) 추가된 Sets
    if (!isEmpty(addedSets)) {
      addedSets.forEach(async (set) => {
        const result = await createQuoteSet([
          {
            setId: set.setId,
            quoteId,
            price: set.price,
            totalPrice: getEquipmentGroupTotalPrice(set),
            discountPrice: set.discountPrice || 0,
          },
        ]);

        if (isEmpty(result)) throw new Error("quote set 생성 실패");

        const quoteItemPayload = set.equipmentList.map((item) => ({
          equipmentId: item.equipmentId,
          quantity: item.quantity,
          price: 0,
          totalPrice: 0,
          quoteId,
          quoteSetId: result[0].id,
          setId: set.setId,
        }));

        await createQuoteItemList(quoteItemPayload);
      });
    }

    // (3) 수정된 Sets
    if (!isEmpty(updatedSets)) {
      await Promise.all(
        updatedSets.map((set) =>
          updateQuoteSet(set.quoteSetId!, {
            quoteId: quoteId,
            price: set.price,
            totalPrice: getEquipmentGroupTotalPrice(set),
            discountPrice: set.discountPrice,
          })
        )
      );
    }

    // (4): 각 Set의 `equipmentList` 변경 사항 확인
    const equipmentChangesBySet = updatedSets.map((updatedSet) => {
      const originSet = originSetList.find(
        (set) => set.quoteSetId === updatedSet.quoteSetId
      );

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
        setId: updatedSet.setId,
        quoteSetId: updatedSet.quoteSetId,
        addedItems,
        removedItems,
        updatedItems,
      };
    });

    // (5) 수정된 Set 내 equipmentList 변경 사항 처리
    for (const changes of equipmentChangesBySet) {
      if (!changes) continue;

      const { setId, quoteSetId, addedItems, removedItems, updatedItems } =
        changes;

      if (!isEmpty(removedItems)) {
        const removeItemIds = removedItems.map((item) => item.id).join(",");
        await deleteQuoteItemList(removeItemIds);
      }

      if (!isEmpty(addedItems)) {
        const newItemPayload = convertSetEquipmentListToQuoteItemPayload(
          quoteId,
          addedItems,
          {
            quoteSetId,
            setId,
          }
        );
        await createQuoteItemList(newItemPayload);
      }

      if (!isEmpty(updatedItems)) {
        await Promise.all(
          updatedItems.map((item) =>
            updateQuoteItem(item.id!, {
              quoteId,
              price: item.price,
              quantity: item.quantity,
              discountPrice: item.discountPrice,
              totalPrice: getEquipmentTotalPrice({
                itemPrice: item.price,
                quantity: item.quantity,
                discountPrice: item.discountPrice,
              }),
              quoteSetId,
              setId,
            })
          )
        );
      }
    }

    //  독립적인 Item 변경 사항 계산
    const {
      added: addedItems,
      removed: removedItems,
      updated: updatedItems,
    } = calculateDifferences(
      originQuoteItemList,
      equipmentItemList,
      "equipmentId"
    );

    // 5. 독립적인 Items 처리
    if (!isEmpty(removedItems)) {
      const removeItemIds = removedItems.map((item) => item.id).join(",");
      await deleteQuoteItemList(removeItemIds);
    }

    if (!isEmpty(addedItems)) {
      const newItemPayload = addedItems.map((item) => ({
        equipmentId: item.equipmentId,
        quantity: item.quantity,
        price: item.price,
        discountPrice: item.discountPrice,
        totalPrice: getEquipmentTotalPrice({
          itemPrice: item.price,
          discountPrice: item.discountPrice,
          quantity: item.quantity,
        }),
        quoteId,
        setId: null,
        quoteSetId: null,
      }));
      await createQuoteItemList(newItemPayload);
    }

    if (!isEmpty(updatedItems)) {
      await Promise.all(
        updatedItems.map((item) =>
          updateQuoteItem(item.id!, {
            quantity: item.quantity,
            price: item.price,
            quoteId,
            discountPrice: item.discountPrice,
            totalPrice: getEquipmentTotalPrice({
              itemPrice: item.price,
              discountPrice: item.discountPrice,
              quantity: item.quantity,
            }),
            setId: null,
            quoteSetId: null,
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
