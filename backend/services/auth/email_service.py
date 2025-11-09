"""
Email Service for Authentication
Sends verification and password reset emails
"""

import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
import os
from typing import Optional

# Email configuration from environment
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@aira.app")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Email templates
VERIFICATION_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #4B9EFF 0%, #9B5CFF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #9B5CFF 0%, #7B4FFF 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">AIRA</div>
        <h2>Verify Your Email</h2>
        <p>Hi {{ username }},</p>
        <p>Thanks for signing up! Please verify your email address to get started with AIRA.</p>
        <a href="{{ verification_url }}" class="button">Verify Email Address</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; font-size: 14px;">{{ verification_url }}</p>
        <div class="footer">
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
    </div>
</body>
</html>
"""

RESET_PASSWORD_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #4B9EFF 0%, #9B5CFF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #9B5CFF 0%, #7B4FFF 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">AIRA</div>
        <h2>Reset Your Password</h2>
        <p>Hi {{ username }},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <a href="{{ reset_url }}" class="button">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; font-size: 14px;">{{ reset_url }}</p>
        <div class="footer">
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
    </div>
</body>
</html>
"""

class EmailService:
    def __init__(self):
        self.smtp_host = SMTP_HOST
        self.smtp_port = SMTP_PORT
        self.smtp_user = SMTP_USER
        self.smtp_password = SMTP_PASSWORD
        self.from_email = FROM_EMAIL

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """
        Send an email using SMTP

        Returns:
            True if sent successfully, False otherwise
        """
        # Skip if SMTP not configured (development mode)
        if not self.smtp_user or not self.smtp_password:
            print(f"\n📧 Email would be sent to: {to_email}")
            print(f"Subject: {subject}")
            print(f"Content: {html_content[:200]}...")
            return True

        try:
            message = MIMEMultipart("alternative")
            message["From"] = self.from_email
            message["To"] = to_email
            message["Subject"] = subject

            # Add plain text version
            if text_content:
                part1 = MIMEText(text_content, "plain")
                message.attach(part1)

            # Add HTML version
            part2 = MIMEText(html_content, "html")
            message.attach(part2)

            # Send email
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_user,
                password=self.smtp_password,
                start_tls=True
            )

            return True

        except Exception as e:
            print(f"❌ Failed to send email: {str(e)}")
            return False

    async def send_verification_email(
        self,
        to_email: str,
        username: str,
        verification_token: str
    ) -> bool:
        """Send email verification"""
        verification_url = f"{FRONTEND_URL}/verify-email?token={verification_token}"

        template = Template(VERIFICATION_TEMPLATE)
        html_content = template.render(
            username=username,
            verification_url=verification_url
        )

        return await self.send_email(
            to_email=to_email,
            subject="Verify your AIRA account",
            html_content=html_content,
            text_content=f"Verify your email: {verification_url}"
        )

    async def send_password_reset_email(
        self,
        to_email: str,
        username: str,
        reset_token: str
    ) -> bool:
        """Send password reset email"""
        reset_url = f"{FRONTEND_URL}/reset-password?token={reset_token}"

        template = Template(RESET_PASSWORD_TEMPLATE)
        html_content = template.render(
            username=username,
            reset_url=reset_url
        )

        return await self.send_email(
            to_email=to_email,
            subject="Reset your AIRA password",
            html_content=html_content,
            text_content=f"Reset your password: {reset_url}"
        )

    async def send_welcome_email(
        self,
        to_email: str,
        username: str
    ) -> bool:
        """Send welcome email after verification"""
        html_content = f"""
        <html>
            <body style="font-family: sans-serif; padding: 20px;">
                <h2>Welcome to AIRA!</h2>
                <p>Hi {username},</p>
                <p>Your email has been verified successfully. You're all set to start using AIRA!</p>
                <p><a href="{FRONTEND_URL}">Get Started</a></p>
            </body>
        </html>
        """

        return await self.send_email(
            to_email=to_email,
            subject="Welcome to AIRA!",
            html_content=html_content
        )
