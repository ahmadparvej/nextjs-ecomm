import VerifyEmail from '@/components/custom/verifyEmail';
import { Suspense } from 'react'

const Verify = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmail/>
        </Suspense>
    );
};

export default Verify;
