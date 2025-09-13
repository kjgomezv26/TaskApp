from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Task
        fields = [
            "id", "title", "description", "status",
            "created_at", "updated_at", "due_date", "owner"
        ]
        read_only_fields = ["created_at", "updated_at", "owner"]
