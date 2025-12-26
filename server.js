const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow requests from GitHub Pages
app.use(cors({
    origin: 'https://nicshik.github.io',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify email configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email service ready');
    }
});

// Root endpoint - API info
app.get('/', (req, res) => {
    res.json({ 
        status: 'Mathstat Quiz Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health - Check API status',
            feedback: 'POST /api/feedback - Submit quiz feedback'
        },
        frontend: 'https://nicshik.github.io/mathstat-exam-quiz/'
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        emailReady: transporter ? true : false
    });
});

// Feedback submission endpoint
app.post('/api/feedback', async (req, res) => {
    try {
        const {
            taskId,
            questionText,
            userAnswer,
            correctAnswer,
            description,
            timestamp,
            userAgent
        } = req.body;

        // Validate required fields
        if (!taskId || !description || !questionText) {
            return res.status(400).json({
                success: false,
                message: 'Отсутствуют обязательные поля'
            });
        }

        // Prepare email content
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px;">
                    Новая обратная связь - Mathstat Quiz
                </h2>
                
                <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">Информация о вопросе:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 180px;">Задача:</td>
                            <td style="padding: 8px 0;">${taskId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Текст вопроса:</td>
                            <td style="padding: 8px 0;">${questionText}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Ответ студента:</td>
                            <td style="padding: 8px 0; color: #dc3545;">${userAnswer}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Правильный ответ:</td>
                            <td style="padding: 8px 0; color: #28a745;">${correctAnswer}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Время:</td>
                            <td style="padding: 8px 0;">${new Date(timestamp).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">Описание неточности:</h3>
                    <p style="line-height: 1.6; color: #555;">${description.replace(/\n/g, '<br>')}</p>
                </div>
                
                <div style="font-size: 12px; color: #888; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;">
                    <p><strong>User-Agent:</strong> ${userAgent || 'N/A'}</p>
                    <p><strong>Frontend:</strong> <a href="https://nicshik.github.io/mathstat-exam-quiz/">Mathstat Quiz</a></p>
                </div>
            </div>
        `;

        const textContent = `
НОВАЯ ОБРАТНАЯ СВЯЗЬ - MATHSTAT QUIZ
========================================

ИНФОРМАЦИЯ О ВОПРОСЕ:
- Задача: ${taskId}
- Текст вопроса: ${questionText}
- Ответ студента: ${userAnswer}
- Правильный ответ: ${correctAnswer}
- Время: ${new Date(timestamp).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}

ОПИСАНИЕ НЕТОЧНОСТИ:
${description}

========================================
User-Agent: ${userAgent || 'N/A'}
Frontend: https://nicshik.github.io/mathstat-exam-quiz/
        `;

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL || 'shikhirev.nn@phystech.edu',
            subject: `[Матстат Квиз] Задача ${taskId} - Обратная связь`,
            html: htmlContent,
            text: textContent,
            replyTo: process.env.EMAIL_USER
        };

        await transporter.sendMail(mailOptions);

        console.log(`[✓] Feedback received - Task ${taskId} at ${new Date().toLocaleString('ru-RU')}`);

        res.json({
            success: true,
            message: 'Спасибо за обратную связь!',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[✗] Feedback submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обработке запроса',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`┌${'─'.repeat(50)}┐`);
    console.log(`│ Mathstat Quiz Backend API`);
    console.log(`├${'─'.repeat(50)}┤`);
    console.log(`│ Server running on port: ${PORT}`);
    console.log(`│ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`│ CORS enabled for: https://nicshik.github.io`);
    console.log(`└${'─'.repeat(50)}┘`);
});
