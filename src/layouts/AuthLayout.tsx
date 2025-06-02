import { ReactNode, useEffect } from 'react';
import { usePocket } from '../contexts/PocketContext';
import { api } from '../helpers';
import { useDataStore } from '../stores/dataStore';
import { SummaryResType } from '../types/response';
import { Link, Navigate } from 'react-router';
import { IoMdExit } from "react-icons/io";
import { useImageModalStore } from '../stores/imageModalStore';
import { Lightbox } from "react-modal-image";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = usePocket()
    const { setSummary } = useDataStore()
    const { imageSrc, closeImageModal } = useImageModalStore()

    useEffect(() => {
        if (!user) return;
        api.get("/api/summary").then(res => setSummary(res.data as unknown as SummaryResType))
    }, [user])


    if (!user) return <Navigate to={"/sign-in"} />

    return (
        <section className='min-h-screen flex flex-col bg-base-200'>
            <div className="navbar bg-base-100 shadow-sm px-5">
                <div className="navbar-start">
                    <Link className="text-xl" to={"/"}>QRIO</Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><a>Item 1</a></li>
                        <li><a>Item 1</a></li>
                        <li><a>Item 1</a></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <button className="btn btn-warning" onClick={logout}>
                        <IoMdExit className='size-5' />
                        Sign Out
                    </button>
                </div>
            </div>
            {children}
            <Dialog open={imageSrc.length > 0} onClose={closeImageModal} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/80" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-[80%] h-[90vh] flex justify-center items-center">
                        <img src={imageSrc} className='h-full w-full object-contain' />
                    </DialogPanel>
                </div>
            </Dialog>
        </section>
    )
}

export default AuthLayout