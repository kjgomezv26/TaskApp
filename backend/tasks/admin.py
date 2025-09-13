from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "status", "owner", "due_date", "created_at")
    list_filter = ("status", "owner")
    search_fields = ("title", "description", "owner__username")
    ordering = ("-created_at",)
