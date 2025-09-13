from django.db import models

# Create your models here.
from django.conf import settings

class Task(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tasks'
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    due_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner']),
            models.Index(fields=['status']),
            models.Index(fields=['due_date']),
        ]

    def __str__(self):
        return f'{self.title} [{self.status}] - {self.owner}'