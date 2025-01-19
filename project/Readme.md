# Automated Email Sender

A Node.js application for sending automated job application emails to multiple contacts using Gmail.

## Features

- Reads contacts from a CSV file
- Supports customizable email templates
- Automatic email sending with delays to respect rate limits
- Resume attachment support
- Error handling and logging

## Prerequisites

- Node.js installed
- Gmail account
- App-specific password for Gmail (2FA required)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your_app_specific_password
   RESUME_PATH=./resume.pdf
   ```

4. Place your resume at the specified `RESUME_PATH`

5. Update the contacts list in `contacts.csv` with the following format:
   ```
   company,hrName,email
   Company Name,HR Name,hr@company.com
   ```

6. Customize the email template in `emailTemplate.js` if needed

## Usage

Run the application:
```bash
npm start
```

The application will:
1. Verify email configuration
2. Read contacts from CSV
3. Send personalized emails to each contact
4. Log the progress and any errors

## File Structure

- `index.js` - Main application file
- `emailTemplate.js` - Email template
- `contacts.csv` - Contact list
- `.env` - Environment variables
- `package.json` - Project configuration

## Error Handling

- Invalid contacts are automatically filtered out
- Failed emails are logged with error messages
- Email configuration is verified before sending

## Rate Limiting

The application includes a 2-second delay between emails to avoid hitting Gmail's rate limits.