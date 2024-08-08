import { FC, lazy } from 'react'
import { useTitle } from 'ahooks'

import { useTime } from '@/context'
import HeartPage from '../components/HeartPage'

const Countdown = lazy(() => import('../components/Countdown'))

export const CountdownPage: FC = () => {
    const { timeup } = useTime()
    useTitle('520 🥰🥰🥰', { restoreOnUnmount: true })

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            {timeup ? <HeartPage /> : <Countdown />}
        </div>
    )
}
