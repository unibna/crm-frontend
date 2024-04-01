import JsBarcode from "jsbarcode";

export function textToBase64Barcode(text: string, displayValue?: boolean) {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, {
    format: "CODE128",
    textAlign: "center",
    textPosition: "bottom",
    font: "Monospace",
    fontOptions: "normal",
    fontSize: 20,
    text,
    displayValue: Boolean(displayValue),
  });
  return canvas.toDataURL("image/jpeg");
}

export const COMMON_NOTE_PRINT_ORDER =
  "Khi nhận hàng cùng đồng kiểm với shipper và quay clip khi khui hàng";
