export interface SaveFileType {
  description?: string;
  accept: Record<string, string[]>;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: SaveFileType[];
}

interface FileSystemWritableFileStream {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface WindowWithSavePicker extends Window {
  showSaveFilePicker?: (options: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function saveBlobWithPicker(
  blob: Blob,
  filename: string,
  fileType: SaveFileType,
): Promise<boolean> {
  const savePicker = (window as WindowWithSavePicker).showSaveFilePicker;
  if (!savePicker) return false;
  let handle: FileSystemFileHandle;
  try {
    handle = await savePicker({
      suggestedName: filename,
      types: [fileType],
    });
  } catch (error) {
    if (error instanceof DOMException && (error.name === "SecurityError" || error.name === "NotAllowedError")) return false;
    throw error;
  }
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
  return true;
}
