import React, { useCallback, useEffect, useState } from "react";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import MainTextAreaInput from "../input/MainTextAreaInput";
import MainTextInput from "../input/MainTextInput";
interface WritingPanelFormProps {
  article?: ArticleModel;
  setArticle: (title: string, desc: string, content: string) => void;
  //   title: string;
  //   editTitle: (v: string) => void;
  //   desc: string;
  //   editDesc: (v: string) => void;
  //   content: string;
  //   editContent: (v: string) => void;
}

function WritingPanelForm({ article, setArticle }: WritingPanelFormProps) {
  const [title, setTitle] = useState<string>();
  const [desc, setDesc] = useState<string>();
  const [content, setContent] = useState<string>();
  const editTitle = useCallback((value: string) => {
    setTitle(value);
  }, []);
  const editDesc = useCallback((value: string) => {
    setDesc(value);
  }, []);
  const editContent = useCallback((value: string) => {
    setContent(value);
  }, []);

  const submitArticleChange = useCallback(() => {
    // check if states is valid
    if (!title && !desc && !content) return;
    // if it does then update the article 
    setArticle(title || "", desc || "", content || "");
  }, [content, desc, title]);

  useEffect(() => {
    if (!article) return;
    // initialize states
    setTitle(article.title);
    setDesc(article.desc);
    setContent(article.content);
    // console.log(article.content);
    // console.log(decodeURIComponent(article.content));

    return () => {};
  }, [article]);

  useEffect(() => {
    return () => {
      // Submit when unmounted
      submitArticleChange();
    };
  }, [submitArticleChange]);

  return (
    <div className="flex w-full flex-col gap-4">
      <span className="text-xl font-bold sm:text-2xl">Title</span>
      <MainTextInput
        scaleTo="md"
        value={title}
        placeholder="Very lucrative and straight-forward sentence..."
        onChange={(ev) => editTitle(ev.target.value)}
      />
      <span className="text-xl font-bold sm:text-2xl">Description</span>
      <MainTextAreaInput
        placeholder="This article talks about something interesting..."
        className="!h-32 max-h-32"
        value={desc}
        onChange={(ev) => editDesc(ev.target.value)}
      />
      <span className="text-xl font-bold sm:text-2xl">Content</span>
      <MainTextAreaInput
        className="min-h-[36rem] resize-none"
        placeholder="Write the article's content"
        value={content}
        onChange={(ev) => editContent(ev.target.value)}
      />
    </div>
  );
}

export default React.memo(WritingPanelForm, (prev, next) => {
  // Check if the previous article is the same
  // if it is the same => memoize/don't render
  // if it is NOT the same => re-render
  if (prev.article?.id !== next.article?.id) return false;
  return true;
});
