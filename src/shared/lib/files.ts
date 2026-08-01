import {
  cacheDirectory,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export async function shareTextFile(
  filename: string,
  contents: string,
  mimeType: string,
): Promise<void> {
  if (!cacheDirectory) {
    throw new Error('Cache directory is unavailable.');
  }
  const uri = `${cacheDirectory}${filename}`;
  await writeAsStringAsync(uri, contents);
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device.');
  }
  const uti =
    mimeType === 'application/json'
      ? 'public.json'
      : mimeType === 'text/plain'
        ? 'public.plain-text'
        : 'public.comma-separated-values-text';
  await Sharing.shareAsync(uri, {
    mimeType,
    dialogTitle: filename,
    UTI: uti,
  });
}

export async function readPickedText(uri: string): Promise<string> {
  return readAsStringAsync(uri);
}
