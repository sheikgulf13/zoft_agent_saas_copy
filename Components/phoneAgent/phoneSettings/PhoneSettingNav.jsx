import useTheme from "next-theme";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { OutlinedButton } from "../../buttons/OutlinedButton";
import { useSelector } from "react-redux";

const Content = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  let workspaceId = searchParams.get("workspaceId");
  const { selectedPhoneAgent } = useSelector((state) => state.selectedData);

  const links = [
    {
      href: `/workspace/agents/phone/phonesetting/configure?workspaceId=${workspaceId}`,
      label: "Configure",
    },
    {
      href: `/workspace/agents/phone/phonesetting/playground?workspaceId=${workspaceId}`,
      label: "Playground",
    },
    {
      href: `/workspace/agents/phone/phonesetting/callhistory?workspaceId=${workspaceId}`,
      label: "Call History",
    },
    {
      href: `/workspace/agents/phone/phonesetting/source?workspaceId=${workspaceId}`,
      label: "Source",
    },
    //{
      //href: `/workspace/agents/phone/phonesetting/connect?workspaceId=${workspaceId}`,
      //label: "Connect",
    //},
    {
      href: `/workspace/agents/phone/phonesetting/action?workspaceId=${workspaceId}`,
      label: "Actions",
    },
  ];

  useEffect(() => {
    if (!selectedPhoneAgent) {
      router.push(`/workspace/agents?workspaceId=${workspaceId}`);
    }
  }, [selectedPhoneAgent]);

  return (
    <>
      <div className={`gap-[1vw] w-full justify-center relative`}>
   
        <div className="flex mt-1 items-center justify-center">
        <OutlinedButton
            onClick={() =>
              router.push(`/workspace/agents?workspaceId=${workspaceId}`)
            }
            borderColor={
              "text-[#8b8b8b]  hover:text-[#333333] bg-gray-200 rounded-[.6vw] hover:bg-gray-200 cursor-pointer absolute left-5 bottom-2"
            }
          >
            <FaArrowLeftLong className="text-sm" />
            {/*
            <span className="text-sm">Back to workspace</span>*/}
          </OutlinedButton>

          {links.map((link, index) => (
            <>
              <Link
                href={link.href}
                className={`${
                  (pathname.includes(link.href) ||
                    pathname.includes(link.href.split("?")[0])) &&
                  "border-b-[.25vw] border-[#2D3377]/90"
                } px-[.5vw] pb-[.8vw] rounded-sm`}
              >
                {link.label}
              </Link>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

const PhoneSettingNav = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <Content />
    </Suspense>
  );
};

export default PhoneSettingNav;
