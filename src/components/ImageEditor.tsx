import Compressor from "compressorjs";
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';

export default function ImageEditor({
  imageToEdit,
  handleEditorModalClose,
  handleImageSave
}: {
  imageToEdit: File
  handleEditorModalClose: () => void
  handleImageSave: (props: File) => void
}) {
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
        handleImageSave(new File([compressedBlob], Date.now().toString(), {
          type: compressedBlob.type,
          lastModified: Date.now(),
        }))
      },
      error(err) {
        console.error("Compression error:", err);
        // setShowEditor(false);
      },
    });
  };

  return (
    <div>
      <FilerobotImageEditor
        source={URL.createObjectURL(imageToEdit)}
        onSave={(editedImageObject) => handleSave(editedImageObject)}
        onClose={handleEditorModalClose}
        annotationsCommon={{ fill: "#ff0000" }}
        Text={{ text: "Qrio" }}
        tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK, TABS.RESIZE, TABS.FILTERS, TABS.FINETUNE]}
        defaultTabId={TABS.ADJUST}
        defaultToolId={TOOLS.TEXT}
        savingPixelRatio={0}
        previewPixelRatio={3}
        useZoomPresetsMenu
      />
    </div>
  );
}
