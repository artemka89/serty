export async function downloadFile({
  blob,
  filename,
  format,
}: {
  blob: Blob;
  filename: string;
  format: string;
}) {
  try {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.toLowerCase().replace(/\s+/g, '-')}.${format}`;

    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading ZIP:', error);
  }
}
