import { FC, MutableRefObject, useEffect, useRef } from 'react'
import { useEventListener, useMemoizedFn } from 'ahooks'

import { ERROR_MSG } from '@/config'

const vertexSource = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
    `

const fragmentSource = `
    precision highp float;

    uniform float width;
    uniform float height;
    vec2 resolution = vec2(width, height);

    uniform float time;

    #define POINT_COUNT 8

    vec2 points[POINT_COUNT];
    const float speed = -0.25;
    const float len = 0.4;
    float intensity = 1.3;
    float radius = 0.008;

    //https://www.shadertoy.com/view/MlKcDD
    //Signed distance to a quadratic bezier
    float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C){
        vec2 a = B - A;
        vec2 b = A - 2.0*B + C;
        vec2 c = a * 2.0;
        vec2 d = A - pos;

        float kk = 1.0 / dot(b,b);
        float kx = kk * dot(a,b);
        float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
        float kz = kk * dot(d,a);

        float res = 0.0;

        float p = ky - kx*kx;
        float p3 = p*p*p;
        float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
        float h = q*q + 4.0*p3;

        if(h >= 0.0){
            h = sqrt(h);
            vec2 x = (vec2(h, -h) - q) / 2.0;
            vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
            float t = uv.x + uv.y - kx;
            t = clamp( t, 0.0, 1.0 );

            // 1 root
            vec2 qos = d + (c + b*t)*t;
            res = length(qos);
        }else{
            float z = sqrt(-p);
            float v = acos( q/(p*z*2.0) ) / 3.0;
            float m = cos(v);
            float n = sin(v)*1.732050808;
            vec3 t = vec3(m + m, -n - m, n - m) * z - kx;
            t = clamp( t, 0.0, 1.0 );

            // 3 roots
            vec2 qos = d + (c + b*t.x)*t.x;
            float dis = dot(qos,qos);

            res = dis;

            qos = d + (c + b*t.y)*t.y;
            dis = dot(qos,qos);
            res = min(res,dis);

            qos = d + (c + b*t.z)*t.z;
            dis = dot(qos,qos);
            res = min(res,dis);

            res = sqrt( res );
        }

        return res;
    }


    //http://mathworld.wolfram.com/HeartCurve.html
    vec2 getHeartPosition(float t){
        return vec2(16.0 * sin(t) * sin(t) * sin(t),
                                -(13.0 * cos(t) - 5.0 * cos(2.0*t)
                                - 2.0 * cos(3.0*t) - cos(4.0*t)));
    }

    //https://www.shadertoy.com/view/3s3GDn
    float getGlow(float dist, float radius, float intensity){
        return pow(radius/dist, intensity);
    }

    float getSegment(float t, vec2 pos, float offset, float scale){
        for(int i = 0; i < POINT_COUNT; i++){
            points[i] = getHeartPosition(offset + float(i)*len + fract(speed * t) * 6.28);
        }

        vec2 c = (points[0] + points[1]) / 2.0;
        vec2 c_prev;
        float dist = 10000.0;

        for(int i = 0; i < POINT_COUNT-1; i++){
            //https://tinyurl.com/y2htbwkm
            c_prev = c;
            c = (points[i] + points[i+1]) / 2.0;
            dist = min(dist, sdBezier(pos, scale * c_prev, scale * points[i], scale * c));
        }
        return max(0.0, dist);
    }

    void main(){
        vec2 uv = gl_FragCoord.xy/resolution.xy;
        float widthHeightRatio = resolution.x/resolution.y;
        vec2 centre = vec2(0.5, 0.5);
        vec2 pos = centre - uv;
        pos.y /= widthHeightRatio;
        //Shift upwards to centre heart
        pos.y += 0.02;
        float scale = 0.000015 * height;

        float t = time;

        //Get first segment
      float dist = getSegment(t, pos, 0.0, scale);
      float glow = getGlow(dist, radius, intensity);

      vec3 col = vec3(0.0);

        //White core
      col += 10.0*vec3(smoothstep(0.003, 0.001, dist));
      //Pink glow
      col += glow * vec3(1.0,0.05,0.3);

      //Get second segment
      dist = getSegment(t, pos, 3.4, scale);
      glow = getGlow(dist, radius, intensity);

      //White core
      col += 10.0*vec3(smoothstep(0.003, 0.001, dist));
      //Blue glow
      col += glow * vec3(0.1,0.4,1.0);

        //Tone mapping
        col = 1.0 - exp(-col);

        //Gamma
        col = pow(col, vec3(0.4545));

        //Output to screen
         gl_FragColor = vec4(col,1.0);
    }
    `
//Compile shader and combine with source
function compileShader(gl: WebGLRenderingContext, shaderSource: string, shaderType: number) {
    const shader = gl.createShader(shaderType)
    if (!shader) throw new Error('Create shader failed.')

    gl.shaderSource(shader, shaderSource)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error('Shader compile failed with: ' + gl.getShaderInfoLog(shader))
    }

    return shader
}

//From https://codepen.io/jlfwong/pen/GqmroZ
//Utility to complain loudly if we fail to find the attribute/uniform
function getAttribLocation(gl: WebGLRenderingContext, program: WebGLProgram, name: 'position') {
    const attributeLocation = gl.getAttribLocation(program, name)
    if (attributeLocation === -1) {
        throw new Error('Cannot find attribute ' + name + '.')
    }

    return attributeLocation
}

const getUniformLocation = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    name: 'time' | 'width' | 'height'
) => {
    const attributeLocation = gl.getUniformLocation(program, name)
    if (attributeLocation === -1) {
        throw new Error('Cannot find uniform ' + name + '.')
    }

    return attributeLocation
}

export const HeartCanvas: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const timer = useRef<number>(0)

    const webGLProgram = useRef<WebGLProgram | null>(null)
    const time = useRef<number>(0.0)
    const lastFrame = useRef<number>(Date.now())

    const draw = useMemoizedFn(
        (gl: WebGLRenderingContext, timeHandle: WebGLUniformLocation, timer: MutableRefObject<number>) => {
            // Update time
            const thisFrame = Date.now()
            time.current += (thisFrame - lastFrame.current) / 1000
            lastFrame.current = thisFrame

            //Send uniforms to program
            gl.uniform1f(timeHandle, time.current)
            //Draw a triangle strip connecting vertices 0-4
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

            timer.current = window.requestAnimationFrame(() => draw(gl, timeHandle, timer))
        }
    )

    useEffect(() => {
        const { current: canvas } = canvasRef
        if (!canvas) throw new Error('Cannot get canvas ref')

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const gl = canvas.getContext('webgl')
        if (!gl) throw new Error('Unable to initialize WebGL.')

        //************** Create shaders **************

        //Create vertex and fragment shaders
        const vertexShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER)

        const fragmentShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER)

        //Create shader programs
        webGLProgram.current = gl.createProgram()
        if (!webGLProgram.current) return
        const program = webGLProgram.current

        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        gl.useProgram(program)

        //Set up rectangle covering entire canvas
        const vertexData = new Float32Array([
            -1.0,
            1.0, // top left
            -1.0,
            -1.0, // bottom left
            1.0,
            1.0, // top right
            1.0,
            -1.0 // bottom right
        ])

        //Create vertex buffer
        const vertexDataBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)

        // Layout of our data in the vertex buffer
        const positionHandle = getAttribLocation(gl, program, 'position')

        gl.enableVertexAttribArray(positionHandle)
        gl.vertexAttribPointer(
            positionHandle,
            2, // position is a vec2 (2 values per component)
            gl.FLOAT, // each component is a float
            false, // don't normalize values
            2 * 4, // two 4 byte float components per vertex (32 bit float is 4 bytes)
            0 // how many bytes inside the buffer to start from
        )

        //Set uniform handle
        const timeHandle = getUniformLocation(gl, program, 'time')
        if (!timeHandle) return

        const widthHandle = getUniformLocation(gl, program, 'width')
        const heightHandle = getUniformLocation(gl, program, 'height')

        gl.uniform1f(widthHandle, window.innerWidth)
        gl.uniform1f(heightHandle, window.innerHeight)

        timer.current = window.requestAnimationFrame(() => draw(gl, timeHandle, timer))

        return () => window.cancelAnimationFrame(timer.current)
    }, [draw])

    useEventListener(
        'resize',
        () => {
            const { current: canvas } = canvasRef
            if (!canvas) throw new Error('Cannot get canvas ref')

            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            const gl = canvas.getContext('webgl')
            if (!gl) throw new Error('Unable to initialize WebGL.')

            if (!webGLProgram.current) return

            const widthHandle = getUniformLocation(gl, webGLProgram.current, 'width')
            const heightHandle = getUniformLocation(gl, webGLProgram.current, 'height')

            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.uniform1f(widthHandle, window.innerWidth)
            gl.uniform1f(heightHandle, window.innerHeight)
        },
        { capture: false }
    )

    return <canvas ref={canvasRef}>{ERROR_MSG}</canvas>
}