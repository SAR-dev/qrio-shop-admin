import { ReactNode, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

function Accordion({
    title,
    defaultIsOpen,
    children
}: {
    title: string
    defaultIsOpen?: boolean
    children: ReactNode
}) {
    const [show, setShow] = useState(!!defaultIsOpen)

    return (
        <div className="w-full flex flex-col">
            <div className="flex justify-between items-center p-5 bg-accent/30">
                <h3 className="text-xl font-semibold">{title}</h3>
                <button className="btn btn-square btn-accent btn-sm" onClick={() => setShow(!show)}>
                    {show ? <FaMinus className="size-4" /> : <FaPlus className="size-4" />}
                </button>
            </div>
            <div className={show ? "" : "hidden"}>
                {children}
            </div>
        </div>
    )
}

export default Accordion