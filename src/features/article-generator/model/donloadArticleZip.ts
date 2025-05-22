export async function donloadArticleZip({
  data,
  filename,
  imageUrl,
}: {
  data: string[];
  filename: string;
  imageUrl?: string;
}) {
  try {
    const response = await fetch('/api/download-zip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: filename,
        content: data,
        imageUrl: imageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create ZIP file');
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.toLowerCase().replace(/\s+/g, '-')}.zip`;

    document.body.appendChild(a);

    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading ZIP:', error);
  }
}
