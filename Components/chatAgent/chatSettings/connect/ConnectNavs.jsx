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
        <div className="flex flex-col">
          {links.map((link, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <div className="bg-zinc-200 min-w-full min-h-[1px] my-1" />
              )}
              <Link 
                href={link.href} 
                className={`${
                  pathname.includes(link.href) 
                    ? 'bg-[#2D3377]/10 text-[#2D3377] font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                } px-6 py-2.5 my-0.5 rounded-lg transition-all duration-200 text-base`}
              >
                {link.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
    </>
  )
}

export default ConnectNavs