'use client';
import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Props {
  folder: string;
  onUploaded: (url: string) => void;
  currentUrl?: string;
  accept?: string;
}

export function CloudinaryUpload({ folder, onUploaded, currentUrl, accept = 'image/*' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      // Get signed upload params from your API route
      const sigRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        body: JSON.stringify({ folder }),
        headers: { 'Content-Type': 'application/json' },
      });
      const { signature, timestamp, api_key, cloud_name } = await sigRes.json();

      const fd = new FormData();
      fd.append('file', file);
      fd.append('signature', signature);
      fd.append('timestamp', String(timestamp));
      fd.append('api_key', api_key);
      fd.append('folder', folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: 'POST', body: fd,
      });
      const data = await res.json();
      if (data.secure_url) {
        setPreview(data.secure_url);
        onUploaded(data.secure_url);
        toast.success('Image uploaded!');
      } else { throw new Error(data.error?.message ?? 'Upload failed'); }
    } catch (e: any) { toast.error(e.message); }
    finally { setUploading(false); }
  };

  return (
    <div className="cloudinary-upload">
      {preview ? (
        <div className="cloudinary-preview">
          <img src={preview} alt="Preview" className="cloudinary-preview-img" />
          <button type="button" onClick={() => { setPreview(null); onUploaded(''); }} className="cloudinary-remove-btn" aria-label="Remove image">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} className="cloudinary-dropzone" disabled={uploading}>
          {uploading ? <><span className="spinner-sm" /> Uploading…</> : <><Upload size={18} /><span>Click to upload</span></>}
        </button>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
    </div>
  );
}