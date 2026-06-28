export function buildPdfFromJpeg(jpegBytes: Uint8Array, imageWidth: number, imageHeight: number): Uint8Array {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets = [0];
  let offset = 0;

  const addBytes = (bytes: Uint8Array) => {
    chunks.push(bytes);
    offset += bytes.length;
  };
  const addText = (text: string) => addBytes(encoder.encode(text));
  const beginObject = (number: number) => {
    offsets[number] = offset;
    addText(`${number} 0 obj\n`);
  };

  const pageWidth = Math.max(300, imageWidth * 0.75);
  const pageHeight = Math.max(200, imageHeight * 0.75);
  const contents = `q\n${pageWidth.toFixed(2)} 0 0 ${pageHeight.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;

  addText("%PDF-1.4\n");
  beginObject(1);
  addText("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  beginObject(2);
  addText("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
  beginObject(3);
  addText(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /ProcSet [/PDF /ImageC] /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
  beginObject(4);
  addText(`<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);
  addBytes(jpegBytes);
  addText("\nendstream\nendobj\n");
  beginObject(5);
  addText(`<< /Length ${contents.length} >>\nstream\n${contents}endstream\nendobj\n`);

  const xrefOffset = offset;
  addText("xref\n0 6\n0000000000 65535 f \n");
  for (let index = 1; index <= 5; index += 1) {
    addText(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`);
  }
  addText(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let cursor = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, cursor);
    cursor += chunk.length;
  });
  return output;
}
