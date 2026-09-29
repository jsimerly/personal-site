import { Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import About from './pages/About.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Portfolio from './pages/Portfolio.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import Projects from './pages/Projects.jsx'
import Resume from './pages/Resume.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectPage />} />
        <Route path="resume" element={<Resume />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
