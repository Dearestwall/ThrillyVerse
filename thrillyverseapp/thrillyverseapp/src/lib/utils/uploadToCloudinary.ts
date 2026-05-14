// src/lib/utils/uploadToCloudinary.ts

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
  url: string;
}

/**
 * Upload file to Cloudinary
 * Works for images, PDFs, documents, videos
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'thrillyverse'
): Promise<CloudinaryUploadResult | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    formData.append('folder', folder);

    // Determine resource type based on file
    const resourceType = file.type.startsWith('video/') ? 'video' : 
                        file.type === 'application/pdf' ? 'raw' :
                        file.type.includes('document') ? 'raw' : 'auto';

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

/**
 * Upload image with transformation (for avatars)
 */
export const uploadImageWithTransform = async (
  file: File,
  folder: string = 'thrillyverse/avatars'
): Promise<CloudinaryUploadResult | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    formData.append('folder', folder);
    formData.append('transformation', 'c_fill,w_300,h_300,g_face'); // Crop to 300x300

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Cloudinary image upload failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return null;
  }
};

/**
 * Delete file from Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    // This requires server-side API route because it needs API secret
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

/**
 * Get optimized image URL from Cloudinary
 */
export const getOptimizedImageUrl = (
  publicId: string,
  width?: number,
  height?: number
): string => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push('c_fill', 'q_auto', 'f_auto');

  const transform = transformations.join(',');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
};