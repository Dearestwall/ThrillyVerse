type CloudinaryUploadResponse = {
  secure_url: string
  public_id: string
  width: number
  height: number
}

export async function uploadImageToCloudinary(file: File, folder = 'thrillyverse') {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  )

  if (!response.ok) {
    throw new Error('Image upload failed')
  }

  const data = (await response.json()) as CloudinaryUploadResponse

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height
  }
}