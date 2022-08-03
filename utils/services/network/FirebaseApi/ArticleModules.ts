import { FirebaseError } from "firebase/app";
import { WritingPanelFormProps } from "../../../data/contexts/WritingPanelTypes";
import {
  MainNetworkResponse,
  netError,
  netLoading,
  netSuccess,
} from "../../../data/Main";
import {
  ArticleModel,
  toArticleModel,
} from "../../../data/models/ArticleModel";
import { UserModel } from "../../../data/models/UserModel";
import {
  fsArticleAdd,
  fsArticleUpdate,
  fsUserUpdate,
} from "../FirestoreModules";
import { rtdbArticleAddMirror } from "../RtdbModules";
import { uploadFile } from "./FileModules";

// Adding article, now using direct firebaseClient
interface PropsAddArticle {
  rawArticle: WritingPanelFormProps;
  user: UserModel;
  callback?: (
    resp: MainNetworkResponse<ArticleModel | null | FirebaseError>,
  ) => void;
}

export async function fbArticleAdd({
  rawArticle,
  user,
  callback,
}: PropsAddArticle): Promise<ArticleModel | null> {
  // TODO: Add article with its thumbnail
  // generate article
  const article = toArticleModel(rawArticle);
  // make/mirror article data to rtdb for efficient searching
  const mirrorArticle = async (articleMirror: ArticleModel) => {
    try {
      await rtdbArticleAddMirror(articleMirror, user);
    } catch (error) {
      console.log(error);
    }
  };

  // upload the article
  try {
    // add article first
    await fsArticleAdd(article);

    // upload thumbnail if there is one
    const thumbnail = rawArticle.thumbnail;
    if (thumbnail) {
      try {
        callback?.(
          netLoading<ArticleModel>("Uploading the thumbnail", article),
        );
        // uploading thumbnail
        const thumbnailUrl = await uploadFile({
          file: thumbnail[0],
          directory: "/thumbnails",
        });

        if (!thumbnailUrl) {
          callback?.(netError("Couldn't get the uploaded image's url"));
          return null;
        }

        // create new article with newly added thumbnail url
        const articleWithThumbnail = { ...article, thumbnail: thumbnailUrl };

        // add some part of article to rtdb for searching purpose
        mirrorArticle(articleWithThumbnail);

        // update the said article in database
        try {
          await fsArticleUpdate(articleWithThumbnail, ["thumbnail"]);
          callback?.(
            netSuccess<ArticleModel>(
              "Success creating article",
              articleWithThumbnail,
            ),
          );
          return articleWithThumbnail;
        } catch (error) {
          callback?.(
            netError(
              "Error when applying thumbnail to database",
              error as FirebaseError,
            ),
          );
          return null;
        }
      } catch (error) {
        callback?.(
          netError("Error when creating thumbnail", error as FirebaseError),
        );
        return null;
      }
    }

    // add some part of article to rtdb for searching purpose
    mirrorArticle(article);

    // updating user data that they have added a new article
    const userPosts = [...(user.list?.posts || [])];
    fsUserUpdate({
      ...user,
      list: {
        ...user.list,
        posts: userPosts || [article.id],
      },
    });

    // if no thumbnail, then just return the default generated article
    callback?.(netSuccess<ArticleModel>("Success creating article", article));
    return article;
  } catch (error) {
    callback?.(netError("Error when creating article", error as FirebaseError));
    return null;
  }
}
