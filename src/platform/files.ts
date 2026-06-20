export interface SaveFileType {
  description?: string;
  accept: Record<string, string[]>;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: SaveFileType[];
}

interface OpenFilePickerOptions {
  excludeAcceptAllOption?: boolean;
  multiple?: boolean;
  types?: SaveFileType[];
}

interface FileSystemHandlePermissionDescriptor {
  mode?: "read" | "readwrite";
}

interface FileSystemWritableFileStream {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
}

export interface FileSystemFileHandle {
  name: string;
  createWritable(): Promise<FileSystemWritableFileStream>;
  getFile(): Promise<File>;
  queryPermission?(descriptor: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
  requestPermission?(descriptor: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
}

export interface PickedFile {
  file: File;
  handle: FileSystemFileHandle;
}

interface WindowWithFilePickers extends Window {
  showSaveFilePicker?: (options: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  showOpenFilePicker?: (options: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
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
): Promise<FileSystemFileHandle | null> {
  const savePicker = (window as WindowWithFilePickers).showSaveFilePicker;
  if (!savePicker) return null;
  let handle: FileSystemFileHandle;
  try {
    handle = await savePicker({
      suggestedName: filename,
      types: [fileType],
    });
  } catch (error) {
    if (error instanceof DOMException && (error.name === "SecurityError" || error.name === "NotAllowedError")) return null;
    throw error;
  }
  await saveBlobToHandle(blob, handle);
  return handle;
}

export function canPickFileWithPicker(): boolean {
  return Boolean((window as WindowWithFilePickers).showOpenFilePicker);
}

export async function pickFileWithPicker(fileType: SaveFileType): Promise<PickedFile> {
  const openPicker = (window as WindowWithFilePickers).showOpenFilePicker;
  if (!openPicker) throw new DOMException("Open file picker is not available.", "NotSupportedError");
  const [handle] = await openPicker({
    excludeAcceptAllOption: false,
    multiple: false,
    types: [fileType],
  });
  const file = await handle.getFile();
  return { file, handle };
}

export async function saveBlobToHandle(blob: Blob, handle: FileSystemFileHandle): Promise<void> {
  await ensureWritablePermission(handle);
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}

async function ensureWritablePermission(handle: FileSystemFileHandle): Promise<void> {
  const descriptor: FileSystemHandlePermissionDescriptor = { mode: "readwrite" };
  if (handle.queryPermission) {
    const currentPermission = await handle.queryPermission(descriptor);
    if (currentPermission === "granted") return;
  }
  if (!handle.requestPermission) return;
  const requestedPermission = await handle.requestPermission(descriptor);
  if (requestedPermission === "granted") return;
  throw new DOMException("Write permission was denied.", "NotAllowedError");
}
