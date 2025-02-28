import React, { useEffect, useState } from "react";
import "./MediaPreview.scss";

interface PreviewFilesProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>; // Додаємо setFiles у пропси
}

const PreviewFiles: React.FC<PreviewFilesProps> = ({ files, setFiles }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [videoThumbnails, setVideoThumbnails] = useState<{ [key: number]: string }>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentVideoKey, setCurrentVideoKey] = useState(0);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    files.forEach((file, index) => {
      if (file.type.startsWith("video/")) {
        generateVideoThumbnail(file, index);
      }
    });

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const generateVideoThumbnail = (file: File, index: number) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.currentTime = 0.5;
    video.crossOrigin = "anonymous";

    video.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setVideoThumbnails((prev) => ({ ...prev, [index]: canvas.toDataURL("image/png") }));
      }
    };
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    if (files[index].type.startsWith("video/")) {
      setCurrentVideoKey((prevKey) => prevKey + 1);
    }
  };

  const closeLightbox = () => setLightboxIndex(null);

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    closeLightbox(); // Закриваємо модальне вікно після видалення
  };

  const nextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      const nextIndex = (lightboxIndex + 1) % files.length;
      setLightboxIndex(nextIndex);
      if (files[nextIndex].type.startsWith("video/")) {
        setCurrentVideoKey((prevKey) => prevKey + 1);
      }
    }
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      const prevIndex = (lightboxIndex - 1 + files.length) % files.length;
      setLightboxIndex(prevIndex);
      if (files[prevIndex].type.startsWith("video/")) {
        setCurrentVideoKey((prevKey) => prevKey + 1);
      }
    }
  };

  return (
    <>
      <div className="preview-container">
        {previewUrls.map((url, index) => (
          <div key={index} className="preview-item" onClick={() => openLightbox(index)}>
            {files[index].type.startsWith("image/") ? (
              <img src={url} alt="Preview" className="preview-image" />
            ) : (
              <div className="video-preview-container">
                <img src={videoThumbnails[index] || "../../../public/videoLogo.jpg"}
                     className="video-preview"
                     alt="Video preview" />
                <button className="video-play-button">▶</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✖</button>
            <button className="lightbox-prev" onClick={prevMedia}>←</button>
            <button className="lightbox-next" onClick={nextMedia}>→</button>

            <button className="lightbox-delete" onClick={() => removeFile(lightboxIndex)}>🗑 Видалити</button>

            {files[lightboxIndex].type.startsWith("image/") ? (
              <img src={previewUrls[lightboxIndex]} alt="Fullscreen Preview" className="lightbox-image" />
            ) : (
              <video key={currentVideoKey} controls autoPlay className="lightbox-video" src={previewUrls[lightboxIndex]} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewFiles;
