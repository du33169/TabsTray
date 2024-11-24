"use client";
import { useRef, useEffect, useState } from "react";
import createCache from "@emotion/cache";
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

// configuration for shadow dom
function shadow_system() {
  const myCssVarsRoot = ":host";
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
  const system = createSystem(defaultConfig, config);
  return system;
}

// shadow provider
export function ShadowProvider(props: ColorModeProviderProps) {
  const system = shadow_system();
  const hostRef = useRef<HTMLDivElement|null>(null);
  const shadowContainerRef = useRef<HTMLElement|null>(null);
  const [cache, setCache] = useState<EmotionCache|null>(null);

  // Set the cache after shadowRef is populated
  useEffect(() => {
    //init shadow container
    if (hostRef.current && !shadowContainerRef.current) {
      const shadowRoot = hostRef.current.attachShadow({ mode: "closed" });
      const container = document.createElement("div");
      shadowRoot.appendChild(container);
      shadowContainerRef.current = container;
    }
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
    <div ref={hostRef}>
      {shadowContainerRef.current && ( // the fallback is necessary
        <Portal container={shadowContainerRef}>
          {cache && ( // the fallback is necessary
            <CacheProvider value={cache}>
              <ChakraProvider value={system}>
                <ColorModeProvider {...props} />
              </ChakraProvider>
            </CacheProvider>
          )}
        </Portal>
      )}
    </div>
  );
}
