import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import classNames from 'classnames'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { LuImagePlus } from 'react-icons/lu';
import ImageUploader from './ImageUploader';
import { ImagesResponse } from '../types/pocketbase';

function GallerySelect({
  selectedImages,
  setSelectedImages,
  isGalleryOpen,
  setIsGalleryOpen
}: {
  selectedImages: ImagesResponse[]
  setSelectedImages: (val: ImagesResponse[]) => void
  isGalleryOpen: boolean
  setIsGalleryOpen: (props: boolean) => void
}) {
  const [tab, setTab] = useState(1)
  const [images, setImages] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles: File[]) => {
      setImages([...images, ...acceptedFiles]);
    },
  });

  const saveFile = (file: File, index: number) => {
    setImages([...images.map((e, i) => index == i ? file : e)])
  }

  

  return (
    <Dialog open={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-[80rem] h-[80vh] space-y-4 bg-white relative rounded">
          <div className="flex flex-col h-fill">
            <div className="w-full p-5 border-b border-base-content/30 flex justify-between items-center">
              <div className='font-semibold'>Image Gallery</div>
              <div className="join">
                <button className={classNames("btn btn-sm join-item", { "btn-info": tab == 1 })} onClick={() => setTab(1)}>Gallery</button>
                <button className={classNames("btn btn-sm join-item", { "btn-info": tab == 2 })} onClick={() => setTab(2)}>Uploader</button>
              </div>
            </div>

            {/* gallery */}
            <div className={classNames("flex flex-col h-fill p-5", { "hidden": tab != 1 })}>

            </div>

            {/* uploader */}
            <div className={classNames("flex flex-col h-fill p-5", { "hidden": tab != 2 })}>
              <div className="flex-1">
                <div className="grid grid-cols-6 gap-5">
                  {images.map((file, i) => (
                    <ImageUploader file={file} setFile={saveFile} index={i} key={file.name + i} />
                  ))}
                  <div {...getRootProps({ className: 'dropzone h-32 w-full border border-base-content/30 border-dashed rounded flex justify-center items-center bg-base-200 cursor-pointer hover:bg-base-300' })}>
                    <input {...getInputProps()} />
                    <LuImagePlus className='size-16' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default GallerySelect