import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Header from "../../components/Header";
import MainUserLabel from "../../components/main/MainUserLabel";
import { APP_NAME } from "../../utils/helpers/Constants1";

function Article() {
  const router = useRouter();
  const { articleId } = router.query;
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Scuffed blogs, for scuffed people" />
      </Head>
      <Header />
      <div
        className="min-h-screen bg-base-100 p-4 sm:p-8 
        justify-start gap-4 sm:gap-8 flex flex-col
        max-w-[60rem] mx-auto"
      >
        <div className="inline-flex justify-start bg-base-300 p-2 sm:p-4 rounded-xl">
        <MainUserLabel id={articleId + ""} />
        </div>

        <h1 className="text-4xl font-black sm:text-5xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
          itaque odit sed? Quibusdam quis nemo tempora.
        </h1>

        <h3 className="text-2xl font-semibold sm:text-3xl">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
          commodi? Suscipit illum maxime, repellat inventore et distinctio
          porro.
        </h3>

        <div className="gap-2 sm:gap-4 flex flex-col">
          <figure className="aspect-video rounded-xl w-full overflow-hidden w-full relative">
            <img
              className="h-full w-full max-w-none object-cover transition-transform group-hover:scale-[1.2]"
              src={`https://picsum.photos/id/${articleId + ""}/500/300`}
              alt="Image"
              width={240}
              height={240}
            />
          </figure>
          <span className="text-center text-sm sm:text-base opacity-70">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
            tempora alias omnis, excepturi beatae quasi aut debitis eveniet
            molestiae architecto nobis.
          </span>
        </div>

        <span className="text-[1.125rem] sm:text-[1.25rem] first-letter:">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa
          corporis dolorem quidem vel aliquam aliquid alias velit, placeat
          officia vitae veniam, qui iste id ab, a quia quis? Non, tempore.
          <br />
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa
          corporis dolorem quidem vel aliquam aliquid alias velit, placeat
          officia vitae veniam, qui iste id ab, a quia quis? Non, tempore.
          <br />
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa
          corporis dolorem quidem vel aliquam aliquid alias velit, placeat
          officia vitae veniam, qui iste id ab, a quia quis? Non, tempore.
        </span>
      </div>
    </>
  );
}

export default Article;
