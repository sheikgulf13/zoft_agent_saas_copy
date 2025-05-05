"use client"

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux';

const Content = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let workspaceId = searchParams.get("workspaceId");
  const { selectedChatAgent } = useSelector((state) => state.selectedData);

  const router = useRouter();

  useEffect(() => {
    if (!selectedChatAgent) {
      router.push(`/workspace/agents?workspaceId=${workspaceId}`);
    }
  }, [selectedChatAgent]);

  const links = [
    {href: '/workspace/agents/chats/chatsetting/ai', label: 'Ai'},
    {href: '/workspace/agents/chats/chatsetting/playground', label: 'Playground'},
    {href: '/workspace/agents/chats/chatsetting/activity', label: 'Activity'},
    {href: '/workspace/agents/chats/chatsetting/source', label: 'Source'},
    {href: '/workspace/agents/chats/chatsetting/connect/embeds', label: 'Connect'},
    {href: '/workspace/agents/chats/chatsetting/action', label: 'Actions'},
  ]
    
  return (
    <>
        <div className={`flex justify-center gap-[10px] mt-4`}>
          {links.map((link, index) => (
            <>
              <Link href={link.href} className={`${(pathname.includes(link.href) || (index > 2 && pathname.includes(link.href.slice(0, 44)))) && 'border-b-[.25vw] border-zinc-500'} px-[.5vw] pb-[.8vw]`}>{link.label}</Link>
            </>
          ))}
        </div>
    </>
  )
}

const ChatSettingNav = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <Content />
    </Suspense>
  )
}

export default ChatSettingNav