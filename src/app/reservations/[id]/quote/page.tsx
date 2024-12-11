"use client";

import { ListButton } from "@/app/components/Button/ListButton";
import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { useParams, useRouter } from "next/navigation";
import styles from "./quotePage.module.scss";
import { Margin } from "@/app/components/Margin";
import { formatDateTimeWithLocale } from "@/app/utils/timeUtils";

import { formatLocaleString } from "@/app/utils/priceUtils";

import { useReservationDetail } from "../../hooks/useReservationDetail";
import { formatPhoneNumber } from "@/app/utils/textUtils";
import { Fragment, useCallback } from "react";
import { Button } from "@/app/components/Button";
import { showToast } from "@/app/utils/toastUtils";
import { exportToPDF } from "@/app/utils/pdfUtils";

const PDF_WRAPPER_ID = "pdf-wrapper";

const ReservationDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const reservationId = Number(params.id);
  const { detail: reservationDetail, isLoading } =
    useReservationDetail(reservationId);

  const handlePdfDownload = useCallback(async () => {
    if (isLoading || !reservationDetail) return;

    try {
      await exportToPDF(
        PDF_WRAPPER_ID,
        `${reservationDetail.userName}님_견적서`
      );
    } catch {
      showToast({
        message: "PDF 다운로드에 실패했습니다.",
        type: "error",
      });
    }
  }, [reservationDetail, isLoading]);

  if (!reservationDetail) return null;

  return (
    <div>
      <div className={styles.pdfDownloadButtonWrapper}>
        <ListButton
          title="예약서로 돌아가기"
          onClick={() => router.push(`/reservations/${reservationId}`)}
        />
        <Button
          variant="outlined"
          size="Small"
          onClick={handlePdfDownload}
          style={{
            width: "120px",
          }}
        >
          PDF 다운로드
        </Button>
      </div>

      <FormWrapper
        isLoading={isLoading}
        divProps={{
          style: {
            padding: 0,
            maxWidth: "1024px",
            width: "1024px",
          },
        }}
      >
        <Margin top={40} />
        <div
          id={PDF_WRAPPER_ID}
          style={{
            padding: 24,
          }}
        >
          <div className={styles.contractTitle}>임대차 계약서/견적서</div>

          <table className={styles.contractTable}>
            <tbody>
              <tr>
                <td colSpan={2} className={styles.contractHeader}>
                  사업자 상호
                </td>
                <td colSpan={2}>480P RENTAL</td>
                <td colSpan={2} className={styles.contractHeader}>
                  사업자 번호
                </td>
                <td colSpan={3}>794-28-01049</td>
                <td className={styles.contractHeader}>TEL</td>
                <td colSpan={3}>010-2715-0480</td>
              </tr>
              <tr>
                <td colSpan={2} className={styles.contractHeader}>
                  사업장 소재지
                </td>
                <td colSpan={11}>
                  서울 성동구 성수일로 99 서울숲 AK밸리 지식산업센터 지하1층
                  B108호
                </td>
              </tr>
              <tr>
                <td colSpan={2} className={styles.contractHeader}>
                  대표자
                </td>
                <td colSpan={3}>권석현, 유재욱</td>
                <td colSpan={2} className={styles.contractHeader}>
                  계좌번호
                </td>
                <td colSpan={6} className={styles.highlight}>
                  하나은행 / 298-910902-91107 (권석현)
                </td>
              </tr>
              <tr>
                <td colSpan={2} className={styles.contractHeader}>
                  대여시간
                </td>
                <td colSpan={4}>
                  대여 일시:{" "}
                  {formatDateTimeWithLocale(reservationDetail.startDate)}
                </td>
                <td colSpan={4}>
                  반납 예정:{" "}
                  {formatDateTimeWithLocale(reservationDetail.endDate)}
                </td>
                <td colSpan={3}>대여회차: {reservationDetail.rounds}회차</td>
              </tr>
            </tbody>
          </table>

          <table className={`${styles.contractTable} ${styles.marginTop}`}>
            <tbody>
              <tr>
                <td colSpan={2} className={styles.contractHeader}>
                  임차인 (상호)
                </td>
                <td colSpan={4}>{reservationDetail.userName} 님</td>
                <td colSpan={2} className={styles.contractHeader}>
                  부재시 연락처
                </td>
                <td colSpan={4}></td>
              </tr>
              <tr>
                <td colSpan={2} className={styles.contractHeader}>
                  연락처
                </td>
                <td colSpan={4}>
                  {formatPhoneNumber(reservationDetail.phoneNumber || "")}
                </td>
                <td colSpan={2} className={styles.contractHeader}>
                  결제 방식
                </td>
                <td colSpan={1} className={styles.checkboxCell}>
                  원금결제
                </td>
                <td colSpan={1} className={styles.checkboxCell}></td>
                <td colSpan={1} className={styles.checkboxCell}>
                  카드결제
                </td>
                <td colSpan={1} className={styles.checkboxCell}></td>
              </tr>
            </tbody>
          </table>

          <h4 className={styles.sectionTitle}>단품 장비</h4>
          <table className={`${styles.contractTable} ${styles.marginTop}`}>
            <thead>
              <tr className={styles.contractHeader}>
                <th>No.</th>
                <th colSpan={4}>품목</th>
                <th>수량</th>
                <th>회차</th>
                <th colSpan={2}>가격</th>
              </tr>
            </thead>
            <tbody>
              {reservationDetail.equipmentList.map((item, index) => {
                return (
                  <tr key={item.equipmentId}>
                    <td>{index + 1}</td>
                    <td colSpan={4}>{item.title}</td>
                    <td>{item.quantity}</td>
                    <td>{reservationDetail.rounds}</td>
                    <td colSpan={2}>₩{formatLocaleString(item.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Margin top={40} />

          <h4 className={styles.sectionTitle}>세트 장비</h4>
          <table className={styles.equipmentTable}>
            <thead>
              <tr>
                <th>No.</th>
                <th colSpan={4}>품목</th>
                <th>수량</th>
                <th>회차</th>
                <th colSpan={2}>가격</th>
              </tr>
            </thead>
            <tbody>
              {reservationDetail.setList.map((set, index) => {
                const setInfo = (
                  <tr>
                    <td>{index + 1}</td>
                    <td colSpan={4}>{set.title}</td>
                    {/* set quantity 1로 고정 */}
                    <td>1</td>
                    <td>{reservationDetail.rounds}</td>
                    <td colSpan={2}>
                      ₩{formatLocaleString(reservationDetail.totalPrice)}
                    </td>
                  </tr>
                );

                const listInfo = set.equipmentList.map((item, index) => {
                  return (
                    <tr
                      className={styles.nestedItem}
                      key={`${item.equipmentId}-${index}`}
                    >
                      <td></td>
                      <td
                        colSpan={4}
                        style={{
                          textAlign: "left",
                        }}
                      >
                        └{item.title}
                      </td>
                      <td colSpan={1}>{item.quantity}</td>
                      <td colSpan={1}></td>
                      <td colSpan={2}></td>
                    </tr>
                  );
                });

                return (
                  <Fragment key={`${set.setId}-${index}`}>
                    {setInfo}
                    {listInfo}
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          {/* 금액 내용 */}
          <Margin top={40} />
          <table className={styles.contractTable}>
            <tbody>
              <tr>
                <td className={styles.contractHeader} rowSpan={2}>
                  견적 내용
                </td>
                <td className={styles.greenBackground} colSpan={2}>
                  대여 금액 합계 (부가세 외)
                </td>
                <td className={styles.moneyCell} colSpan={3}>
                  ₩ {formatLocaleString(reservationDetail.totalPrice)}
                </td>
              </tr>
              <tr>
                <td className={styles.redBackground} colSpan={2}>
                  총 액 (부가세 10% 포함)
                </td>
                <td className={styles.moneyCell} colSpan={3}>
                  ₩ {formatLocaleString(reservationDetail.totalPrice * 1.1)}
                </td>
              </tr>
            </tbody>
          </table>

          <Margin top={40} />
          <div className={styles.agreementSection}>
            <p className={styles.agreementHeader}>계약 및 인수확인</p>
            <ul className={styles.ulWrapper}>
              <li>
                임차인은 장비의 실임을 거쳐 임대 하였으며, 제반사고 및 사용상의
                취급 부주의로 인한 장비손상에 대하여 배상의 책임을 집니다.
              </li>
              <li>
                대여기간 중 혹은 대여기간이 지난 후에도 임차인의 부주의, 실수,
                고의 등으로 인한 대여제품의 파손 및 이상이 명백할 경우 그 모든
                책임은 임차인에게 있으며, 대여 제품의 원상복구를 위해 회사는
                수리비 견적을 의뢰하며 임차인에게 청구하며 임차인은 청구한
                수리비와 수리기간에 해당하는 대여금을 회사에 지불하여야 합니다.
              </li>
              <li>
                단, 수리비 청구가 안 되는 경우에는 대체 구매비용을 임차인이
                지불하며 그 기준은 무관 불 소비자가 기준으로 합니다.
              </li>
              <li>
                임대차 계약서상의 항목은 임대인으로부터 설명하고 계약서 및 약관,
                상품정보를 이상없이 인수받았기에 아래와 같이 서명 날인합니다.
              </li>
              <li>
                주의사항:
                <ul className={styles.ulWrapper}>
                  <li>
                    장비 확인, 작동 이상유무 확인, 테스트 촬영을 하지 않았을
                    경우 본 촬영의 문제 발생에 대해 책임지지 않습니다.
                  </li>
                  <li>
                    모든 메모리 장치(SD/XQD/SSD/CF CARD 등)의 오작동 및 훼손으로
                    인한 데이터 손실은 책임지지 않습니다.
                  </li>
                  <li>
                    당초 예약하신 기간보다 며칠 늦게 반납하셔도 남은 기간에 대한
                    환불처리가 되지 않습니다.
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <Margin top={40} />
          <table className={styles.contractTable}>
            <tbody>
              <tr>
                <td className={styles.greenBackground}>계약일자:</td>
                <td colSpan={2}>
                  {formatDateTimeWithLocale(reservationDetail.createdAt)}
                </td>
                <td className={styles.greenBackground}>대여시간:</td>
                <td colSpan={2}>
                  {formatDateTimeWithLocale(reservationDetail.startDate)}
                </td>
                <td className={styles.greenBackground}>반납예정:</td>
                <td colSpan={2}>
                  {" "}
                  {formatDateTimeWithLocale(reservationDetail.endDate)}
                </td>
              </tr>
              <tr>
                <td className={styles.greenBackground}>임차인:</td>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "right",
                  }}
                >
                  (서명 또는 인)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormWrapper>
    </div>
  );
};

export default ReservationDetailPage;
