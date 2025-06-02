import { create } from 'zustand'

type ImageModalStore = {
    imageSrc: string
    openImageModal: (props: string) => void
    closeImageModal: () => void
}

export const useImageModalStore = create<ImageModalStore>((set) => ({
    imageSrc: "",
    openImageModal: (value: string) => {
        set(() => ({ imageSrc: value }))
    },
    closeImageModal: () => {
        set(() => ({ imageSrc: "" }))
    }
}))