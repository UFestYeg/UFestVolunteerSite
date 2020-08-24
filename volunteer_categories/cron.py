import subprocess
from django.core.management import call_command


def send_mail_job():
    # pipenv shell; python manage.py send_queued_mail
    # subprocess.call(["sh", "./test.sh"])
    print("in job")
    call_command("send_queued_mail")
