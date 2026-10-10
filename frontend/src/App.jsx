import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import About from './pages/About.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Portfolio from './pages/Portfolio.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import Projects from './pages/Projects.jsx'
import Resume from './pages/Resume.jsx'
import ResumePrint from './pages/ResumePrint.jsx'

// The fantasy section is the heaviest part of the site, so it loads on its own
// the first time someone opens it.
const FantasyLayout = lazy(() => import('./fantasy/FantasyLayout.jsx'))
const PlayersPage = lazy(() => import('./fantasy/PlayersPage.jsx'))
const ModelPage = lazy(() => import('./fantasy/ModelPage.jsx'))

export default function App() {
  return (
    <Routes>
      {/* The resume laid out for paper, with none of the site around it: what
          the build prints to the downloadable PDF. */}
      <Route path="resume/print" element={<ResumePrint />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectPage />} />
        <Route path="resume" element={<Resume />} />
        <Route path="fantasy-analysis" element={<FantasyLayout />}>
          <Route index element={<PlayersPage />} />
          <Route path="model" element={<ModelPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
