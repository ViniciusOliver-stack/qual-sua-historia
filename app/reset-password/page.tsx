"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, BookOpen, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token inválido");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Senha redefinida com sucesso!");
        // Redireciona para login após 3 segundos
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error("Erro ao redefinir senha", {
          description: data.error || "Tente novamente",
        });
      }
    } catch (error) {
      toast.error("Erro de conexão", {
        description: "Verifique sua internet e tente novamente",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Link inválido
            </h2>
            <p className="text-gray-600 mb-6">
              O link de reset de senha é inválido ou expirou.
            </p>
            <Link href="/forgot-password">
              <Button className="w-full">Solicitar novo link</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            {!isSuccess ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <BookOpen className="h-8 w-8 text-blue-500" />
                    <h1 className="text-2xl font-bold text-gray-900">
                      Nova senha
                    </h1>
                  </div>
                  <p className="text-gray-600">Digite sua nova senha</p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nova senha */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Nova senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua nova senha"
                        className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Confirmar senha */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirmar senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua nova senha"
                        className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Indicador de força da senha */}
                  {password && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        Força da senha:
                      </div>
                      <div className="flex gap-2">
                        <div
                          className={`h-2 flex-1 rounded ${
                            password.length >= 6
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        ></div>
                        <div
                          className={`h-2 flex-1 rounded ${
                            password.length >= 8
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        ></div>
                        <div
                          className={`h-2 flex-1 rounded ${
                            password.length >= 10 &&
                            /[A-Z]/.test(password) &&
                            /[0-9]/.test(password)
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Redefinindo...
                      </div>
                    ) : (
                      "Redefinir senha"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              /* Tela de sucesso */
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Senha redefinida!
                </h2>
                <p className="text-gray-600 mb-6">
                  Sua senha foi redefinida com sucesso. Você será redirecionado
                  para o login em instantes.
                </p>
                <Link href="/login">
                  <Button className="w-full">Ir para o login</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
