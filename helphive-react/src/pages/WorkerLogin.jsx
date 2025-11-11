import { SignIn } from "@clerk/clerk-react";

const WorkerLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-300/10">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-brand-900 mb-4">Worker Login</h1>

        <p className="text-gray-600 mb-6">
          Sign in to access your bookings & manage your services.
        </p>

        <SignIn
          routing="path"
          path="/worker-login"
          redirectUrl="/worker-dashboard"
        />
      </div>
    </div>
  );
};

export default WorkerLogin;
