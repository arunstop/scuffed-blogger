import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import MainContainer from "../../components/main/MainContainer";
import UserContent from "../../components/user/UserContent";
import { APP_NAME } from "../../utils/helpers/Constants";

function Author() {
  const router = useRouter();
  const { author } = router.query;
  const title = author + " | " + APP_NAME;
  const content = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id iste ipsum fugiat ut, 
  deleniti, ea cupiditate officia saepe quia hic perspiciatis perferendis rem 
  explicabo obcaecati repudiandae sint mollitia! Laudantium, corporis?`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={content} />
      </Head>
      <Header />
      <MainContainer>
        <div className="relative flex h-auto w-full flex-col">
          <img
            className="absolute h-[10rem] w-full max-w-none rounded-xl bg-primary-focus object-cover sm:h-[15rem]"
            src={`https://picsum.photos/id/${50}/1000/600`}
            alt="Image"
            width={240}
            height={300}
          />
          <div className="relative mt-[6.5rem] inline-flex h-auto items-center justify-between gap-4 sm:mt-[9rem] sm:gap-8">
            <div className="avatar">
              <div
                className="z-0 w-24 rounded-[50%] border-2 border-base-100 
              transition-all hover:rounded-xl sm:w-48 sm:border-4"
              >
                <img
                  src={`https://api.lorem.space/image/face?hash=${author}`}
                  alt={`User ${author}`}
                />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 sm:gap-4">
              <FollowButton />
              <span className="text-base sm:text-lg">2.4K followers</span>
            </div>
          </div>
          <div></div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-4">
          <div className="flex flex-1 flex-col">
            <span className="text-xl font-bold sm:text-3xl">
              Dennis Kakiezier Alliertuzh
            </span>
            <span className="text-lg font-semibold opacity-50 sm:text-xl">
              @Deallezh
            </span>
          </div>
          <div>
            <p className="text-base sm:text-lg">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>

        <UserContent />
      </MainContainer>
      <Footer />
    </>
  );
}

const FollowButton = React.memo(function FollowButton() {
  const [following, setFollowing] = useState(false);

  return (
    <div
      className={`border-base-100 border-2 sm:border-4 mt-[24px] sm:mt-[44px] bg-base-100
      rounded-full
    `}
    >
      <button
        className={`
        btn sm:btn-lg text-xl sm:text-2xl font-bold 
        !border-2 sm:!border-4 !outline-none group
        transition-all w-32 sm:w-40
        ${following?'btn-outline btn-neutral':'btn-primary'}
      `}
        onClick={() => setFollowing(!following)}
      >
        <span className="block group-hover:hidden">{following ? "Following" : "Follow"}</span>
        <span className="hidden group-hover:block">{following ? "Unfollow" : "Follow"}</span>
      </button>
    </div>
  );
});

export default Author;
