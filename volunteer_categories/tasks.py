import time
import os
import sys
from django.core.management import call_command


def send_mail_job():
    call_command("send_queued_mail")


SECONDS_IN_A_MINUTE = 60


def mail_task(interval):
    while True:
        send_mail_job()
        time.sleep(interval)


if __name__ == "__main__":
    path = os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )  #'/home/ufest/workspace/UFestVolunteerSite'
    if path not in sys.path:
        sys.path.append(path)

    os.environ["DJANGO_SETTINGS_MODULE"] = "backend.settings"

    import django

    django.setup()

    try:
        INTERVAL = int(os.getenv("MINUTE_INTERVAL"))
    except:
        INTERVAL = 5
    mail_task(INTERVAL * SECONDS_IN_A_MINUTE)
