/**
 * Convert an image file to WebP format
 * @param file - The original image file
 * @param quality - WebP quality (0-1, default 0.8)
 * @returns Promise<Blob> - WebP format image blob
 */
export async function convertToWebP(file: File, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    const img = new Image()
    img.onload = () => {
      // Set canvas dimensions to match the image
      canvas.width = img.width
      canvas.height = img.height

      // Draw the image on canvas
      ctx.drawImage(img, 0, 0)

      // Convert to WebP
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert to WebP'))
          }
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    // Load the image
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Convert a WebP blob to a File object with proper naming
 * @param webpBlob - The WebP blob
 * @param originalFilename - Original filename for reference
 * @returns File - WebP file object
 */
export function webpBlobToFile(webpBlob: Blob, originalFilename: string): File {
  // Extract filename without extension
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '')
  const webpFilename = `${nameWithoutExt}.webp`
  
  return new File([webpBlob], webpFilename, {
    type: 'image/webp',
    lastModified: Date.now()
  })
}

/**
 * Get WebP file size estimate before conversion
 * @param file - Original file
 * @param quality - Target quality
 * @returns Promise<number> - Estimated file size in bytes
 */
export async function getWebPFileSize(file: File, quality: number = 0.8): Promise<number> {
  try {
    const webpBlob = await convertToWebP(file, quality)
    return webpBlob.size
  } catch (error) {
    console.error('Error estimating WebP file size:', error)
    return file.size // Fallback to original size
  }
}
