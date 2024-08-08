import { FC } from 'react'
import styled from '@emotion/styled'
import { Statistic } from 'antd'

import { HeartWind } from './HeartWind'
import { TITLE, TIMEUP } from '@/config'
import { useResponsive } from 'ahooks'
import { useTime } from '@/context'

export const Countdown: FC = () => {
    const { md } = useResponsive()
    const {
        methods: { setTimeup }
    } = useTime()

    return (
        <CountdownWrapper className="w-full md:w-1/2 p-8">
            <HeartWind />
            <Statistic.Countdown
                title={TITLE}
                value={TIMEUP}
                format="D 天 H 时 m 分 s 秒 SSS ..."
                valueStyle={{ fontSize: md ? 48 : 24, color: '#eb2f96' }}
                onFinish={() => setTimeup(true)}
            />
        </CountdownWrapper>
    )
}

const CountdownWrapper = styled.div`
    .ant-statistic-title {
        font-size: 24px;
    }

    .ant-statistic-content-value {
        width: 640px;
    }
`

export default Countdown
