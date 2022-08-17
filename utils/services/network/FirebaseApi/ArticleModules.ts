import { FirebaseError } from "firebase/app";
import { nanoid } from "nanoid";
import { WritingPanelFormProps } from "../../../data/contexts/WritingPanelTypes";
import { MainNetworkResponse, netError, netSuccess } from "../../../data/Main";
import {
  ArticleModel,
  toArticleModel,
} from "../../../data/models/ArticleModel";
import { UserModel } from "../../../data/models/UserModel";
import {
  fsArticleAdd,
  fsArticleDelete,
  fsArticleGetByIds,
} from "../FirestoreDatabase/FirestoreArticleModules";
import { fsUserUpdate } from "../FirestoreModules";
import { rtdbArticleDeleteMirror } from "../RtdbModules";
import { stFileDelete } from "../StorageModules";
import { ArticleListModel } from "./../../../data/models/ArticleListModel";

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
  // generate article
  const id = nanoid(24);
  const article = toArticleModel({
    id:id,user:user,formData:rawArticle,
  });

  const errorCb = (msg: string, error: any) => {
    console.log(error);
    callback?.(netError(msg, error));
  };

  // contentless article
  const articleContentless: ArticleModel = { ...article, content: "" };

  // create article with no content
  try {
    const articleList: ArticleListModel = {
      id: user.list.posts,
      title: `${user.name}'s articles`,
      status: "PUBLIC",
      articles: [articleContentless],
      dateAdded: Date.now(),
      dateUpdated: Date.now(),
    };
    // add article and check if user already has article or not
    await fsArticleAdd(articleList);
    return null;
  } catch (error) {
    errorCb("Error when creating article", error as FirebaseError);
    return null;
  }

  // // create article content
  // try {
  //   await fsArticleContentAdd(article.id, article.content);
  // } catch (error) {
  //   errorCb("Error when creating article", error as FirebaseError);
  //   return null;
  // }

  // // upload thumbnail
  // const thumbnail = rawArticle.thumbnail;
  // if (thumbnail) {
  //   try {
  //     callback?.(netLoading<ArticleModel>("Uploading the thumbnail", article));
  //     // uploading thumbnail
  //     const thumbnailUrl = await uploadFile({
  //       file: thumbnail[0],
  //       directory: "/thumbnails",
  //       name: article.id,
  //     });

  //     if (!thumbnailUrl) {
  //       callback?.(netError("Couldn't get the uploaded image's url"));
  //       return null;
  //     }
  //     return article;
  //   } catch (error) {
  //     callback?.(
  //       netError("Error when creating thumbnail", error as FirebaseError),
  //     );
  //     return null;
  //   }
  // }

  // // uploading mirror to rtdb for efficient searching
  // try {
  //   await rtdbArticleAddMirror(articleContentless, user);
  // } catch (error) {
  //   callback?.(
  //     netError("Error when creating thumbnail", error as FirebaseError),
  //   );
  //   return null;
  // }

  return article;
}

export async function fbArticleGetByIds({
  articleIds,
  callback,
}: {
  articleIds: string[];
  callback?: (
    resp: MainNetworkResponse<ArticleModel[] | null | FirebaseError>,
  ) => void;
}): Promise<ArticleModel[]> {
  try {
    const data = await fsArticleGetByIds(articleIds);
    callback?.(
      netSuccess<ArticleModel[]>("Success getting user's posts", data),
    );
    return data;
  } catch (error) {
    console.log(error);
    callback?.(
      netError<FirebaseError>(
        "Error when getting users's posts",
        error as FirebaseError,
      ),
    );
    return [];
  }
}

export async function fbArticleDelete({
  articleId,
  user,
  thumbnail,
  callback,
}: {
  articleId: string;
  user: UserModel;
  thumbnail: string;
  callback?: (resp: MainNetworkResponse<string | null | FirebaseError>) => void;
}): Promise<UserModel | null> {
  // delete firestore data
  let data = false;
  try {
    data = await fsArticleDelete(articleId);
  } catch (error) {
    console.log(error);
    callback?.(
      netError<FirebaseError>(
        "Error when deleting users's posts",
        error as FirebaseError,
      ),
    );
    return null;
  }
  // delete mirror on rtdb
  try {
    await rtdbArticleDeleteMirror(articleId);
  } catch (error) {
    console.log(error);
    callback?.(
      netError<FirebaseError>(
        "Error when deleting users's posts",
        error as FirebaseError,
      ),
    );
    return null;
  }
  // update the user data in firestore
  try {
    await fsUserUpdate(user);
  } catch (error) {
    console.log(error);
    callback?.(
      netError<FirebaseError>(
        "Error when deleting users's posts",
        error as FirebaseError,
      ),
    );
    return null;
  }
  // delete thumbnail if exists
  if (thumbnail) {
    try {
      await stFileDelete(thumbnail);
    } catch (error) {
      console.log(error);
      callback?.(
        netError<FirebaseError>(
          "Error when deleting users's posts",
          error as FirebaseError,
        ),
      );
    }
  }

  callback?.(
    netSuccess<string>(
      "Sucess deleting the article",
      `Deleted article with ID : ${articleId}`,
    ),
  );
  return user;
}
