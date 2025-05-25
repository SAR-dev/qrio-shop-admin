import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { LuImagePlus } from "react-icons/lu";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import ImageEditor from './ImageEditor';

function ImageGallery(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false)
    const [files, setFiles] = useState<File[]>([]);

    const [imageToEdit, setImageToEdit] = useState<{file: File, index: number} | null>(null)

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': [],
        },
        onDrop: (acceptedFiles: File[]) => {
            setFiles([...files, ...acceptedFiles]);
        },
    });
    

    const handleEditorModalOpen = (i: number) => {
        setImageToEdit({file: files[i], index: i});
        setIsOpen(true)
    }

    const handleEditorModalClose = () => {
        setIsOpen(false)
        setImageToEdit(null);
    }

    const handleImageSave = (file: File) => {
        if(!imageToEdit) return;
        const temp = [...files]
        temp[imageToEdit.index] = file
        setFiles([...temp])

        setIsOpen(false)
        setImageToEdit(null)
    }

    return (
        <div className="grid grid-cols-4 gap-5">
            <div {...getRootProps({ className: 'dropzone h-32 w-full border border-base-content/30 border-dashed rounded flex justify-center items-center bg-base-200 cursor-pointer hover:bg-base-300' })}>
                <input {...getInputProps()} />
                <LuImagePlus className='size-16' />
            </div>
            {files.map((file, i) => (
                <div key={file.name} className='h-32 w-full cursor-pointer' onClick={() => handleEditorModalOpen(i)}>
                    <img src={URL.createObjectURL(file)} alt={file.name} className='h-full w-full rounded object-cover' />
                </div>
            ))}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[70%] space-y-4 bg-white p-12">
                        {imageToEdit && (
                            <ImageEditor
                                imageToEdit={imageToEdit.file}
                                handleEditorModalClose={handleEditorModalClose}
                                handleImageSave={handleImageSave}
                            />
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
}

export default ImageGallery;