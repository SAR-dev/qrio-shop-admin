import { ReactNode } from 'react';

function Accordion({
    title,
    children
}: {
    title: string
    children: ReactNode[]
}) {

    return (
        <div className="w-full flex flex-col">
            <div className="flex justify-between items-center p-5 bg-base-content/10 border-b border-base-content/30">
                <h3 className="text-xl font-semibold">{title}</h3>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}

export default Accordion