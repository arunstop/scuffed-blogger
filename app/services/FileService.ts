import { FirebaseError } from "firebase/app";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import { nanoid } from "nanoid";
import { firebaseClient } from "../../base/clients/FirebaseClient";
import { netError, netLoading, netSuccess } from "../../base/data/Main";
import { MainApiResponse } from "./../../base/data/Main";

type UploadFileProps = null | string | FirebaseError | UploadTaskSnapshot;
// Upload file
// @Returns the download url
export async function serviceFileUpload({
  data,
  callback,
}: MainApiResponse<
  { file: File; directory: string; name?: string },
  UploadFileProps
>): Promise<string> {
  const { file, directory, name } = data;
  let res = "";
  // const file = fields.avatar[0];
  // Splitting the name by with .  then get the last item
  // which results the extension of the file
  const extension = file.name.split(".").pop();
  // Getting new name with id
  const newName = `${name || nanoid(24)}.${extension}`;
  const imageRef = ref(firebaseClient.storage, `${directory}/${newName}`);
  // Uploading the file
  const uploadTask = uploadBytesResumable(imageRef, file);
  uploadTask.on(
    "state_changed",
    // handle progress change
    (snapshot) => {
      callback?.(
        netLoading<UploadTaskSnapshot>("Uploading your avatar...", snapshot),
      );
      // console.log(snapshot);
    },
    // handle failed upload
    (error) => {
      callback?.(
        netError("Error when uploading the image", error as FirebaseError),
      );
      // console.log(error);
    },
    // handle success
    async () => {
      // data = await getDownloadURL(uploadTask.snapshot.ref);
      callback?.(netSuccess<string>("", res));
      // console.log(data);
    },
  );
  await uploadTask.then(async (e) => {
    res = await getDownloadURL(uploadTask.snapshot.ref);
  });

  return res;
}
