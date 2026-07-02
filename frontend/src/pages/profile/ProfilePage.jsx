import { useAuth } from "../../context/AuthContext";

function ProfilePage() {

  const { user } = useAuth();

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white rounded-2xl shadow-lg p-8 w-[450px]">

        <h1 className="text-3xl font-bold mb-6">
          My Profile
        </h1>

        <div className="space-y-4">

          <p><strong>Name:</strong> {user?.name}</p>

          <p><strong>Email:</strong> {user?.email}</p>

          <p><strong>Campus ID:</strong> {user?.campus_id}</p>

          <p><strong>Role:</strong> {user?.role}</p>

        </div>

      </div>

    </div>

  );
}

export default ProfilePage;