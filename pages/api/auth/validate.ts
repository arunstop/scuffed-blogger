import { NextApiRequest, NextApiResponse } from "next";
import { netError } from "../../../utils/data/Main";
import { fbaValidate } from "../../../utils/services/network/FirebaseAdminModules";
import { netSuccess } from "./../../../utils/data/Main";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Proceed only POST
  if (req.method !== "GET")
    return res.status(500).json(netError("Only GET allowed"));
  // check if requred parameters are valid
  const token = req.headers.authorization;
  if (!token)
    return res.status(403).json(netError("Authorization token is missing"));
  const decodedToken =  await fbaValidate(token);
  res.status(200).json(netSuccess("Success", decodedToken));
  // if valid, add to database
  // const registeredUser = await firebaseAuth.registerUser({
  //   email: email,
  //   password: password,
  // });
  // return res.status(200).json(registeredUser);
}
