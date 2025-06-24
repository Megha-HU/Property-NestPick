import Image from "next/image";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import ProfileDefault from "@/assets/images/profile.png";
import ProfileProperties from "@/components/ProfileProperties";
import { convertToSerializeObject } from "@/utils/convertToObject";

const ProfilePage = async () => {
  await connectDB();
  const sessionUser = await getSessionUser();

  const { userId } = sessionUser;
  if (!userId) {
    throw new Error("User Id is required!");
  }

  const propertiesDocs = await Property.find({ owner: userId }).lean();
  const properties = propertiesDocs?.map(convertToSerializeObject);

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto py-12 px-4">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border">
          <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
            Your Profile
          </h1>
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="w-full md:w-1/4 flex flex-col items-center md:items-start mb-8 md:mb-0">
              <div className="mb-4">
                <Image
                  className="h-32 w-32 rounded-full"
                  src={sessionUser.user.image || ProfileDefault}
                  width={128}
                  height={128}
                  alt="User"
                />
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-xl mb-2">
                  <span className="font-bold">Name: </span>{" "}
                  {sessionUser.user.name}
                </h2>
                <h2 className="text-xl">
                  <span className="font-bold">Email: </span>{" "}
                  {sessionUser.user.email}
                </h2>
              </div>
            </div>

            <div className="w-full md:w-3/4 md:pl-6">
              <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">
                Your Listings
              </h2>
              <ProfileProperties properties={properties} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProfilePage;
