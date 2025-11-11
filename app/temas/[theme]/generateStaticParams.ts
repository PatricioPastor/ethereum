import { themes } from "@/lib/theme-data"

export function generateStaticParams() {
  return themes.map((theme) => ({
    theme: theme.id,
  }))
}
