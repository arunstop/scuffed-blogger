import React from "react";

function ArticleContent({ id }: { id: string }) {
  return (
    <>
      <h1 className="text-3xl font-black sm:text-4xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
        itaque odit sed? Quibusdam quis nemo tempora.
      </h1>
      <h2 className="text-xl font-semibold sm:text-2xl">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
        commodi? Suscipit illum maxime, repellat inventore et distinctio porro.
      </h2>
      <div className="flex flex-col gap-2 sm:gap-4">
        <figure className="relative aspect-video w-full overflow-hidden rounded-xl">
          <img
            className="h-full w-full max-w-none object-cover transition-transform group-hover:scale-[1.2] bg-primary"
            src={`https://picsum.photos/id/${Math.floor(Math.random()*10)}/500/300`}
            alt="Image"
            width={240}
            height={240}
          />
        </figure>
        <span className="text-center text-sm opacity-70 sm:text-base">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic tempora
          alias omnis, excepturi beatae quasi aut debitis eveniet molestiae
          architecto nobis.
        </span>
      </div>
      <span className="first-letter: text-[1.125rem] sm:text-[1.25rem]">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa corporis
        dolorem quidem vel aliquam aliquid alias velit, placeat officia vitae
        veniam, qui iste id ab, a quia quis? Non, tempore.
        <br />
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa corporis
        dolorem quidem vel aliquam aliquid alias velit, placeat officia vitae
        veniam, qui iste id ab, a quia quis? Non, tempore.
        <br />
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa corporis
        dolorem quidem vel aliquam aliquid alias velit, placeat officia vitae
        veniam, qui iste id ab, a quia quis? Non, tempore.
      </span>
    </>
  );
}

export default ArticleContent;
