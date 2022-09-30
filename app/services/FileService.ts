import { FirebaseError } from "firebase/app";
import {
  UploadTaskSnapshot,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { nanoid } from "nanoid";
import { firebaseClient } from "../../base/clients/FirebaseClient";
import { MainNetworkResponse, netLoading, netError, netSuccess } from "../../base/data/Main";

type UploadFileProps = null | string | FirebaseError | UploadTaskSnapshot;
// Upload file
// @Returns the download url
export async function uploadFile({
  file,
  directory,
  name,
  callback,
}: {
  file: File;
  directory: string;
  name?: string;
  callback?: (resp: MainNetworkResponse<UploadFileProps>) => void;
}): Promise<string> {
  let data = "";
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
      callback?.(netSuccess<string>("", data));
      // console.log(data);
    },
  );
  await uploadTask.then(async (e) => {
    data = await getDownloadURL(uploadTask.snapshot.ref);
  });

  return data;
}
