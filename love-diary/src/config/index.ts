import img2022 from '@/assets/photo/2022.jpg'
import img2021 from '@/assets/photo/2021.jpg'
import img2020 from '@/assets/photo/2020.jpg'
import img2019 from '@/assets/photo/2019.jpg'

export const TITLE = '距离 2024 年七夕还有'

export const TIMEUP = '2024/08/10 13:14:00'

export const ERROR_MSG =
    'Canvas is not currently supported by the browser, please change the browser and try again.'

export const COLORS = [
    '#f5222d',
    '#f5222d',
    '#fa541c',
    '#fa8c16',
    '#faad14',
    '#fadb14',
    '#a0d911',
    '#52c41a',
    '#13c2c2',
    '#1890ff',
    '#2f54eb',
    '#722ed1',
    '#eb2f96'
]

export const randRadius = () => 0.5 * (Math.random() + 0.5)

export const HISTORY: Array<{ year: number; text: string; src: string }> = [
    {
        year: 2019,
        text: '恋爱第一季，|完美因为你，|我变成了积极向上的人。',
        src: img2019
    },
    { year: 2020, text: '我永远屈服于温柔，|而你原是温柔本身。', src: img2020 },
    { year: 2021, text: '领证啦~~~', src: img2021 },
    {
        year: 2022,
        text: '我的一颗眼泪掉进了海洋，|当我找到它的那一天，|就是我停止爱你的那一天。',
        src: img2022
    }
]
