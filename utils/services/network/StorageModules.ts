import { ref, deleteObject } from "firebase/storage";
import { getStorageDirectory } from "../../helpers/MainHelpers";
import { firebaseClient } from "./FirebaseClient";

export async function stFileDelete(link: string) {
  // get link of the file
  const linkDirectory = getStorageDirectory(link);
  //   check if link exist
  if (!linkDirectory) return;
  //   delete if it does
  const deleteFileRef = ref(firebaseClient.storage, linkDirectory);
  return await deleteObject(deleteFileRef);
}
