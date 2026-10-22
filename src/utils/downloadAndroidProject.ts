/**
 * Helper to download the Native Android Studio project ZIP.
 * Uses Blob object URL to guarantee seamless download within the AI Studio iframe.
 */
export async function downloadAndroidProjectZip(): Promise<boolean> {
  try {
    // Attempt fetch from API endpoint
    let res = await fetch('/api/download/simora-android-project.zip');
    if (!res.ok) {
      // Fallback to static public path
      res = await fetch('/simora-android-project.zip');
    }
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'SIMORA-Native-Android-Compose-Project.zip';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 1000);

    return true;
  } catch (err) {
    console.warn('[SIMORA] Direct blob download failed, falling back to direct navigation:', err);
    // Absolute URL fallback
    const absoluteUrl = `${window.location.origin}/simora-android-project.zip`;
    window.location.href = absoluteUrl;
    return false;
  }
}
