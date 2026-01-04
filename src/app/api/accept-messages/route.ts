import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { success } from "zod";

// Update IsAcceptingMessage Status
export async function POST(request: Request) {
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

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const loggedInUser = await UserModel.findById(userId);

    if (!loggedInUser) {
      return Response.json(
        {
          success: false,
          message: "Not User Found",
        },
        { status: 401 }
      );
    }

    loggedInUser.isAcceptingMessage = acceptMessages;
    await loggedInUser.save();

    return Response.json(
      {
        success: true,
        message: "User isacceptingMessage updated succesfully",
        loggedInUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(`Error in failed to update user accpet status api ${error}`);
    return Response.json(
      {
        success: false,
        message: `Error in failed to update user accpet status api ${error}`,
      },
      { status: 500 }
    );
  }
}

// Get IsAcceptingMessage Status
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

  const userId = user._id;

  try {
    const loggedInUser = await UserModel.findById(userId);

    if (!loggedInUser) {
      return Response.json(
        {
          success: false,
          message: "Not User Found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User isacceptingMessage get succesfully",
        isAcceptingMessage: loggedInUser.isAcceptingMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(`Error in failed to get user accpet status api ${error}`);
    return Response.json(
      {
        success: false,
        message: `Error in failed to get user accpet status api ${error}`,
      },
      { status: 500 }
    );
  }
}
