import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const exportToPDF = async (elementId: string, title?: string) => {
  const element = document.getElementById(elementId); // PDF로 변환할 요소의 ID

  if (!element) {
    throw new Error("element not found");
  }

  const canvas = await html2canvas(element);

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${title || "download"}.pdf`);
};
