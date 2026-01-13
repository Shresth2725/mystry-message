import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const user = await UserModel.findById(session.user._id)
      .select("messages")
      .lean();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No User Found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Messages Fetched Successfully",
        messages: user.messages ?? [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
