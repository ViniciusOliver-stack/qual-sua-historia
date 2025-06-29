"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Bem-vindo, {session.user.name || session.user.email}!
                    </h1>
                    <p className="text-sm text-gray-600">
                      Email: {session.user.email}
                    </p>
                    {session.user.phone && (
                      <p className="text-sm text-gray-600">
                        Telefone: {session.user.phone}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
