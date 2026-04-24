import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { HomePage } from "@/pages/HomePage"
import { MetaPage } from "@/pages/MetaPage"
import { TopicPage } from "@/pages/TopicPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/"

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/how-this-was-built" element={<MetaPage />} />
          <Route path="/topic/:slug" element={<TopicPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
