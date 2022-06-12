import React, { ReactNode } from "react";
import MainLink from "../main/MainLink";

function linkify(href: string, children: ReactNode, newTab?: boolean) {
  return (
    <MainLink href={href} newTab={newTab}>
      {children}
    </MainLink>
  );
}

interface UserAboutLink {
  href: string;
  title: string;
}

const links: UserAboutLink[] = [
  { href: `https://www.instagram.com`, title: `See my Instagram profile` },
  { href: `https://www.twitter.com`, title: `Hit me up on Twitter` },
  { href: `https://www.facebook.com`, title: `Join my Facebook community` },
  { href: `https://www.youtube.com`, title: `Subscribe my Youtube channel` },
  { href: `https://www.github.com`, title: `Collaborate with me on Github` },
  { href: `https://www.discord.com`, title: `Join the Discord server` },
];

export const UserAboutTab = ({ id }: { id: string }) => {
  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-8">
      <p className="text-lg sm:text-xl">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore,
        eveniet quis enim tenetur impedit cumque molestias, qui ducimus
        obcaecati dolores minima incidunt! Minus temporibus natus cum labore.
        Pariatur, modi similique.
        <br />
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore,
        eveniet quis enim tenetur impedit cumque molestias, qui ducimus
        obcaecati dolores minima incidunt! Minus temporibus natus cum labore.
        Pariatur, modi similique.
        <br />
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore,
        eveniet quis enim tenetur impedit cumque molestias, qui ducimus
        obcaecati dolores minima incidunt! Minus temporibus natus cum labore.
        Pariatur, modi similique.
      </p>
      <div className="flex flex-col gap-4 sm:gap-8">
          <div className="text-lg font-black sm:text-xl">Connect :</div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {links.map((e, idx) => (
              <MainLink
                key={idx}
                href={e.href}
                newTab
                className="btn btn-primary h-auto gap-2 border-none bg-opacity-10 py-2 px-4 text-base 
                text-primary-content decoration-2 hover:text-base-content hover:underline 
                sm:gap-4 sm:py-3 sm:px-6 sm:text-lg"
              >
                {e.title}
              </MainLink>
            ))}
          </div>
        </div>
      <p className="gap-2 text-base opacity-75 sm:gap-4 sm:text-lg">
        <span>Joined since January 2022</span>
        <span className="mx-2 font-black sm:mx-4">&middot;</span>
        <span>
          Member of {linkify("/community/C++ Devs", "C++ Devs")},{" "}
          {linkify(`/community/Quick`, `Quick Webdev`)},{" "}
          {linkify(`/community/Malang Photography`, `Malang Photography`)}
        </span>
        <span className="mx-2 font-black sm:mx-4">&middot;</span>
        <span>
          Top writer in {linkify(`/topic/Programming`, `Programming`)},{" "}
          {linkify(`/topic/Computer Science`, `Computer Science`)},{" "}
          {linkify(`/topic/Photography`, `Photography`)}
        </span>
      </p>
    </div>
  );
};
