from apscheduler.schedulers.background import BackgroundScheduler
from memoryGameApp.email import send_best_score_email

scheduler = BackgroundScheduler(timezone="Europe/Berlin")  
scheduler.add_job(send_best_score_email, 'cron', hour=10, minute=0)
scheduler.start()
