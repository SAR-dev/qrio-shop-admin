import { Dialog, DialogPanel } from "@headlessui/react";
import { ReactNode, createContext, useContext, useState } from 'react';
import { NotificationType } from '../types/notification';
import { MdClose } from "react-icons/md";
import { BsCartXFill } from "react-icons/bs";
import toast from "react-hot-toast";
import { FaCartArrowDown } from "react-icons/fa";
import { FaHeartCircleCheck, FaHeartCircleMinus } from "react-icons/fa6";

interface NotificationProps {
    title: string;
    message: string;
    body?: ReactNode;
    status: NotificationType;
}

interface CtxInterface {
    add: (props: NotificationProps) => void;
    remove: () => void;
    showAddedToCart: (props: string) => void;
    showRemovedFromCart: (props: string) => void;
    showAddedToWishlist: (props: string) => void;
    showRemovedFromWishlist: (props: string) => void;
}

const Ctx = createContext<CtxInterface>({
    add: () => { },
    remove: () => { },
    showAddedToCart: () => { },
    showRemovedFromCart: () => { },
    showAddedToWishlist: () => { },
    showRemovedFromWishlist: () => { },
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true)
    const [data, setData] = useState<NotificationProps | null>(null)

    const add = (props: NotificationProps) => {
        setData(props)
        setIsOpen(true)
    }

    const remove = () => {
        setData(null)
        setIsOpen(false)
    }

    const showAddedToCart = (title: string) => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <FaCartArrowDown className='size-10 text-success' />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                Cart Updated
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                "{title}" has been added to cart
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ))
    }

    const showRemovedFromCart = (title: string) => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <BsCartXFill className='size-10 text-error' />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                Cart Updated
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                "{title}" has been removed from cart
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ))
    }

    const showAddedToWishlist = (title: string) => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <FaHeartCircleCheck className='size-10 text-success' />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                Wishlist Updated
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                "{title}" has been added to wishlist
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ))
    }

    const showRemovedFromWishlist = (title: string) => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <FaHeartCircleMinus className='size-10 text-error' />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                Wishlist Updated
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                "{title}" has been removed from wishlist
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ))
    }

    return (
        <Ctx.Provider value={{ add, remove, showAddedToCart, showRemovedFromCart, showAddedToWishlist, showRemovedFromWishlist }}>
            {children}
            {data && (
                <Dialog className="relative z-10" open={isOpen} onClose={remove}>
                    <div className="fixed inset-0 bg-base-content/50 flex justify-center items-center">
                        <DialogPanel className="w-full transform overflow-hidden card p-5 bg-base-100 text-left align-middle shadow-xl transition-all max-w-md relative">
                            <button className="btn btn-sm btn-circle absolute top-0 right-0 m-3" onClick={remove}>
                                <MdClose className="size-4" />
                            </button>
                            <div className='flex flex-col gap-3 px-5 py-10'>
                                <div className='flex justify-center'>
                                    {data.status === NotificationType.SUCCESS && (
                                        <svg className="checkmark success h-20 w-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                            <circle className="checkmark_circle_success" cx="26" cy="26" r="25" fill="none" />
                                            <path className="checkmark_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" strokeLinecap="round" />
                                        </svg>
                                    )}
                                    {data.status === NotificationType.ERROR && (
                                        <svg className="checkmark error h-20 w-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                            <circle className="checkmark_circle_error" cx="26" cy="26" r="25" fill="none" />
                                            <path className="checkmark_check" strokeLinecap="round" fill="none" d="M16 16 36 36 M36 16 16 36" />
                                        </svg>
                                    )}
                                    {data.status === NotificationType.LOADING && (
                                        <div className="spinner h-20 w-20" />
                                    )}
                                    {data.status === NotificationType.INFO && (
                                        <div className="text-6xl">📣</div>
                                    )}
                                </div>
                                <div className='text-center text-xl font-medium'>{data.title}</div>
                                <div className='text-center'>{data.message}</div>
                                {data.body && <div>{data.body}</div>}
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}
        </Ctx.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => useContext(Ctx)