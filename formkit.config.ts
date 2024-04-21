import { genesisIcons } from "@formkit/icons"
import { rootClasses } from "./formkit.theme"
import { DefaultConfigOptions } from '@formkit/vue'
import { afterInputDate } from "./src/utils/validations"

const config: DefaultConfigOptions = {
  icons: { ...genesisIcons },
  config: { rootClasses },
  rules: {afterInputDate},
}

export default config
