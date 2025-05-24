import { ReactNode, useEffect } from 'react';
import { usePocket } from '../contexts/PocketContext';
import { api } from '../helpers';
import { useDataStore } from '../stores/dataStore';
import { SummaryResType } from '../types/response';
import { Link, Navigate } from 'react-router';
import { IoMdExit } from "react-icons/io";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = usePocket()
    const { setSummary } = useDataStore()

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
        </section>
    )
}

export default AuthLayout