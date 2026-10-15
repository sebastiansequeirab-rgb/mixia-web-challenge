import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { es, type Dictionary } from './es'
import { en } from './en'

type Lang = 'es' | 'en'

const dictionaries: Record<Lang, Dictionary> = { es, en }

const I18nContext = createContext<{ t: Dictionary; lang: Lang; toggle: () => void }>({
  t: es,
  lang: 'es',
  toggle: () => {},
})

function initialLang(): Lang {
  const saved = localStorage.getItem('mixia-lang')
  if (saved === 'en' || saved === 'es') return saved
  return navigator.language.startsWith('en') ? 'en' : 'es'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = dictionaries[lang].meta.title
    localStorage.setItem('mixia-lang', lang)
  }, [lang])

  const value = useMemo(
    () => ({ t: dictionaries[lang], lang, toggle: () => setLang((l) => (l === 'es' ? 'en' : 'es')) }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useT() {
  return useContext(I18nContext)
}
