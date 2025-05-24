import React, { useState } from "react";
import Compressor from "compressorjs";
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';

export default function ImageEditor() {
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageToEdit(url);
      setShowEditor(true);
    }
  };

  const handleSave = (editedImageObject: any) => {
    const base64 = editedImageObject.imageBase64;

    // Convert base64 to Blob
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // Compress it
    new Compressor(blob, {
      quality: 0.8,
      success(compressedBlob) {
        const compressedUrl = URL.createObjectURL(compressedBlob);
        setCompressedImageUrl(compressedUrl);
        setShowEditor(false);
      },
      error(err) {
        console.error("Compression error:", err);
        setShowEditor(false);
      },
    });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {showEditor && imageToEdit && (
        <FilerobotImageEditor
          source={imageToEdit}
          onSave={handleSave}
          onClose={() => setShowEditor(false)}
          annotationsCommon={{ fill: "#ff0000" }}
          Text={{ text: "Qrio" }}
          tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK, TABS.RESIZE, TABS.FILTERS, TABS.FINETUNE]}
          defaultTabId={TABS.ADJUST}
          defaultToolId={TOOLS.TEXT}
          savingPixelRatio={0}
          previewPixelRatio={3}
          useZoomPresetsMenu
        />
      )}

      {compressedImageUrl && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Compressed Result</h3>
          <img src={compressedImageUrl} alt="Compressed result" />
        </div>
      )}
    </div>
  );
}
