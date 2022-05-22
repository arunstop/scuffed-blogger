import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import {
  MdForum,
  MdShare,
  MdStar,
  MdThumbDown,
  MdThumbUp,
  MdTrendingUp,
} from "react-icons/md";
import Header from "../../components/Header";
import MainPostStatusChip from "../../components/main/MainPostFilterChip";
import MainUserPopup from "../../components/main/MainPostUserPopup";
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
        className="mx-auto flex min-h-screen max-w-[60rem] 
        flex-col justify-start gap-4 bg-base-100 p-4
        sm:gap-8 sm:p-8"
      >
        <div className="inline-flex justify-start rounded-xl bg-base-300 p-2 sm:p-4">
          <div className="dropdown-hover dropdown self-start">
            <MainUserLabel id={articleId + ""} />

            <div tabIndex={0} className="dropdown-content pt-2">
              <MainUserPopup id={articleId + ""} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-base sm:text-lg">
          <span className="">2d ago</span>
          <span className="font-black">&middot;</span>
          <span className="">2mins read</span>
          <span className="font-black">&middot;</span>
          <span className="">Technology</span>
        </div>

        <div className=" flex flex-wrap justify-start gap-2 overflow-hidden">
          <MainPostStatusChip
            icon={<MdStar className="text-xl sm:text-2xl" />}
            title="299 Favorited"
            color="bg-yellow-500"
          />
          <MainPostStatusChip
            icon={<MdTrendingUp className="text-xl sm:text-2xl" />}
            title="Trending"
            color="bg-red-500"
          />
          <MainPostStatusChip
            icon={<MdForum className="text-xl sm:text-2xl" />}
            title="Actively Discussing"
            color="bg-blue-500"
          />
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

        <div className="flex flex-col gap-2 sm:gap-4">
          <figure className="relative aspect-video w-full w-full overflow-hidden rounded-xl">
            <img
              className="h-full w-full max-w-none object-cover transition-transform group-hover:scale-[1.2]"
              src={`https://picsum.photos/id/${articleId + ""}/500/300`}
              alt="Image"
              width={240}
              height={240}
            />
          </figure>
          <span className="text-center text-sm opacity-70 sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
            tempora alias omnis, excepturi beatae quasi aut debitis eveniet
            molestiae architecto nobis.
          </span>
        </div>

        <span className="first-letter: text-[1.125rem] sm:text-[1.25rem]">
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
        <div className="flex flex-wrap sm:justify-end gap-4">
          <div className="inline-flex gap-4 w-full sm:w-auto">
            <button className="btn flex-1 sm:flex-none sm:w-32 btn-success btn-outline border-2" title="Like">
              <MdThumbUp className="text-2xl" />
            </button>
            <button className="btn flex-1 sm:flex-none sm:w-32 btn-error btn-outline border-2" title="Dislike">
              <MdThumbDown className="text-2xl" />
            </button>
          </div>
          <button
            className="btn btn-primary gap-2 
          font-bold normal-case text-xl w-full sm:w-72"
          >
            <MdShare className="text-2xl" />
            Share
          </button>
        </div>
      </div>
    </>
  );
}

export default Article;
