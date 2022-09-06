import { FirebaseError } from "firebase/app";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { StatusPlaceholderProps } from "../../components/placeholder/StatusPlaceholder";
import { useWritingPanelCtx } from "../../utils/contexts/writingPanel/WritingPanelHook";
import { WritingPanelFormProps } from "../../utils/data/contexts/WritingPanelTypes";
import { MainNetworkResponse, netLoading } from "../../utils/data/Main";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import {
  fbArticleContentGet,
  fbArticleUpdate,
} from "../../utils/services/network/FirebaseApi/ArticleModules";
import LayoutArticleForm from "./LayoutArticleForm";

export interface ArticleSubmissionProps {
  data: WritingPanelFormProps;
  userPostsRef: string;
  setResp: (value: MainNetworkResponse<StatusPlaceholderProps | null>) => void;
  clearResp: () => void;
}

export function LayoutArticlePageEdit({
  oldArticle,
}: {
  // contentless oldArticle
  oldArticle: ArticleModel;
}) {
  const { state: wpState, action: wpAction } = useWritingPanelCtx();
  const router = useRouter();

  const [oldArticleUpdated, setOldArticleUpdated] = useState(oldArticle);

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
          title: "Loading title",
          desc: "Loading Description",
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
      await fbArticleUpdate({
        oldArticle: oldArticleUpdated,
        rawArticle: data,
        userPostsRef: userPostsRef,
        callback: (resp) => {
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
                desc: "Updating the shit success",
                actions: [
                  {
                    label: "Go to My Posts",
                    callback: () => {
                      router.push(`/user/posts/`);
                    },
                  },
                  {
                    label: "Go to the article",
                    callback: () => {
                      router.push(`/article/${oldArticle.slug}/`);
                    },
                  },
                  {
                    label: "Edit again",
                    callback: () => {
                      // update the current `oldArticle`
                      setOldArticleUpdated(resp.data as ArticleModel);
                      clearResp();
                    },
                  },
                ],
              }),
            );
            return;
          }
        },
      });
    },
    [oldArticleUpdated],
  );
  async function getContent() {
    if (!wpState.formData) return;
    const content = await fbArticleContentGet({ id: oldArticle.id });
    const contentDecoded = decodeURIComponent(content || "");
    // set the content on the writingPanelCtx
    wpAction.setFormData({
      ...wpState.formData,
      content: contentDecoded,
    });
    // set the content on oldArticle
    setOldArticleUpdated({ ...oldArticle, content: contentDecoded });
  }

  useEffect(() => {
    getContent();
  }, []);

  return (
    <>
      <LayoutArticleForm title="Edit Article" submitArticle={submitArticle} />
    </>
  );
}
