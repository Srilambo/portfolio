import { useState, useRef, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  label: string;
}

export default function ImagePicker({ value, onChange, label }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [urlInputActive, setUrlInputActive] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Client-side canvas compression to keep Base64 size highly optimized
  const compressAndSetImage = (fileOrBlob: File | Blob) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          onChange(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress as JPEG with 0.75 quality for an extremely lightweight payload (~20-40KB)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        onChange(compressedBase64);
      };
      img.onerror = () => {
        setErrorMessage('Failed to process image format.');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the image file.');
    };
    reader.readAsDataURL(fileOrBlob);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndSetImage(file);
      setModalOpen(false);
    }
  };

  const startCamera = async () => {
    setErrorMessage('');
    setUrlInputActive(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      setCameraActive(true);
      
      // Delay slightly to ensure video element is fully mounted and ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      setErrorMessage('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            compressAndSetImage(blob);
            stopCamera();
            setModalOpen(false);
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleUrlSubmit = () => {
    if (tempUrl.trim()) {
      onChange(tempUrl.trim());
      setModalOpen(false);
      setUrlInputActive(false);
    }
  };

  // Safe cleanup if picker is unmounted while camera is active
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{label}</label>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {/* Preview Frame */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 12,
          border: '2px solid #e5e7eb',
          background: '#f9fafb',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {value ? (
            <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '1.5rem', color: '#9ca3af' }}>🖼️</span>
          )}
        </div>

        {/* Trigger Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button 
            type="button"
            onClick={() => { setTempUrl(value.startsWith('http') ? value : ''); setModalOpen(true); }}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: '#fff',
              color: '#374151',
              fontWeight: 600,
              fontSize: '0.825rem',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {value ? 'Change Image' : 'Select Image'}
          </button>
          {value && !value.startsWith('data:') && (
            <div style={{ fontSize: '0.72rem', color: '#6b7280', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              🔗 {value}
            </div>
          )}
          {value && value.startsWith('data:') && (
            <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
              📂 Custom Uploaded Image (~{(value.length / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      {/* Modern Glassmorphic Upload Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 22, 0.45)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => { stopCamera(); setModalOpen(false); }}>
          
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '2rem',
            width: '100%',
            maxWidth: 450,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #f3f4f6'
          }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: '#111827', fontSize: '1.15rem' }}>Update Photo</h3>
              <button 
                type="button"
                onClick={() => { stopCamera(); setModalOpen(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#9ca3af' }}
              >✕</button>
            </div>

            {errorMessage && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#ef4444',
                padding: '0.75rem 1rem',
                borderRadius: 8,
                fontSize: '0.8rem',
                marginBottom: '1rem',
                fontWeight: 600
              }}>
                ⚠️ {errorMessage}
              </div>
            )}

            {!cameraActive ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* 3 Option Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  
                  {/* Gallery option */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      padding: '1.25rem 0.5rem',
                      borderRadius: 12,
                      border: '1px solid #e5e7eb',
                      background: '#f9fafb',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                  >
                    <span style={{ fontSize: '1.8rem' }}>📂</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>Gallery / File</span>
                  </button>

                  {/* Camera option */}
                  <button
                    type="button"
                    onClick={startCamera}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      padding: '1.25rem 0.5rem',
                      borderRadius: 12,
                      border: '1px solid #e5e7eb',
                      background: '#f9fafb',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.borderColor = '#10b981'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                  >
                    <span style={{ fontSize: '1.8rem' }}>📸</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>Camera</span>
                  </button>

                  {/* URL option */}
                  <button
                    type="button"
                    onClick={() => { setUrlInputActive(true); setErrorMessage(''); }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      padding: '1.25rem 0.5rem',
                      borderRadius: 12,
                      border: '1px solid #e5e7eb',
                      background: '#f9fafb',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.borderColor = '#8b5cf6'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                  >
                    <span style={{ fontSize: '1.8rem' }}>🔗</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>Web URL</span>
                  </button>

                </div>

                {/* Web URL input field drawer */}
                {urlInputActive && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #f3f4f6', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>Paste Image Web Address</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="url" 
                        placeholder="https://example.com/image.jpg" 
                        value={tempUrl} 
                        onChange={e => setTempUrl(e.target.value)} 
                        style={{
                          flex: 1,
                          padding: '0.55rem 0.8rem',
                          borderRadius: 8,
                          border: '1px solid #d1d5db',
                          fontSize: '0.85rem',
                          outline: 'none',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      />
                      <button 
                        type="button"
                        onClick={handleUrlSubmit}
                        style={{
                          padding: '0.55rem 1rem',
                          background: '#00f5ff',
                          color: '#050816',
                          border: 'none',
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Live Camera Interface */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#000',
                  position: 'relative',
                  border: '2px solid #10b981'
                }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  
                  {/* Cameraman viewfinder overlay grid */}
                  <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.15)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, borderBottom: '1px dashed rgba(255,255,255,0.15)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, borderBottom: '1px dashed rgba(255,255,255,0.15)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, borderRight: '1px dashed rgba(255,255,255,0.15)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, borderRight: '1px dashed rgba(255,255,255,0.15)', pointerEvents: 'none' }} />
                  
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(239, 68, 68, 0.8)',
                    color: '#fff',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 6,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse-ring 1s infinite' }} />
                    LIVE CAMERA
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                  <button 
                    type="button"
                    onClick={stopCamera}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      background: '#fff',
                      color: '#374151',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={capturePhoto}
                    style={{
                      flex: 2,
                      padding: '0.65rem',
                      borderRadius: 8,
                      border: 'none',
                      background: '#10b981',
                      color: '#fff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    📸 Take Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
