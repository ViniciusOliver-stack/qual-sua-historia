/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, password, profileImage } = await request.json()

        //Validação Básica
        if(!email || !password) {
            return NextResponse.json(
                { error: "Email e senha são obrigatórios" },
                { status: 400 }
            )
        }

        //Verificar se o uusário já existe
        const existingUser  = await prisma.user.findUnique({
            where: { email }
        })

        if(existingUser) {
            return NextResponse.json(
                { error: "Usuário já existe com este email" },
                { status: 400 }
            )
        }

        //Criptografar senha
        const hashedPassword = await bcrypt.hash(password, 12)

        //Criar usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                profileImage, 
            }
        })

        // Retornar usuário sem a senha
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(
            { 
                message: "Usuário criado com sucesso",
                user: userWithoutPassword
            },
            { status: 201 }
        )
    } catch (error) {
        console.log("Erro ao criar o usuário: ", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}