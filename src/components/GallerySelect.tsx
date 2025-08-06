import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { LuImagePlus } from "react-icons/lu";
import ImageUploader from "./ImageUploader";
import { Collections, ImagesResponse } from "../types/pocketbase";
import { pb } from "../contexts/PocketContext";
import { ListResult } from "pocketbase";
import { getImageUrl } from "../helpers";
import { useImageModalStore } from "../stores/imageModalStore";
import { FaRegCheckCircle, FaTrash } from "react-icons/fa";
import { TbZoomScan } from "react-icons/tb";
import { MdOutlineArrowBack } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";

const pageSize = 18;

function GallerySelect({
  selectedImages,
  setSelectedImages,
  isGalleryOpen,
  setIsGalleryOpen,
}: {
  selectedImages: ImagesResponse[];
  setSelectedImages: (val: ImagesResponse[]) => void;
  isGalleryOpen: boolean;
  setIsGalleryOpen: (props: boolean) => void;
}) {
  const { openImageModal } = useImageModalStore();
  const [tab, setTab] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [imageListData, setImageListData] =
    useState<ListResult<ImagesResponse>>();
  const [pageNo, setPageNo] = useState(1);
  const [refetch, setRefetch] = useState(1);

  const refetchImages = () => setRefetch(refetch + 1);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles: File[]) => {
      setImages([...images, ...acceptedFiles]);
    },
  });

  const saveFile = (file: File, index: number) => {
    setImages([...images.map((e, i) => (index == i ? file : e))]);
  };

  useEffect(() => {
    pb.collection(Collections.Images)
      .getList(pageNo, pageSize, {
        sort: "-created",
      })
      .then((res) => setImageListData(res));
  }, [pageNo, refetch]);

  const handleSelectImage = (img: ImagesResponse) => {
    const exists = selectedImages.findIndex((c) => c.id == img.id) != -1;
    if (exists) {
      setSelectedImages([...selectedImages.filter((c) => c.id != img.id)]);
    } else {
      setSelectedImages([...selectedImages, img]);
    }
  };

  return (
    <Dialog open={isGalleryOpen} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-[80rem] h-[80vh] space-y-4 bg-white relative rounded">
          <div className="flex flex-col h-fill">
            <div className="w-full p-5 border-b border-base-content/30 flex justify-between items-center">
              <div className="flex gap-3">
                <MdOutlineArrowBack
                  className="size-6 cursor-pointer"
                  onClick={() => setIsGalleryOpen(false)}
                />
                <div className="font-semibold">Image Gallery</div>
              </div>
              <div className="join">
                <button
                  className={classNames("btn btn-sm join-item", {
                    "btn-info": tab == 1,
                  })}
                  onClick={() => setTab(1)}
                >
                  Gallery
                </button>
                <button
                  className={classNames("btn btn-sm join-item", {
                    "btn-info": tab == 2,
                  })}
                  onClick={() => setTab(2)}
                >
                  Uploader
                </button>
              </div>
            </div>

            {/* gallery */}
            <div
              className={classNames(
                "flex flex-col h-fill p-5 overflow-y-auto",
                { hidden: tab != 1 }
              )}
            >
              <div className="flex-1">
                <div className="grid grid-cols-6 gap-5">
                  {imageListData?.items.map((el, i) => (
                    <div
                      className="ring-2 ring-offset-2 ring-base-300 h-32 w-full rounded bg-base-200 relative group overflow-hidden"
                      key={i}
                    >
                      <img
                        src={getImageUrl({
                          id: el.id,
                          filename: el.source,
                          wxh: "0x500",
                        })}
                        className="h-full w-full rounded object-cover"
                      />
                      <div className="absolute w-full h-full bg-yellow-500/50 top-0 left-0 grid grid-cols-2 translate-y-40 group-hover:translate-y-0 transition delay-150 duration-150 ease-in-out">
                        <div
                          className="flex justify-center items-center cursor-pointer hover:bg-yellow-500"
                          onClick={() =>
                            openImageModal(
                              getImageUrl({
                                id: el.id,
                                filename: el.source,
                                wxh: "0x1500",
                              })
                            )
                          }
                        >
                          <TbZoomScan className="size-10" />
                        </div>
                        <div
                          className="flex justify-center items-center cursor-pointer hover:bg-yellow-500"
                          onClick={() => handleSelectImage(el)}
                        >
                          {selectedImages.map((c) => c.id).includes(el.id) ? (
                            <FaCircleCheck className="size-10" />
                          ) : (
                            <FaRegCheckCircle className="size-10" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-3 h-10">
                  {selectedImages.map((el, i) => (
                    <div className="h-10 w-10 relative group" key={i}>
                      <img
                        src={getImageUrl({
                          id: el.id,
                          filename: el.source,
                          wxh: "0x100",
                        })}
                        className="h-10 w-10 object-cover rounded ring ring-offset-2 ring-base-300"
                      />
                      <button
                        className="absolute top-0 right-0 bg-red-600 text-red-100 p-1 rounded -m-1 hidden group-hover:block cursor-pointer"
                        onClick={() => handleSelectImage(el)}
                      >
                        <FaTrash className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-5">
                  <div className="join">
                    <button
                      className="join-item btn"
                      disabled={pageNo == 1}
                      onClick={() => setPageNo(pageNo - 1)}
                    >
                      «
                    </button>
                    <button className="join-item btn">Page {pageNo}</button>
                    <button
                      className="join-item btn"
                      disabled={pageNo == imageListData?.totalPages}
                      onClick={() => setPageNo(pageNo + 1)}
                    >
                      »
                    </button>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsGalleryOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* uploader */}
            <div
              className={classNames("flex flex-col h-fill p-5", {
                hidden: tab != 2,
              })}
            >
              <div className="flex-1">
                <div className="grid grid-cols-6 gap-5">
                  {images.map((file, i) => (
                    <ImageUploader
                      file={file}
                      setFile={saveFile}
                      refetchImages={refetchImages}
                      index={i}
                      key={file.name + i}
                    />
                  ))}
                  <div
                    {...getRootProps({
                      className:
                        "dropzone h-32 w-full border border-base-content/30 border-dashed rounded flex justify-center items-center bg-base-200 cursor-pointer hover:bg-base-300",
                    })}
                  >
                    <input {...getInputProps()} />
                    <LuImagePlus className="size-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default GallerySelect;
