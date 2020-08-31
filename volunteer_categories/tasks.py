import time
import urllib.request
import urllib.error
import os
from .cron import send_mail_job, delete_mail_job

SECONDS_IN_A_MINUTE = 60


def mail_task(interval):
    while True:
        send_mail_job()
        time.sleep(interval)


if __name__ == "__main__":
    INTERVAL = os.getenv("MINUTE_INTERVAL") or 2
    mail_task(INTERVAL * SECONDS_IN_A_MINUTE)
