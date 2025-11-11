import { generateStaticParams } from "./generateStaticParams"
import ClientThemePage from "./client"

export { generateStaticParams }

export default function ThemePage({ params }: { params: { theme: string } }) {
  return <ClientThemePage params={params} />
}
