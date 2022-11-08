import { FirebaseError } from "firebase/app";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useAuthCtx } from "../../../../app/contexts/auth/AuthHook";
import { useWritingPanelCtx } from "../../../../app/contexts/writingPanel/WritingPanelHook";
import { WritingPanelProvider } from "../../../../app/contexts/writingPanel/WritingPanelProvider";
import { waitFor } from "../../../../app/helpers/DelayHelpers";
import { autoRetry } from "../../../../app/helpers/MainHelpers";
import { routeHistoryAtom } from "../../../../app/hooks/RouteChangeHook";
import { serviceArticleAdd } from "../../../../app/services/ArticleService";
import { MainNetworkResponse } from "../../../../base/data/Main";
import { ArticleModel } from "../../../../base/data/models/ArticleModel";
import { UserModel } from "../../../../base/data/models/UserModel";
import Container from "../../../components/common/Container";
import MobileHeader from "../../../components/main/MobileHeader";
import LayoutArticleForm from "../LayoutArticleForm";
import { ArticleSubmissionProps } from "./LayoutArticlePageEdit";

function LayoutArticlePageWriteContent({ title }: { title: string }) {
  const router = useRouter();
  const {
    state: { formData, tab },
    action,
  } = useWritingPanelCtx();
  const { authStt, authAct, isLoggedIn } = useAuthCtx();

  function respLoading({
    submissionProps: { setResp, clearResp },
    title,
    desc,
  }: {
    submissionProps: ArticleSubmissionProps;
    title: string;
    desc: string;
  }) {
    return setResp({
      status: "loading",
      message: "Processing your request",
      data: {
        status: "loading",
        title: title,
        desc: desc,
      },
    });
  }
  function respError({
    submissionProps: { setResp, clearResp },
    resp,
    tryAgain,
  }: {
    submissionProps: ArticleSubmissionProps;
    resp: MainNetworkResponse<ArticleModel | FirebaseError | null>;
    tryAgain: () => void;
  }) {
    return setResp({
      status: resp.status,
      message: resp.message,
      data: {
        status: "error",
        title: "Oops something wrong just happened...",
        desc: `${resp.message} \n- - - -\n${
          resp.data
            ? "Not authenticated, in order to add article you need to be logged in first"
            : ""
        }`,
        actions: [
          {
            label: "Go back",
            callback: () => {
              clearResp();
            },
          },
          {
            label: "Try again",
            callback: () => {
              tryAgain();
            },
          },
        ],
      },
    });
  }

  function respSuccess({
    submissionProps: { setResp, clearResp },
    resp,
  }: {
    submissionProps: ArticleSubmissionProps;
    resp: MainNetworkResponse<ArticleModel | FirebaseError | null>;
  }) {
    return setResp({
      status: resp.status,
      message: resp.message,
      data: {
        status: "success",
        title: "Article has been submitted!",
        desc: "Congratulations! We did it!\nYour beautifully written article has been added into our database for the world to read it!",
        actions: [
          {
            label: "Write again",
            callback: () => {
              action.clearFormData();
              action.setTab("Write");
              clearResp();
            },
          },
          {
            label: "Edit article",
            callback: () => {
              router.push(`/article/edit/${(resp.data as ArticleModel).id}`);
            },
          },
          {
            label: "Read the article",
            callback: () => {
              if (!resp.data) return;
              router.push(`/article/${(resp.data as ArticleModel).slug}`);
            },
          },
          {
            label: "See my posts",
            callback: () => {
              router.push("/user/posts");
            },
          },
        ],
      },
    });
  }

  const submitArticle = useCallback(
    async (props: ArticleSubmissionProps) => {
      const { data, setResp, clearResp } = props;
      const loadingMsg =
        "Adding your beautifully written article into our database. Please wait for a moment, this will be very quick";

      respLoading({
        submissionProps: props,
        title: "Creating your well written article",
        desc: loadingMsg,
      });

      const newArticle = await autoRetry(async (attempt, max) => {
        // Auth required
        if (!authStt.user) return null;
        return await serviceArticleAdd({
          rawArticle: data,
          // correct non-null assertion becase we know that isLoggedIn already true
          user: authStt.user,
          callback: async (resp) => {
            // change loading state, if it's loading, no need to wait
            if (resp.status !== "loading") await waitFor(2000);

            // if it success, clear the formData state
            if (resp.status === "loading")
              respLoading({
                submissionProps: props,
                title: resp.message,
                desc: loadingMsg,
              });
            if (resp.status === "success")
              respSuccess({
                submissionProps: props,
                resp: resp,
              });
            if (resp.status === "error")
              respError({
                submissionProps: props,
                resp: resp,
                tryAgain: () => submitArticle(props),
              });
          },
        });
      });

      if (!newArticle) return;
      const user = authStt.user;
      if (!user) return;
      // apply new article to the local user data
      const updatedUser: UserModel = {
        ...user,
        dateUpdated: newArticle.dateAdded,
      };
      authAct.setUser(updatedUser);
    },
    [formData, isLoggedIn],
  );

  return (
    <>
      <LayoutArticleForm title={title} submitArticle={submitArticle} />
    </>
  );
}

function LayoutArticlePageWrite() {
  const router = useRouter();
  const [history] = useAtom(routeHistoryAtom);
  const title = `Write Article`;
  return (
    <>
      <MobileHeader
        back={() =>
          history.length
            ? router.replace(history[history.length - 1])
            : router.push("/")}
        title={title}
      />
      <Container>
        <WritingPanelProvider>
          <LayoutArticlePageWriteContent title={title} />
        </WritingPanelProvider>
      </Container>
    </>
  );
}

export default LayoutArticlePageWrite;
