// Helper to directly download status media (images, videos, audio, PDF documents, and text) to device storage

export async function downloadStatusMedia(
  contentUrl: string,
  fileName: string,
  mimeType?: string
): Promise<boolean> {
  try {
    // 1. Data URLs and Blob URLs
    if (contentUrl.startsWith('data:') || contentUrl.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = contentUrl;
      a.download = fileName || 'status_download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    }

    // 2. Fetch as blob to force browser to save directly to local device storage instead of opening
    try {
      const response = await fetch(contentUrl, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName || 'status_download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        return true;
      }
    } catch (fetchErr) {
      console.warn('Direct fetch download restricted, using standard anchor fallback', fetchErr);
    }

    // 3. Fallback: direct anchor with target="_blank" and download attribute
    const a = document.createElement('a');
    a.href = contentUrl;
    a.download = fileName || 'status_download';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch (error) {
    console.error('Failed to save status media to device storage:', error);
    return false;
  }
}

export function downloadTextStatus(text: string, authorName: string): boolean {
  try {
    const blob = new Blob([`WAT STATUS UPDATE\nAuthor: ${authorName}\nDate: ${new Date().toLocaleString()}\n\n${text}\n\nShared via WAT Sovereign Messenger`], {
      type: 'text/plain;charset=utf-8',
    });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `WAT_Status_${authorName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    return true;
  } catch (err) {
    console.error('Failed to save text status to device storage:', err);
    return false;
  }
}
