from django.core.management import call_command


def send_mail_job():
    call_command("send_queued_mail")


def delete_mail_job():
    call_command("cleanup_mail", "--days=30", "--delete-attachments")
