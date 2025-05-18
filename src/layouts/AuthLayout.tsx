import { ReactNode } from 'react';
import { usePocket } from '../contexts/PocketContext';
import Signin from '../components/Signin';

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const { user } = usePocket()

    if (!user) {
        return (
            <section className='min-h-screen flex flex-col'>
                <Signin />
            </section>
        )
    }

    return (
        <section className='min-h-screen flex flex-col'>
            {children}
        </section>
    )
}

export default AuthLayout