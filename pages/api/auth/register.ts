import { NextApiRequest, NextApiResponse } from "next";
import {
  createErrorResponse
} from "../../../utils/data/Main";
import { firebaseAuth } from "./../../../utils/services/network/FirestoreApi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Proceed only POST
  if (req.method !== "POST")
    return res.status(500).json(createErrorResponse("Only POST allowed"));
  // check if requred parameters are valid
  const { email, password } = <{ email: string; password: string }>req.body;
  if (!email || !password)
    return res
      .status(200)
      .json(
        createErrorResponse(
          "Required parameters: Email or Password is invalid",
        ),
      );
  // if valid, add to database
  const registeredUser = await firebaseAuth.registerUser({
    email: email as string,
    password: password as string,
  });
  return res.status(200).json(registeredUser);
}
