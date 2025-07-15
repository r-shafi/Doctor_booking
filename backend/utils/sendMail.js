import nodemailer from 'nodemailer';

const sendMail = async ({ to, subject, text = '', html = '' }) => {
  try {
    if (!to || !subject) {
      throw new Error("Missing required fields: 'to' or 'subject'");
    }

    // Validate email configuration
    if (!process.env.EMAIL_ADDRESS || !process.env.EMAIL_PASSWORD) {
      throw new Error(
        'Email configuration missing: EMAIL_ADDRESS or EMAIL_PASSWORD not set in environment variables'
      );
    }

    // Enhanced Gmail configuration with multiple fallback options
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD, // This should be an App Password
      },
      // Additional options for better reliability
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      pool: true,
      maxConnections: 1,
      rateDelta: 20000,
      rateLimit: 5,
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3',
      },
    });

    // Verify transporter configuration with longer timeout
    console.log('🔄 Verifying email server connection...');
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Connection timeout after 30 seconds')),
          30000
        )
      ),
    ]);
    console.log('✅ Email server connection verified');

    const mailOptions = {
      from: `"Prescripto Admin" <${process.env.EMAIL_ADDRESS}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]+>/g, ''),
      html,
    };

    console.log('🔄 Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.response);
    console.log('✅ Message ID:', info.messageId);

    // Close the connection
    transporter.close();

    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Full error:', error);

    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      console.error(
        '❌ Authentication failed. Check your email and App Password.'
      );
    } else if (error.code === 'ECONNECTION') {
      console.error('❌ Connection failed. Check your internet connection.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('❌ Connection timeout. Try again later.');
    }

    return false;
  }
};

export default sendMail;
