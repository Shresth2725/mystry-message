import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No User Found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User Not Accepting the Message",
        },
        { status: 401 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message Added Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(`Error in failed to send user messages api ${error}`);
    return Response.json(
      {
        success: false,
        message: `Error in failed to send user messages api ${error}`,
      },
      { status: 500 }
    );
  }
}
