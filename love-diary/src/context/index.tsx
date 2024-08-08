import { createContext, useContext } from 'react'

interface TimeContextValue {
    timeup: boolean
    methods: {
        setTimeup: (timeup: boolean) => void
    }
}

export const TimeContext = createContext<TimeContextValue | undefined>(undefined)

export const useTime = () => {
    const timeContext = useContext(TimeContext)

    if (!timeContext) {
        throw new Error('the hook useTime must be used in TimeProvider.')
    }

    return timeContext
}
