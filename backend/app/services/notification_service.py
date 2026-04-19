import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from loguru import logger
import httpx
from app.core.config import settings

class NotificationService:
    @staticmethod
    async def send_email_smtp(to_email: str, subject: str, body_html: str) -> bool:
        """
        Sends an email using standard SMTP (Free with Gmail App Passwords).
        """
        if not settings.SMTP_EMAIL or not settings.SMTP_PASSWORD:
            logger.warning("SMTP credentials missing. Email delivery skipped.")
            return False

        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_EMAIL
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body_html, 'html'))

            # Use explicit timeout to prevent hanging during connect
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
                server.starttls()
                server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
                server.send_message(msg)
            
            logger.info(f"Email successfully sent to {to_email} via SMTP")
            return True
        except Exception as e:
            logger.error(f"SMTP error: {e}")
            return False

    @staticmethod
    def log_loud_mock(identifier: str, type: str, content: str):
        """
        Prints a highly visible box in the console for hackathon demos
        when real delivery is skipped/unavailable.
        """
        border = "*" * 50
        logger.info(f"\n{border}\n[MOCK {type.upper()}] TO: {identifier}\nCONTENT: {content}\n{border}")
