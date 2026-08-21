import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [1, 1, 1]
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
}

const detailToSteps = detail => {
  if (detail === 'low') return 40
  if (detail === 'high') return 110
  return 70
}

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw); s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch); s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;
  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = clamp(mix(uHorizonColor, body, t) * uBrightness, 0.0, 1.0);
  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * alpha, alpha);
}
`

const GradientWaves = ({
  horizonColor = '#091521',
  waveColor = '#145982',
  crestColor = '#a6dcff',
  speed = 0.18,
  amplitude = 2.5,
  waveScale = 0.6,
  waveRatio = 0.9,
  swell = 35,
  turbulence = 20,
  tilt = 1.11,
  zoom = 1,
  height = 5.5,
  fogDepth = 15,
  detail = 'low',
  brightness = 1,
  opacity = 0.72,
  mouseInteraction = false,
  parallaxStrength = 0.2,
  className = '',
}) => {
  const containerRef = useRef(null)
  const enableMouseRef = useRef(mouseInteraction)
  const contextRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    const canvas = gl.canvas
    container.appendChild(canvas)

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: speed },
        uAmplitude: { value: amplitude },
        uWaveScale: { value: waveScale },
        uWaveRatio: { value: waveRatio },
        uSwell: { value: swell },
        uTurbulence: { value: turbulence },
        uTilt: { value: tilt },
        uZoom: { value: zoom },
        uHeight: { value: height },
        uFogDepth: { value: fogDepth },
        uSteps: { value: detailToSteps(detail) },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uParallax: { value: parallaxStrength },
        uEnableMouse: { value: mouseInteraction },
        uHorizonColor: { value: new Float32Array(hexToRgb(horizonColor)) },
        uWaveColor: { value: new Float32Array(hexToRgb(waveColor)) },
        uCrestColor: { value: new Float32Array(hexToRgb(crestColor)) },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })
    contextRef.current = { renderer, program, mesh }

    const setSize = () => {
      const rect = container.getBoundingClientRect()
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)))
      program.uniforms.iResolution.value.set([gl.drawingBufferWidth, gl.drawingBufferHeight])
    }
    const resizeObserver = new ResizeObserver(setSize)
    resizeObserver.observe(container)
    setSize()

    const currentMouse = [0.5, 0.5]
    const targetMouse = [0.5, 0.5]
    const onPointerMove = event => {
      const rect = canvas.getBoundingClientRect()
      targetMouse[0] = (event.clientX - rect.left) / rect.width
      targetMouse[1] = 1 - (event.clientY - rect.top) / rect.height
    }
    const onPointerLeave = () => targetMouse.splice(0, 2, 0.5, 0.5)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)

    let frame = 0
    let visible = true
    let pageVisible = !document.hidden
    const startedAt = performance.now()
    const loop = time => {
      program.uniforms.iTime.value = (time - startedAt) * 0.001
      const targetX = enableMouseRef.current ? targetMouse[0] : 0.5
      const targetY = enableMouseRef.current ? targetMouse[1] : 0.5
      currentMouse[0] += 0.05 * (targetX - currentMouse[0])
      currentMouse[1] += 0.05 * (targetY - currentMouse[1])
      program.uniforms.uMouse.value.set(currentMouse)
      renderer.render({ scene: mesh })
      frame = requestAnimationFrame(loop)
    }
    const start = () => {
      if (visible && pageVisible && frame === 0) frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      if (frame !== 0) cancelAnimationFrame(frame)
      frame = 0
    }
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? start() : stop()
    })
    intersectionObserver.observe(container)
    const onVisibilityChange = () => {
      pageVisible = !document.hidden
      pageVisible ? start() : stop()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    start()

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.remove()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      contextRef.current = null
    }
  }, [])

  useEffect(() => {
    const program = contextRef.current?.program
    if (!program) return
    const uniforms = program.uniforms
    enableMouseRef.current = mouseInteraction
    uniforms.uSpeed.value = speed
    uniforms.uAmplitude.value = amplitude
    uniforms.uWaveScale.value = waveScale
    uniforms.uWaveRatio.value = waveRatio
    uniforms.uSwell.value = swell
    uniforms.uTurbulence.value = turbulence
    uniforms.uTilt.value = tilt
    uniforms.uZoom.value = zoom
    uniforms.uHeight.value = height
    uniforms.uFogDepth.value = fogDepth
    uniforms.uSteps.value = detailToSteps(detail)
    uniforms.uBrightness.value = brightness
    uniforms.uOpacity.value = opacity
    uniforms.uParallax.value = parallaxStrength
    uniforms.uEnableMouse.value = mouseInteraction
    uniforms.uHorizonColor.value.set(hexToRgb(horizonColor))
    uniforms.uWaveColor.value.set(hexToRgb(waveColor))
    uniforms.uCrestColor.value.set(hexToRgb(crestColor))
  }, [amplitude, brightness, crestColor, detail, fogDepth, height, horizonColor, mouseInteraction, opacity, parallaxStrength, speed, swell, tilt, turbulence, waveColor, waveRatio, waveScale, zoom])

  return <div ref={containerRef} className={`gradient-waves-container ${className}`.trim()} aria-hidden="true" />
}

export default GradientWaves
