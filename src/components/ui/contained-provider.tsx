"use client";
import { useRef, useEffect, useState } from "react";
import createCache from "@emotion/cache"
import type { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import {
  ChakraProvider,
  defaultSystem,
  defineConfig,
  defaultConfig,
  createSystem,
  Portal,
} from "@chakra-ui/react";
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "@/components/ui/color-mode";

import { themeConfig } from "./theme";
// configuration for shadow dom
function contained_system() {
  const myCssVarsRoot = "#tray-container";
  const config = defineConfig({
    cssVarsRoot: myCssVarsRoot,
    conditions: {
      light: `${myCssVarsRoot}, .light`,
    },
    preflight: { scope: myCssVarsRoot },
    globalCss: {
      [myCssVarsRoot]: defaultConfig.globalCss!.html,
    },
  });
  // delete defaultConfig.globalCss!.html;
  const system = createSystem(defaultConfig, config);
  return system;
}

export function ContainedProvider(props: ColorModeProviderProps) {
  const system = contained_system();
  const shadowContainerRef = useRef<HTMLDivElement | null>(null);
  const [cache, setCache] = useState<EmotionCache | null>(null);

  // Set the cache after shadowRef is populated
  useEffect(() => {
    //init cache
    if (shadowContainerRef.current && !cache) {
      const newCache = createCache({
        key: "chakra-css",
        container: shadowContainerRef.current,
      });
      setCache(newCache);
    }
  }, []);

  return (
    <div ref={shadowContainerRef}>
      {cache && (
        <CacheProvider value={cache}>
          <ChakraProvider value={system}>
            <ColorModeProvider {...props} />
          </ChakraProvider>
        </CacheProvider>
      )}
    </div>
  );
}
