import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const ConnectNavs = () => {
  const pathname = usePathname()

  const links = [
    {href: '/workspace/agents/chats/chatsetting/connect/embeds', label: 'Embeds'},
    {href: '/workspace/agents/chats/chatsetting/connect/integrations', label: 'Integrations'},
  ]
  return (
    <>
        <div className={`flex flex-col`}>
          {links.map((link, index) => (
            <>
              {index > 0 && <div className={`bg-zinc-200 min-w-full min-h-[.1vw]`}/>}
              <Link href={link.href} className={`${pathname.includes(link.href) && 'bg-zinc-300 text-black'} px-[.5vw] py-[.25vw] my-[.4vw] text-lg`}>{link.label}</Link>
            </>
          ))}
        </div>
    </>
  )
}

export default ConnectNavs