import { RegisterForm } from "@/components/register-form";

import {  } from "lucide-react"

export default function RegisterPage() {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            {/* Animated Background - agora com z-index baixo */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-gradient-xy -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse -z-10"></div>
            
            {/* Formulário com z-index alto para ficar por cima */}
            <div className="relative z-10 w-full max-w-sm md:max-w-3xl">
                <RegisterForm />
            </div>
        </div>
    )
}