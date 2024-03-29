import { FirebaseError } from "firebase/app";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useWritingPanelCtx } from "../../../../app/contexts/writingPanel/WritingPanelHook";
import { WritingPanelProvider } from "../../../../app/contexts/writingPanel/WritingPanelProvider";
import { waitFor } from "../../../../app/helpers/DelayHelpers";
import { autoRetry } from "../../../../app/helpers/MainHelpers";
import { routeHistoryAtom } from "../../../../app/hooks/RouteChangeHook";
import {
  serviceArticleContentGet,
  serviceArticleUpdate,
} from "../../../../app/services/ArticleService";
import { WritingPanelFormProps } from "../../../../base/data/contexts/WritingPanelTypes";
import { MainNetworkResponse, netLoading } from "../../../../base/data/Main";
import { ArticleModel } from "../../../../base/data/models/ArticleModel";
import Container from "../../../components/common/Container";
import MobileHeader from "../../../components/main/MobileHeader";
import { StatusPlaceholderProps } from "../../../components/placeholder/StatusPlaceholder";
import { smartBack } from "../../../helpers/RouterSmartBackHelpers";
import LayoutArticleForm from "../LayoutArticleForm";

export interface ArticleSubmissionProps {
  data: WritingPanelFormProps;
  userPostsRef: string;
  setResp: (value: MainNetworkResponse<StatusPlaceholderProps | null>) => void;
  clearResp: () => void;
}

// a custom wrapper component so LayoutArticlePageEdit can use the provider
function LayoutArticlePageEditContent({
  articleContentless,
}: {
  articleContentless: ArticleModel;
}) {
  const { state: wpState, action: wpAction } = useWritingPanelCtx();
  const router = useRouter();
  const [history] = useAtom(routeHistoryAtom);

  const [oldArticleUpdated, setOldArticleUpdated] =
    useState(articleContentless);

  const submitArticle = useCallback(
    async ({
      data,
      userPostsRef,
      setResp,
      clearResp,
    }: ArticleSubmissionProps) => {
      console.log(oldArticleUpdated.dateUpdated);
      setResp(
        netLoading<StatusPlaceholderProps>("", {
          status: "loading",
          title: "Updating the article",
          desc: `Hold your horses! We are updating your once well-written article, with even better well-written 
          you just wrote. We'll be very quick!`,
          actions: [
            {
              label: "Cancel",
              callback: () => {
                clearResp();
              },
            },
          ],
        }),
      );
      
      const updateArticle = await autoRetry(
        async () =>
          await serviceArticleUpdate({
            data: {
              oldArticle: oldArticleUpdated,
              rawArticle: data,
              userPostsRef: userPostsRef,
            },
            callback: async (resp) => {
              await waitFor(2000);
              if (resp.status === "error") {
                setResp(
                  netLoading<StatusPlaceholderProps>("", {
                    status: resp.status,
                    title: resp.message,
                    desc: (resp.data as FirebaseError).message,
                    actions: [
                      {
                        label: "Cancel",
                        callback: () => {
                          clearResp();
                        },
                      },
                    ],
                  }),
                );
                return;
              }
              if (resp.status === "success") {
                setResp(
                  netLoading<StatusPlaceholderProps>("", {
                    status: resp.status,
                    title: resp.message,
                    desc: "Congratulations! Your article is updated! It will be even better right? Or is it?",
                    actions: [
                      {
                        label: "Edit again",
                        callback: () => {
                          // update the current `oldArticle`
                          setOldArticleUpdated(resp.data as ArticleModel);
                          clearResp();
                        },
                      },
                      {
                        label: "Go to My Posts",
                        callback: () => {
                          router.push(`/user/posts/`);
                        },
                      },
                      {
                        label: "Go to the article",
                        callback: () => {
                          router.push(`/article/${articleContentless.slug}/`);
                        },
                      },
                    ],
                  }),
                );
                return;
              }
            },
          }),
      );
    },
    [oldArticleUpdated],
  );
  async function getContent() {
    if (!wpState.formData) return;
    const content = await autoRetry(
      async () =>
        await serviceArticleContentGet({ data: { id: articleContentless.id } }),
    );
    const contentDecoded = decodeURIComponent(content || "");
    // set the content on the writingPanelCtx
    wpAction.setFormData({
      ...wpState.formData,
      content: contentDecoded,
    });
    // set the content on oldArticle
    setOldArticleUpdated({ ...articleContentless, content: contentDecoded });
  }

  useEffect(() => {
    getContent();
  }, []);

  return (
    <>
      <MobileHeader
        back={() => smartBack(router, history)}
        title={`Edit Article`}
      />
      <Container className="">
        <LayoutArticleForm title="Edit Article" submitArticle={submitArticle} />
      </Container>
    </>
  );
}

export default function LayoutArticlePageEdit({
  articleContentless,
}: {
  // contentless oldArticle
  articleContentless: ArticleModel;
}) {
  return (
    <WritingPanelProvider
      initFormData={{
        desc: articleContentless.desc,
        content: articleContentless.content,
        tags: articleContentless.tags.join(","),
        title: articleContentless.title,
        topics: articleContentless.topics?.join(",") || "",
        defaultThumbnailPreview: articleContentless.thumbnail,
      }}
    >
      <LayoutArticlePageEditContent articleContentless={articleContentless} />
    </WritingPanelProvider>
  );
}
