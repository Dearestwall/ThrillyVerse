import { ImagePlus, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { uploadImageToCloudinary } from '../../lib/cloudinary'

type Props = {
  label: string
  value?: string
  folder?: string
  onChange: (url: string) => void
}

export function ImageUploadField({
  label,
  value,
  folder = 'thrillyverse',
  onChange
}: Props) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const result = await uploadImageToCloudinary(file, folder)
      onChange(result.url)
      toast.success('Image uploaded')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="image-upload-field">
      <span>{label}</span>

      {value && (
        <div className="image-preview card">
          <img src={value} alt={label} />
        </div>
      )}

      <label className="button button-ghost image-upload-button">
        {uploading ? <LoaderCircle size={16} className="spin" /> : <ImagePlus size={16} />}
        <span>{uploading ? 'Uploading...' : 'Upload image'}</span>
        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
      </label>
    </div>
  )
}