import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react'
import { profile } from '../content/profile'

const LINKS = [
  { key: 'github', label: 'GitHub', Icon: IconBrandGithub, href: (url) => url },
  { key: 'linkedin', label: 'LinkedIn', Icon: IconBrandLinkedin, href: (url) => url },
  { key: 'email', label: 'Email', Icon: IconMail, href: (address) => `mailto:${address}` },
]

// Icon links for whichever of GitHub, LinkedIn, and email the profile has.
export default function SocialLinks({ className = '', size = 20 }) {
  const present = LINKS.filter(({ key }) => profile.links[key])
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {present.map(({ key, label, Icon, href }) => (
        <li key={key}>
          <a
            href={href(profile.links[key])}
            aria-label={label}
            className="inline-flex rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <Icon size={size} stroke={1.75} />
          </a>
        </li>
      ))}
    </ul>
  )
}
