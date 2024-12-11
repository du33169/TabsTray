"use client"
import { useState, useEffect } from "react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import {
  ChakraProvider,
  defaultSystem,
  defineConfig,
  defaultConfig,
  createSystem,
  Portal,
  EnvironmentProvider,
  type SystemConfig,
} from "@chakra-ui/react";
import root from "react-shadow"

import { get_theme_config_content } from "./theme";

const varRoot = ":host"

const shadowConfigContent: SystemConfig = {
  cssVarsRoot: varRoot,
  conditions: {
    light: `${varRoot} &, ${varRoot}(.light) &`,
    dark: `${varRoot}(.dark) &`,
  },
  preflight: { scope: varRoot },
  globalCss: {
    [varRoot]: defaultConfig.globalCss?.html ?? {},
  },
}

interface ProviderProps extends ColorModeProviderProps {
  browserApiProvider?: typeof browser | undefined,
  browserEventProvider?: typeof browser | undefined,
  enableShadow?: boolean | undefined
}
export function Provider(props: ProviderProps) {
  const { browserApiProvider, browserEventProvider, enableShadow } = props
  const browserApi = browserApiProvider || browser;
  const browserEvent = browserEventProvider || browser;
  //shadow related
  const [shadow, setShadow] = useState<HTMLElement | null>(null)
  const [cache, setCache] = useState<ReturnType<typeof createCache> | null>(null)

  enableShadow && useEffect(() => {
    if (!shadow?.shadowRoot || cache) return
    const emotionCache = createCache({
      key: "chakra-shadow-root",
      container: shadow.shadowRoot,
    })
    setCache(emotionCache)
  }, [shadow, cache])

  //theme related
  const [themeConfigContent, setThemeConfigContent] = useState({})
  const [colorScheme, setColorScheme] = useState("light")
  useEffect(() => {
    async function fetchTheme() {
      const { themeConfigContent, colorScheme } = await get_theme_config_content(browserApi);
      console.log("colorScheme", colorScheme)
      setColorScheme(colorScheme);
      setThemeConfigContent(themeConfigContent);
    }

    //@ts-ignore
    if (IS_FIREFOX) {
      fetchTheme();
      browserEvent.theme.onUpdated.addListener(fetchTheme);
      return () => {
        browserEvent.theme.onUpdated.removeListener(fetchTheme);
      };
    }
  }, []);
  const [system, setSystem] = useState(createSystem(defaultConfig))
  // system related
  useEffect(() => {
    async function fetchSystem() {
      const configContent = enableShadow ? { ...themeConfigContent, ...shadowConfigContent } : themeConfigContent;
      const config = defineConfig(configContent);
      const newSystem = createSystem(defaultConfig, config);
      setSystem(newSystem);
    }
    fetchSystem();
  }, [enableShadow, themeConfigContent,colorScheme]);
  //
  return enableShadow ? (
    <root.div ref={setShadow} className={colorScheme}>
      {shadow && cache && (
        <EnvironmentProvider value={() => shadow.shadowRoot ?? document}>
          <CacheProvider value={cache}>
            <ChakraProvider value={system}>
              <ColorModeProvider {...props} forcedTheme={colorScheme} enableColorScheme={false}/>
            </ChakraProvider>
          </CacheProvider>
        </EnvironmentProvider>
      )}
    </root.div>
  ) : (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} forcedTheme={colorScheme}  />
    </ChakraProvider>
  )
}
