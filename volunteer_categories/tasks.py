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
    # Force line-buffered stdout/stderr. When this runs as a PythonAnywhere
    # always-on task, stdout/stderr are not a TTY, so Python block-buffers them
    # (~4-8 KB). This loop only emits a short post_office log line per interval,
    # so that buffer fills very slowly and the output never visibly reaches the
    # task log. Line buffering flushes each line immediately so the mail-job
    # logs show up in the task log as they happen.
    for _stream in (sys.stdout, sys.stderr):
        if hasattr(_stream, "reconfigure"):
            _stream.reconfigure(line_buffering=True)

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
    except (TypeError, ValueError):
        INTERVAL = 5
    mail_task(INTERVAL * SECONDS_IN_A_MINUTE)
