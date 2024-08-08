import { FC, useEffect, useRef } from 'react'

import { COLORS, ERROR_MSG, randRadius } from '@/config'

interface Curve {
    r: number
    x: number
    y: number
    vx: number
    vy: number
    g: number
    color: string
}

const loveCurve = (t: number, r: number) =>
    [
        r * (16 * Math.pow(Math.sin(t), 3)),
        -r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    ] as const

const addCurves = (x: number, y: number, curves: Curve[]) => {
    if (curves.length > 30) return
    curves.push({
        r: randRadius(),
        x,
        y,
        g: 0.1 * Math.random(),
        vx: -4 * Math.random(),
        vy: 4 * Math.random(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
    })
}

const updateCurves = (curves: Curve[]) => {
    for (let i = 0; i < curves.length; i++) {
        curves[i].x += curves[i].vx
        curves[i].y += curves[i].vy
        curves[i].vy += curves[i].g
    }
}

const render = (timer: React.MutableRefObject<number>, ctx: CanvasRenderingContext2D, curves: Curve[]) => {
    curves = curves.filter(({ x, y }) => x > 0 && x < ctx.canvas.width && y >= 0 && y < ctx.canvas.height)

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height) // 清除屏幕，重新绘制

    curves.forEach(({ r, x, y, color }) => {
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.fillStyle = color
        for (let j = 0; j <= 36; j++) {
            const [curveX, curveY] = loveCurve(2 * Math.PI * (j / 36), r)
            ctx.lineTo(curveX + x, +curveY.toFixed(2) + y)
            ctx.stroke()
        }
        ctx.fill()
        ctx.closePath()
    })

    addCurves(Math.random() * ctx.canvas.width, 0, curves)
    updateCurves(curves)

    timer.current = window.requestAnimationFrame(() => {
        render(timer, ctx, curves)
    })
}

export const HeartWind: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const timer = useRef<number>(0)

    const curves = useRef<Curve[]>([])

    useEffect(() => {
        const { current: canvas } = canvasRef
        if (!canvas) throw new Error(ERROR_MSG)

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const canvasCtx = canvas.getContext('2d')
        if (!canvasCtx) throw new Error(ERROR_MSG)

        timer.current = window.requestAnimationFrame(() => {
            render(timer, canvasCtx, curves.current)
        })

        return () => window.cancelAnimationFrame(timer.current)
    }, [])

    return (
        <canvas className="absolute top-0 left-0" ref={canvasRef}>
            {ERROR_MSG}
        </canvas>
    )
}
