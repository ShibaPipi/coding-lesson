import { FC, useState } from 'react'
import { useInterval, useMemoizedFn, useResponsive } from 'ahooks'
import dayjs, { Dayjs } from 'dayjs'
import styled from '@emotion/styled'
import heartIcon from '@/assets/heart-icon.png'

import { HISTORY } from '@/config'

import BOY_SRC from '@/assets/photo/boy.jpg'
import GIRL_SRC from '@/assets/photo/girl.jpg'
import { Avatar, Carousel } from 'antd'
import { ArrowDownOutlined } from '@ant-design/icons'
import { Image } from '@mantine/core'
import { HeartCanvas } from './HeartCanvas'
import { HeartWind } from './HeartWind'

const dateTogether = dayjs('2019-02-19')

export const HeartPage: FC = () => {
    const { md } = useResponsive()
    const [clicked, setClicked] = useState<boolean>(false)

    const [now, setNow] = useState<Dayjs>(dayjs())
    const [text, setText] = useState<string | undefined>(HISTORY.find(({ year }) => 2019 === year)?.text)

    const handleIconClick = useMemoizedFn(() => {
        setTimeout(() => setClicked(true), 800)
    })

    useInterval(() => setNow(dayjs()), 1000)

    return (
        <div className="relative">
            <div style={{ display: clicked ? 'block' : 'none' }}>
                <HeartCanvas />
                <HeartWind />
                <div className="absolute bottom-12 right-4 md:bottom-16 md:right-16 text-white font-bold">
                    <div className="mb-2 text-xl md:text-2xl">小宝贝儿，这是我们在一起的</div>
                    <Text>
                        {now.diff(dateTogether, 'day')}{' '}
                        <span className="m-0 md:m-1 text-xl md:text-2xl">天</span> {now.hour()}{' '}
                        <span className="m-0 md:m-1 text-xl md:text-2xl">时</span> {now.minute()}{' '}
                        <span className="m-0 md:m-1 text-xl md:text-2xl">分</span> {now.second()}{' '}
                        <span className="m-0 md:m-1 text-xl md:text-2xl">秒</span>
                    </Text>
                </div>
                <Lyy>
                    <Avatar src={GIRL_SRC} size={md ? 160 : 120} />
                </Lyy>
                <Syp>
                    <Avatar src={BOY_SRC} size={md ? 160 : 120} />
                </Syp>
                <Together>
                    <Carousel
                        autoplay
                        dotPosition="left"
                        beforeChange={(_, to) =>
                            setText(HISTORY.find(({ year }) => 2019 + to === year)?.text)
                        }
                    >
                        {HISTORY.map(({ year, src }) => (
                            <div key={year}>
                                <Image src={src} width={160} />
                            </div>
                        ))}
                    </Carousel>
                    <div className="mt-4 text-xs text-white font-bold">
                        {text?.split('|').map(phrase => <div key={phrase}>{phrase}</div>)}
                    </div>
                </Together>
            </div>
            <div className={clicked ? 'hidden' : 'block text-right'}>
                <div className="flex items-center mx-4 text-3xl text-rose-500 animate-bounce">
                    <span className="mr-2">点击进入</span>
                    <ArrowDownOutlined />
                    <ArrowDownOutlined />
                    <ArrowDownOutlined />
                </div>
                <div className="flex justify-end">
                    <ClickIcon
                        className="mt-4 mr-10 cursor-pointer"
                        src={heartIcon}
                        onClick={handleIconClick}
                    />
                </div>
            </div>
        </div>
    )
}

const ClickIcon = styled(Image)`
    width: 2.5rem !important;
    height: 2.5rem;
`

const Together = styled.div`
    position: absolute;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);

    @media (max-width: 768px) {
        top: 20%;
    }

    animation: show 4.8s linear;
    @keyframes show {
        0%,
        25% {
            display: none;
            opacity: 0;
        }
        50% {
            display: block;
            opacity: 1;
        }
        100% {
            left: 40%;
        }
    }
`

const Syp = styled.div`
    position: absolute;
    right: 15%;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    animation: move-left 2s linear;

    @keyframes move-left {
        0% {
            right: 15%;
        }
        50% {
            opacity: 1;
        }
        100% {
            right: 41.5%;
            opacity: 0;
        }
    }
`

const Lyy = styled.div`
    position: absolute;
    left: 15%;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    animation: move-right 2s linear;

    @keyframes move-right {
        0% {
            left: 15%;
        }
        50% {
            opacity: 1;
        }
        100% {
            left: 41.5%;
            opacity: 0;
        }
    }
`

const Text = styled.div`
    font-size: 36px;
    animation: shine 2.4s infinite;

    @keyframes shine {
        0%,
        100% {
            color: #fff;
            text-shadow:
                0 0 10px #fff,
                0 0 10px #fff;
        }
        50% {
            text-shadow:
                0 0 10px #fff,
                0 0 40px #fff;
        }
    }
`

export default HeartPage
