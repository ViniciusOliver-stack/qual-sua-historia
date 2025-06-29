"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, BookOpenText, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redireciona usuário logado para dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Ops, houve um erro!", {
          description: "Email ou senha inválidos",
        });
      } else {
        toast.success("Login realizado com sucesso!", {
          description: "Redirecionando...",
        });
        // O redirecionamento será feito pelo useEffect acima
        // quando a sessão for atualizada
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
      console.log("Erro: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostra loading enquanto verifica a sessão
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Verificando...</span>
        </div>
      </div>
    );
  }

  // Se já está logado, não mostra o formulário (será redirecionado)
  if (status === "authenticated") {
    return null;
  }

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-6xl">
        <Card className="overflow-hidden shadow-xl border-0">
          <CardContent className="grid p-0 lg:grid-cols-2">
            {/* Formulário - Responsivo */}
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
              <form
                className="w-full max-w-md mx-auto lg:max-w-none"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-4 sm:gap-6">
                  {/* Header */}
                  <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                      <h1 className="text-[20px] font-bold text-gray-900">
                        Bem-vindo de volta!
                      </h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 text-balance">
                      Faça login na sua conta
                    </p>
                  </div>

                  {/* Campos do formulário */}
                  <div className="space-y-4 sm:space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="login-email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Senha */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="login-password"
                          className="text-sm font-medium text-gray-700"
                        >
                          Senha
                        </Label>
                        <a
                          href="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
                        >
                          Esqueceu a senha?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          className="pl-10 pr-12 h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          required
                          value={formData.password}
                          onChange={handleChange}
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
                  </div>

                  {/* Botão de submit */}
                  <Button
                    type="submit"
                    className="w-full h-11 sm:h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 transition-all mt-6 text-base font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Entrando...
                      </div>
                    ) : (
                      <>
                        Entrar
                        <BookOpenText className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  {/* Link para registro */}
                  <div className="text-center text-sm text-gray-600 mt-6">
                    Não tem uma conta?{" "}
                    <a
                      href="/register"
                      className="text-blue-600 hover:text-blue-700 underline underline-offset-4 font-medium transition-colors"
                    >
                      Criar conta
                    </a>
                  </div>
                </div>
              </form>
            </div>

            {/* Imagem lateral - Oculta no mobile */}
            <div className="relative hidden lg:block bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative h-full flex flex-col justify-center items-center p-8 text-white">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <BookOpen className="w-10 h-10" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Olá novamente!</h2>
                    <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                      Continue sua jornada criativa e explore novas
                      possibilidades para suas histórias.
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-blue-200">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Termos de serviço */}
        <div className="text-center text-xs sm:text-sm text-gray-500 mt-6 px-4">
          Ao continuar, você concorda com nossos{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
          >
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
          >
            Política de Privacidade
          </a>
          .
        </div>
      </div>
    </div>
  );
}
