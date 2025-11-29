const {onDocumentUpdated} = require('firebase-functions/v2/firestore');
const {onCall} = require('firebase-functions/v2/https');
const functions = require('firebase-functions');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configuração do transporte de e-mail com variáveis de ambiente
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usando Gmail, mas pode ser configurado para outros provedores
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para envio de e-mail de notificação de carta desbloqueada
exports.sendUnlockNotificationEmail = onDocumentUpdated('letters/{letterId}', async (event) => {
  const beforeData = event.data.before.data();
  const afterData = event.data.after.data();
  
  // Verifica se a carta agora está desbloqueada
  const beforeOpenDate = beforeData.openDate ? new Date(beforeData.openDate.toDate ? beforeData.openDate.toDate() : beforeData.openDate) : null;
  const afterOpenDate = afterData.openDate ? new Date(afterData.openDate.toDate ? afterData.openDate.toDate() : afterData.openDate) : null;
  
  const now = new Date();
  const wasLocked = beforeOpenDate && beforeOpenDate > now;
  const isNowUnlocked = !afterOpenDate || (afterOpenDate <= now);
  
  // Verificar se já enviamos notificação para esta carta
  const wasNotificationSent = beforeData.unlockNotificationSent === true;
  const isNotificationSent = afterData.unlockNotificationSent === true;
  
  // Se a carta foi desbloqueada (mudou de bloqueada para desbloqueada) E ainda não enviamos notificação
  if (wasLocked && isNowUnlocked && !wasNotificationSent && !isNotificationSent) {
    try {
      // Obter informações do usuário
      const userDoc = await admin.firestore().collection('users').doc(afterData.author_id).get();
      const userData = userDoc.data();
      
      if (!userData || !userData.email) {
        logger.error('Usuário não encontrado ou sem e-mail:', afterData.author_id);
        return null;
      }
      
      // Construir URL para a carta
      const letterUrl = `${process.env.APP_URL}/patient/letters/${event.params.letterId}`;
      
      // Configurar e-mail
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userData.email,
        subject: `Sua carta "${afterData.title}" foi desbloqueada!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f3e9; border-radius: 10px;">
            <h1 style="color: #b45309; text-align: center;">🎉 Carta Desbloqueada!</h1>
            <p style="font-size: 18px; color: #5a3e36; text-align: center;">
              Olá ${userData.name || userData.email.split('@')[0]}!
            </p>
            <p style="font-size: 16px; color: #5a3e36; text-align: center;">
              Sua carta "<strong>${afterData.title}</strong>" está pronta para ser lida!
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${letterUrl}" 
                 style="display: inline-block; background-color: #b45309; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
                Ler Carta Agora
              </a>
            </div>
            <p style="font-size: 14px; color: #7d5d50; text-align: center;">
              Clique no botão acima para acessar sua carta diretamente em nosso sistema.
            </p>
            <hr style="border: none; border-top: 1px solid #d97706; margin: 20px 0;">
            <p style="font-size: 12px; color: #a5694f; text-align: center;">
              Esta é uma notificação automática. Por favor, não responda a este e-mail.
            </p>
          </div>
        `
      };
      
      // Enviar e-mail
      await transporter.sendMail(mailOptions);
      logger.info('E-mail de notificação enviado com sucesso para:', userData.email);
      
      // Atualizar documento da carta para indicar que a notificação foi enviada
      await admin.firestore().collection('letters').doc(event.params.letterId).update({
        unlockNotificationSent: true
      });
      
      return null;
    } catch (error) {
      logger.error('Erro ao enviar e-mail de notificação:', error);
      return null;
    }
  }
  
  return null;
});

// Função para envio de e-mail manual (caso seja necessário acionar manualmente)
exports.sendManualUnlockEmail = onCall(async (request) => {
  // Verificar autenticação (opcional, dependendo dos requisitos de segurança)
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Você deve estar autenticado para chamar esta função.'
    );
  }
  
  const { letterId, userId } = request.data;
  
  if (!letterId || !userId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Os parâmetros letterId e userId são obrigatórios.'
    );
  }
  
  try {
    // Obter dados da carta
    const letterDoc = await admin.firestore().collection('letters').doc(letterId).get();
    if (!letterDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Carta não encontrada.'
      );
    }
    
    const letterData = letterDoc.data();
    
    // Verificar se o usuário tem permissão para acessar esta carta
    if (letterData.author_id !== userId) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Você não tem permissão para acessar esta carta.'
      );
    }
    
    // Obter informações do usuário
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData || !userData.email) {
      throw new functions.https.HttpsError(
        'not-found',
        'Usuário não encontrado ou sem e-mail.'
      );
    }
    
    // Construir URL para a carta
    const letterUrl = `${process.env.APP_URL}/patient/letters/${letterId}`;
    
    // Configurar e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userData.email,
      subject: `Sua carta "${letterData.title}" foi desbloqueada!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f3e9; border-radius: 10px;">
          <h1 style="color: #b45309; text-align: center;">🎉 Carta Desbloqueada!</h1>
          <p style="font-size: 18px; color: #5a3e36; text-align: center;">
            Olá ${userData.name || userData.email.split('@')[0]}!
          </p>
          <p style="font-size: 16px; color: #5a3e36; text-align: center;">
            Sua carta "<strong>${letterData.title}</strong> está pronta para ser lida!
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${letterUrl}" 
               style="display: inline-block; background-color: #b45309; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
              Ler Carta Agora
            </a>
          </div>
          <p style="font-size: 14px; color: #7d5d50; text-align: center;">
            Clique no botão acima para acessar sua carta diretamente em nosso sistema.
          </p>
          <hr style="border: none; border-top: 1px solid #d97706; margin: 20px 0;">
          <p style="font-size: 12px; color: #a5694f; text-align: center;">
            Esta é uma notificação automática. Por favor, não responda a este e-mail.
          </p>
        </div>
      `
    };
    
    // Enviar e-mail
    await transporter.sendMail(mailOptions);
    logger.info('E-mail de notificação enviado com sucesso para:', userData.email);
    
    // Atualizar documento da carta para indicar que a notificação foi enviada
    await admin.firestore().collection('letters').doc(letterId).update({
      unlockNotificationSent: true
    });
    
    return { success: true, message: 'E-mail de notificação enviado com sucesso.' };
  } catch (error) {
    logger.error('Erro ao enviar e-mail de notificação manual:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Erro ao enviar e-mail: ${error.message}`
    );
  }
});