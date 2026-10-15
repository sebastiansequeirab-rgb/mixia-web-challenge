import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { I18nProvider } from './i18n'
import { initScroll, ScrollTrigger } from './lib/scroll'
import { Loader } from './sections/Loader'
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Stats } from './sections/Stats'
import { Products } from './sections/Products'
import { Services } from './sections/Services'
import { Clients } from './sections/Clients'
import { Quote } from './sections/Quote'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

const GL = lazy(() => import('./three/Scene'))

export default function App() {
  const container = useRef<HTMLDivElement>(null!)
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])

  useEffect(() => {
    initScroll()
    // Al terminar de cargar fuentes e imágenes, ScrollTrigger recalcula posiciones.
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <I18nProvider>
      <div ref={container} className="app">
        <Loader onDone={onDone} />
        <Nav />
        <main>
          <Hero ready={ready} />
          <Stats />
          <Products />
          <Services />
          <Clients />
          <Quote />
          <Contact />
        </main>
        <Footer />
        <div className="grain" aria-hidden="true" />
        <Suspense fallback={null}>
          <GL eventSource={container} />
        </Suspense>
      </div>
    </I18nProvider>
  )
}
