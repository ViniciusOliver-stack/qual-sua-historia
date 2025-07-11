import nodemailer from "nodemailer";

// Configuração do transporter do Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "vinicius.so.contato@gmail.com",
    pass: "tdtynwtxjheikmmt",
  },
});

// Função para enviar email de reset de senha
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: {
      name: "Seu App",
      address: process.env.GMAIL_USER!,
    },
    to: email,
    subject: "Reset de Senha - Seu App",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset de Senha</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Reset de Senha</h1>
              <p>Recebemos uma solicitação para redefinir sua senha</p>
            </div>
            <div class="content">
              <p>Olá!</p>
              <p>Você solicitou um reset de senha para sua conta. Clique no botão abaixo para criar uma nova senha:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Redefinir Senha</a>
              </div>
              
              <p>Ou copie e cole o link abaixo no seu navegador:</p>
              <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px;">
                ${resetUrl}
              </p>
              
              <p><strong>⚠️ Este link expira em 1 hora por motivos de segurança.</strong></p>
              
              <p>Se você não solicitou este reset de senha, pode ignorar este email com segurança.</p>
            </div>
            <div class="footer">
              <p>© 2025 Seu App. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Reset de Senha - Seu App
      
      Olá!
      
      Você solicitou um reset de senha para sua conta.
      
      Acesse o link abaixo para redefinir sua senha:
      ${resetUrl}
      
      Este link expira em 1 hora por motivos de segurança.
      
      Se você não solicitou este reset, pode ignorar este email.
      
      © 2025 Seu App
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de reset enviado com sucesso para:", email);
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return { success: false, error };
  }
}

export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log("✅ Conexão com Gmail SMTP configurada corretamente!");
    return true;
  } catch (error) {
    console.error("❌ Erro na configuração do Gmail SMTP:", error);
    return false;
  }
}
