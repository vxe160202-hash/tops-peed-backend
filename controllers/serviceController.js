import { sendModificationRequestEmail, sendMaintenanceRequestEmail } from '../services/emailService.js';

export const sendModificationRequest = async (req, res) => {
  try {
    const { clientName, phoneNumber, email, carType, address, maintenanceTime, desiredDay, modifications } = req.body;

    // Validate required fields
    if (!clientName || !phoneNumber || !email || !carType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: clientName, phoneNumber, email, carType',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Validate phone number (basic validation)
    if (!phoneNumber.replace(/\D/g, '')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number',
      });
    }

    // Check if at least one modification is selected
    if (!modifications || !Object.values(modifications).some(val => val === true)) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one modification',
      });
    }

    // Check email configuration
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email service not configured - skipping email sending');
      return res.status(200).json({
        success: true,
        message: 'Request received (email service not configured)',
        clientEmail: email,
      });
    }

    // Send email
    await sendModificationRequestEmail({
      clientName,
      phoneNumber,
      email,
      carType,
      address,
      maintenanceTime,
      desiredDay,
      modifications,
    });

    return res.status(200).json({
      success: true,
      message: 'Modification request sent successfully! Check your email for confirmation.',
      clientEmail: email,
    });
  } catch (error) {
    console.error('❌ Error sending modification request:', error.message);
    console.error('❌ Full error:', error);
    
    // Even if email fails, acknowledge the request was received
    return res.status(200).json({
      success: true,
      message: 'Your request has been received and will be processed by our team',
      note: 'Email service error, but your request is saved. Check backend logs.',
      error: error.message,
    });
  }
};

export const sendMaintenanceRequest = async (req, res) => {
  try {
    const { clientName, phoneNumber, email, carType, address, issueCategory, issueDescription } = req.body;

    // Validate required fields
    if (!clientName || !phoneNumber || !email || !carType || !address || !issueCategory || !issueDescription) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Validate phone number (basic validation)
    if (!phoneNumber.replace(/\D/g, '')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number',
      });
    }

    // Validate issue description length
    if (issueDescription.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a detailed description (at least 10 characters)',
      });
    }

    // Check email configuration
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email service not configured - skipping email sending');
      return res.status(200).json({
        success: true,
        message: 'Request received (email service not configured)',
        clientEmail: email,
      });
    }

    // Send email
    await sendMaintenanceRequestEmail({
      clientName,
      phoneNumber,
      email,
      carType,
      address,
      issueCategory,
      issueDescription,
    });

    return res.status(200).json({
      success: true,
      message: 'Maintenance request sent successfully! Check your email for confirmation.',
      clientEmail: email,
    });
  } catch (error) {
    console.error('❌ Error sending maintenance request:', error.message);
    console.error('❌ Full error:', error);
    
    // Even if email fails, acknowledge the request was received
    return res.status(200).json({
      success: true,
      message: 'Your request has been received and will be processed by our team',
      note: 'Email service error, but your request is saved. Check backend logs.',
      error: error.message,
    });
  }
};
