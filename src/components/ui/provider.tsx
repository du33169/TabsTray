"use client"
import { useState, useEffect } from "react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

import {
  ChakraProvider,
  defaultSystem,
  defineConfig,
  defaultConfig,
  createSystem,
  Portal,
} from "@chakra-ui/react";

function convertTheme(ThemeColors:browser._manifest._ThemeTypeColors) {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(ThemeColors)) {
    if (value) {
      // Assuming value contains `_light` and `_dark` or is directly a color.
      // Modify this logic based on your value structure.
      const transformedValue = { _light: value, _dark: value }

      result[key]= { value: transformedValue };
    }
  }
  return result;
}

import {BRAND_PALETTE } from "./theme";
export function Provider(props: ColorModeProviderProps) {
  const [system, setSystem] =useState(createSystem(defaultConfig))

  useEffect(() => {
    async function fetchSystem() {
      const themeColors = (await browser.theme.getCurrent()).colors!;
      console.log('browsertheme colors:',themeColors);
      const config = defineConfig({
        theme: {
            semanticTokens: {//@ts-ignore
              colors: {
                brand: BRAND_PALETTE,
                ...convertTheme(themeColors)
              }
            },
          }
        });
      
      const newSystem = createSystem(defaultConfig, config);
      setSystem(newSystem);
      console.log('chakra theme config updated:',config.theme!.semanticTokens!.colors);
    }
    fetchSystem();

    browser.theme.onUpdated.addListener(fetchSystem);

    return () => {
      browser.theme.onUpdated.removeListener(fetchSystem);
    };
  }, []);
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props}/>
    </ChakraProvider>
  )
}
