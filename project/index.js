require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const emailTemplate = require('./emailTemplate');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to parse contacts from CSV
function parseContacts() {
  const fileContent = fs.readFileSync('contacts.csv', 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true
  });
  
  // Filter out empty rows and map to expected format
  return records
    .filter(record => record.company && record.hrName && record.email)
    .map(record => ({
      company: record.company.trim(),
      hrName: record.hrName.trim(),
      email: record.email.trim()
    }));
}

// Process contacts and send emails
async function sendEmails() {
  try {
    const contacts = parseContacts();
    console.log(`Found ${contacts.length} contacts to process`);

    for (const contact of contacts) {
      const { company, hrName, email } = contact;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Application for Opportunities at ${company}`,
        text: emailTemplate(company, hrName),
        attachments: [
          {
            path: process.env.RESUME_PATH,
            filename: 'resume.pdf'
          }
        ]
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`✓ Email sent successfully to ${hrName} at ${company}`);
        // Add delay to avoid hitting email sending limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`✗ Failed to send email to ${company}:`, error.message);
      }
    }

    console.log('\nEmail sending process completed!');
  } catch (error) {
    console.error('Error processing contacts:', error.message);
  }
}

// Verify email configuration before sending
async function verifyConfiguration() {
  try {
    await transporter.verify();
    console.log('Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  const isConfigValid = await verifyConfiguration();
  if (isConfigValid) {
    await sendEmails();
  } else {
    console.error('Please check your email configuration in .env file');
  }
}

main().catch(console.error);