import { useState, type ChangeEvent } from 'react';
import { Upload, X, FileText, ImageIcon } from 'lucide-react';
import { uploadFile } from '../../firebase/firestore';

interface FileUploaderProps {
  label: string;
  accept: string;
  storagePath: string;
  value: string;
  onChange: (url: string) => void;
  isImage?: boolean;
}

export default function FileUploader({
  label,
  accept,
  storagePath,
  value,
  onChange,
  isImage = true,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Build a unique filename for Storage, e.g. "projects/1723238923-filename.jpg"
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const path = `${storagePath}/${Date.now()}-${cleanFileName}`;
      
      const downloadUrl = await uploadFile(path, file);
      onChange(downloadUrl);
    } catch (err) {
      console.error('File upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Check your connection.');
    } finally {
      setUploading(false);
    }
  }

  function handleClear() {
    onChange('');
    setError(null);
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-dim">{label}</label>
      
      {value ? (
        <div className="relative flex items-center gap-3 rounded-lg border border-line bg-panel2 p-3">
          {isImage ? (
            <div className="h-14 w-14 overflow-hidden rounded-md border border-line bg-void">
              <img src={value} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-md border border-line bg-void text-circuit">
              <FileText size={24} />
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-mono text-ink select-all">{value}</p>
            <p className="text-[10px] font-medium text-success">Uploaded & Active</p>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="rounded-md p-1.5 text-ink-dim hover:bg-panel3 hover:text-alert transition-colors"
            title="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line bg-panel2 py-6 transition-colors hover:bg-panel3">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-circuit border-t-transparent" />
                <span className="text-xs text-ink-dim font-medium">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-ink-dim hover:text-ink">
                {isImage ? <ImageIcon size={20} className="text-ink-muted" /> : <Upload size={20} className="text-ink-muted" />}
                <span className="text-xs font-semibold">Click to upload file</span>
                <span className="text-[10px] text-ink-muted">{accept.split(',').join(', ')}</span>
              </div>
            )}
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      )}
      
      {error && <p className="text-[10px] text-alert font-medium">{error}</p>}
    </div>
  );
}
