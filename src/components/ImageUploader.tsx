import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useState } from 'react'
import ImageEditor from './ImageEditor'
import { pb } from '../contexts/PocketContext'
import { Collections } from '../types/pocketbase'
import classNames from 'classnames'
import { TbAlertSquareRoundedFilled } from "react-icons/tb";
import Compressor from 'compressorjs';

function ImageUploader({
    file,
    index,
    setFile
}: {
    file: File,
    index: number,
    setFile: (file: File, index: number) => void
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [uploaded, setUploaded] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const handleEditorModalClose = () => setIsOpen(false)

    const handleImageSave = (imageFile: File) => {
        setFile(imageFile, index)
        setIsOpen(false)
    }

    const handleImageUpload = () => {
        if (uploaded) return;
        setIsLoading(true)
        new Compressor(file, {
            quality: 0.8,
            strict: true,
            checkOrientation: true,
            convertSize: 2000000,
            success(result) {
                const formData = new FormData();
                formData.append("title", file.name);
                formData.append("source", result, file.name);
                pb.collection(Collections.Images).create(formData).then(() => {
                    setUploaded(true)
                }).finally(() => {
                    setIsOpen(false)
                    setIsLoading(false)
                });
            },
            error(err) {
                console.log(err.message);
            },

        });
    }

    return (
        <div className='w-full'>
            <div className="h-32 w-full bg-base-300 relative">
                <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className={classNames('h-32 w-full object-cover', { 'cursor-pointer': !(uploaded || disabled) })}
                    onClick={() => setIsOpen(uploaded || disabled ? false : true)}
                />
                {disabled && (
                    <div className="absolute top-0 left-0 w-full h-full bg-red-500/30 text-red-800 flex justify-center items-center">
                        <TbAlertSquareRoundedFilled className='size-20' />
                    </div>
                )}
            </div>
            <div className="mt-2 w-full flex gap-2">
                <button
                    className={classNames("btn btn-xs flex-1", { "btn-success": uploaded })}
                    onClick={handleImageUpload}
                    disabled={isLoading || disabled}
                >
                    {uploaded ? "Uploaded" : "Upload"}
                </button>
                {!uploaded && (
                    <button
                        className="btn btn-xs flex-1"
                        onClick={() => setDisabled(!disabled)}
                        disabled={isLoading}
                    >
                        {disabled ? "Restore" : "Disable"}
                    </button>
                )}
            </div>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-[80rem] h-[80vh] space-y-4 bg-white p-8 relative rounded">
                        <ImageEditor
                            imageToEdit={file}
                            handleEditorModalClose={handleEditorModalClose}
                            handleImageSave={handleImageSave}
                        />
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}

export default ImageUploader