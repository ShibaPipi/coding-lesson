import { ReactNode, useState } from 'react'
import dayjs from 'dayjs'
import { BrowserRouter as Router } from 'react-router-dom'
import { ColorSchemeProvider, MantineProvider } from '@mantine/core'

import { TIMEUP } from '@/config'
import { TimeContext } from '@/context'

import type { ColorScheme } from '@mantine/core'

export const AppProviders = ({ children }: { children: ReactNode }) => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

    const [timeup, setTimeup] = useState(dayjs().isAfter(TIMEUP))

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider
                theme={{
                    breakpoints: {
                        xs: '30em',
                        sm: '48em',
                        md: '64em',
                        lg: '74em',
                        xl: '90em'
                    },
                    colorScheme
                }}
                withGlobalStyles
                withNormalizeCSS
            >
                <TimeContext.Provider value={{ timeup, methods: { setTimeup } }}>
                    <Router>{children}</Router>
                </TimeContext.Provider>
            </MantineProvider>
        </ColorSchemeProvider>
    )
}
