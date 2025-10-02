from .email import send_best_score_email

def send_best_score_email_cron():
    send_best_score_email()