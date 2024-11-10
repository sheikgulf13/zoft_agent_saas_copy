import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const SettingsNav = () => {
  const pathname = usePathname()

  const links = [
    {href: '/workspace/agents/chats/chatsetting/settings/general', label: 'General'},
    {href: '/workspace/agents/chats/chatsetting/settings/ai', label: 'AI'},
  ]

  return (
    <>
        <div className={`flex flex-col`}>
          {links.map((link, index) => (
            <>
              {index > 0 && <div className={`bg-zinc-200 min-w-[full] min-h-[.1vw]`}/>}
              <Link href={link.href} className={`${pathname.includes(link.href) && 'bg-zinc-300 text-black'} px-[10%] py-[.25vw] my-[.4vw]`}>{link.label}</Link>
            </>
          ))}
        </div>
    </>
  )
}

export default SettingsNav