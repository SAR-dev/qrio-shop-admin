import { Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { useRef } from 'react';

export default function ImageEditor({
  imageToEdit,
  handleEditorModalClose,
  handleImageSave
}: {
  imageToEdit: File;
  handleEditorModalClose: () => void;
  handleImageSave: (file: File) => void;
}) {
  const cropperRef = useRef<CropperRef>(null);

  const handleSave = () => {
    const cropper = cropperRef.current;
    if (!cropper) return;

    const canvas = cropper.getCanvas();
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], File.name, {
            type: blob.type,
            lastModified: Date.now(),
          });
          handleImageSave(file);
        }
      },
      'image/png',
      1.0
    );
  };

  return (
    <div className='h-fill flex flex-col'>
      <Cropper
        ref={cropperRef}
        src={URL.createObjectURL(imageToEdit)}
        stencilProps={{
          movable: true,
          resizable: true
        }}
        imageRestriction={undefined}
        className="advanced-cropper flex-1"
        style={{
          height: 400,
          width: '100%',
          border: '1px solid #ccc'
        }}
      />
      <div className='flex justify-between mt-5'>
        <button className='btn' onClick={handleEditorModalClose}>
          Cancel
        </button>
        <button className='btn btn-info' onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
