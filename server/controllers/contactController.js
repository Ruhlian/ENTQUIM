// controllers/contactController.js
const transporter = require('../config/nodemailer');

let lastSentTime = null; // Variable para almacenar el tiempo del último envío

const sendContactEmail = async (req, res) => {
    const { nombre, apellido, correo, telefono, ciudad, pais, mensaje } = req.body;

    // Validación simple
    if (!nombre || !apellido || !correo || !mensaje) {
        return res.status(400).json({ message: 'Por favor complete todos los campos obligatorios.' });
    }

    const currentTime = new Date();

    // Verificar si han pasado 5 minutos desde el último envío
    if (lastSentTime && (currentTime - lastSentTime) < 5 * 60 * 1000) {
        const timeRemaining = Math.ceil((5 * 60 * 1000 - (currentTime - lastSentTime)) / 1000);
        return res.status(429).json({ message: `Por favor, espere ${timeRemaining} segundos antes de enviar otro correo.` });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // El correo de destino, puedes cambiarlo si deseas que se envíe a otro lugar
        subject: `Nuevo mensaje de contacto de ${nombre} ${apellido}`,
        text: `
            Nombre: ${nombre}
            Apellido: ${apellido}
            Correo: ${correo}
            Teléfono: ${telefono}
            Ciudad: ${ciudad}
            País: ${pais}
            Mensaje: ${mensaje}
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        lastSentTime = currentTime; // Actualizar el tiempo del último envío
        res.status(200).json({ message: 'Correo enviado exitosamente.' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo. Inténtelo más tarde.' });
    }
};

module.exports = {
    sendContactEmail,
};
