import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
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
        <div className="w-full flex flex-col h-auto relative">
          <img
            className="h-[10rem] sm:h-[15rem] w-full max-w-none object-cover absolute rounded-xl bg-primary-focus"
            src={`https://picsum.photos/id/${50}/1000/600`}
            alt="Image"
            width={240}
            height={300}
          />
          <div className="inline-flex gap-4 sm:gap-8 relative mt-[6.5rem] sm:mt-[9rem] justify-between items-center h-auto">
            <div className="avatar">
              <div
                className="z-0 w-24 hover:rounded-xl border-2 border-base-100 
              transition-all rounded-[50%] sm:w-48 sm:border-4"
              >
                <img
                  src={`https://api.lorem.space/image/face?hash=${author}`}
                  alt={`User ${author}`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:gap-4 justify-end">
              <button className="btn btn-primary sm:btn-lg text-xl sm:text-2xl font-bold border-base-100 border-2 sm:border-4 mt-[24px] sm:mt-[44px]">
                Follow
              </button>
              <span className="text-base sm:text-lg">2.4K followers</span>
            </div>
          </div>
          <div></div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-4">
          <div className="flex flex-col flex-1">
            <span className="text-xl font-bold sm:text-3xl">
              Dennis Kakiezier Alliertuzh
            </span>
            <span className="text-lg font-semibold sm:text-xl opacity-50">
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

export default Author;
