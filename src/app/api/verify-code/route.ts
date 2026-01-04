import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: `No User Found`,
        },
        {
          status: 401,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: `Code not correct`,
        },
        {
          status: 401,
        }
      );
    }

    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: `Code is expired`,
        },
        {
          status: 401,
        }
      );
    }

    user.isVerified = true;
    await user.save();

    return Response.json(
      {
        success: true,
        message: `Code Verified Successfully`,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error verifying code: ", error);
    return Response.json(
      {
        success: false,
        message: `Error verifying code: ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}
