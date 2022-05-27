import React, { ReactNode } from "react";
import MainLink from "../main/MainLink";

function linker(href: string, children: ReactNode, newTab?: boolean) {
  return (
    <MainLink href={href} newTab={newTab}>
      {children}
    </MainLink>
  );
}

export const UserAbout = ({ id }: { id: string }) => {
  return (
    <div className="flex flex-1 flex-col">
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
        <br />
        <br />
        <span>
          Instagram :<br />{" "}
          {linker(
            `https://www.instagram.com`,
            `https://www.instagram.com`,
            true,
          )}
        </span>
        <br />
        <span>
          Twitter :<br />{" "}
          {linker(`https://www.twitter.com`, `https://www.twitter.com`, true)}
        </span>
        <br />
        <span>
          Facebook :<br />{" "}
          {linker(`https://www.facebook.com`, `https://www.facebook.com`, true)}
        </span>
        <br />
        <span>
          Youtube :<br />{" "}
          {linker(`https://www.youtube.com`, `https://www.youtube.com`, true)}
        </span>
        <br />
        <span>
          Github :<br />{" "}
          {linker(`https://www.github.com`, `https://www.github.com`, true)}
        </span>
        <br />
      </p>
      <br />
      <p className="mt-4 gap-2 opacity-75 sm:mt-8 sm:gap-4">
        <span>Joined since January 2022</span>
        <span className="mx-2 font-black sm:mx-4">&middot;</span>
        <span>
          Member of {linker("/community/C++ Devs", "/C++ Devs")},{" "}
          {linker(`/community/Quick`, `Quick Webdev`)},{" "}
          {linker(`/community/Malang Photography`, `Malang Photography`)}
        </span>
        <span className="mx-2 font-black sm:mx-4">&middot;</span>
        <span>
          Top writer in {linker(`/community/Programming`, `Programming`)},{" "}
          {linker(`/community/Computer Science`, `Computer Science`)},{" "}
          {linker(`/community/Photography`, `Photography`)}
        </span>
      </p>
    </div>
  );
};
