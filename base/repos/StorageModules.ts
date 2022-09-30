import { ref, deleteObject, listAll } from "firebase/storage";
import { getStorageDirectory } from "../../../app/helpers/MainHelpers";
import { firebaseClient } from "./FirebaseClient";

export async function stFileDeleteByFullLink(link: string) {
  // get link of the file
  const linkDirectory = getStorageDirectory(link);
  //   check if link exist
  if (!linkDirectory) return;
  //   delete if it does
  const deleteFileRef = ref(firebaseClient.storage, linkDirectory);
  return await deleteObject(deleteFileRef);
}

export async function stFileDeleteByDirectory(dir: string) {
  //   check if directory is valid
  if (!dir) return;
  //   delete if it does
  const deleteFileRef = ref(firebaseClient.storage, dir);
  return await deleteObject(deleteFileRef);
}

export async function stDirectoryDelete(dir: string) {
  //   check if directory is valid
  if (!dir) return;
  //   delete if it does
  const dirRef = ref(firebaseClient.storage, dir);
  const files = await listAll(dirRef);
  // check if the directory has any items
  // delete them if they do exist
  if(files.items.length){
    files.items.forEach((itemRef) => {
    deleteObject(itemRef);
  });
  }
}
