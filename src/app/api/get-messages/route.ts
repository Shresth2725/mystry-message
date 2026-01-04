import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { success } from "zod";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No User Found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Messages Fetched Successfully",
        messages: user[0].messages,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(`Error in failed to get user messages api ${error}`);
    return Response.json(
      {
        success: false,
        message: `Error in failed to get user messages api ${error}`,
      },
      { status: 500 }
    );
  }
}
