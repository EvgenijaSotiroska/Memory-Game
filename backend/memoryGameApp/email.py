import subprocess
from django.core.mail import send_mail
from django.template.loader import render_to_string
from .models import Score
from django.utils import timezone
from datetime import timedelta
import os

def render_mjml(mjml_content: str) -> str:
    mjml_cmd = r"C:\Users\iSource\AppData\Roaming\npm\mjml.cmd"
    result = subprocess.run(
        [mjml_cmd, "--stdin"],
        input=mjml_content,
        text=True,
        capture_output=True,
        shell=True
    )
    if result.returncode != 0:
        print("MJML error:", result.stderr)
        return mjml_content
    return result.stdout


def send_best_score_email():
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)
    best_score = Score.objects.filter(created_at__date=yesterday).order_by('-points').first()

    if not best_score:
        print("No scores found yesterday.")
        return

    mjml_template = render_to_string("emails/bestscore.mjml", {
        "username": best_score.user.username,
        "points": best_score.points,
    })

    html_content = render_mjml(mjml_template)
    print("HTML content generated:\n", html_content)

    send_mail(
        subject="Daily Top Score 🏆",
        message="Your email client does not support HTML",
        from_email="noreply@example.com",
        recipient_list=["test@example.com"], #should be the recipient email
        html_message=html_content,
    )
    print(f"Email sent to {best_score.user.username}")

