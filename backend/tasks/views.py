from django.contrib.auth.models import User
from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils.dateparse import parse_date

from .models import Task
from .serializers import TaskSerializer, UserRegisterSerializer
from .permissions import IsOwner

class TaskViewSet(viewsets.ModelViewSet):
    
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        qs = Task.objects.filter(owner=self.request.user).order_by('-created_at')

        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)

        due_before = self.request.query_params.get('due_before')
        if due_before and parse_date(due_before):
            qs = qs.filter(due_date__lte=due_before)

        due_after = self.request.query_params.get('due_after')
        if due_after and parse_date(due_after):
            qs = qs.filter(due_date__gte=due_after)

        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class RegisterView(generics.CreateAPIView):
    
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]
