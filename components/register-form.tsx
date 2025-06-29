"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  BookOpenText,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione apenas arquivos de imagem");
        return;
      }

      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
        toast.success("Imagem carregada com sucesso!");
      };
      reader.onerror = () => {
        toast.error("Erro ao carregar a imagem");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações
    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          profileImage: formData.profileImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta");
      }

      toast.success("Conta criada com sucesso!", {
        description: "Redirecionando para o login...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast.error("Erro ao criar conta", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                        Me conte a sua história?
                      </h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 text-balance">
                      Crie, edite e conte suas histórias
                    </p>
                  </div>

                  {/* Upload de Imagem - Centralizado */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                        <AvatarImage
                          src={formData.profileImage || undefined}
                          alt="Foto de perfil"
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                          {formData.profileImage ? (
                            <img
                              src={formData.profileImage}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <User className="h-10 w-10" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <Label
                        htmlFor="profile-image"
                        className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-2 cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl"
                        title="Clique para adicionar uma foto"
                      >
                        <Upload className="h-4 w-4" />
                      </Label>
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  {/* Indicador de imagem carregada */}
                  {formData.profileImage && (
                    <div className="text-center">
                      <p className="text-sm text-green-600 font-medium">
                        ✓ Imagem carregada com sucesso
                      </p>
                    </div>
                  )}

                  {/* Grid responsivo para campos */}
                  <div className="space-y-4 sm:space-y-5">
                    {/* Nome completo */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="register-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Nome completo
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-name"
                          name="name"
                          type="text"
                          placeholder="Seu nome completo"
                          className="pl-10 h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          required
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Grid responsivo para Email e Telefone */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-4">
                      {/* Email */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="register-email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-email"
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

                      {/* Telefone */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="register-phone"
                          className="text-sm font-medium text-gray-700"
                        >
                          Telefone
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-phone"
                            name="phone"
                            type="tel"
                            placeholder="(11) 99999-9999"
                            className="pl-10 h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Grid responsivo para senhas */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-4">
                      {/* Senha */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="register-password"
                          className="text-sm font-medium text-gray-700"
                        >
                          Senha
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-password"
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

                      {/* Confirmar senha */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="register-confirm-password"
                          className="text-sm font-medium text-gray-700"
                        >
                          Confirmar senha
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-confirm-password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme sua senha"
                            className="pl-10 pr-12 h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                        Criando Conta...
                      </div>
                    ) : (
                      <>
                        Criar Conta
                        <BookOpenText className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  {/* Link para login */}
                  <div className="text-center text-sm text-gray-600 mt-4">
                    Já tem conta?{" "}
                    <a
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 underline underline-offset-4 font-medium transition-colors"
                    >
                      Faça Login
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
                    <h2 className="text-3xl font-bold">Bem-vindo!</h2>
                    <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                      Junte-se à nossa comunidade de contadores de histórias e
                      comece a criar narrativas incríveis.
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
