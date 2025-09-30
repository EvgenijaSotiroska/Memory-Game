from django.shortcuts import render
from datetime import datetime
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from .models import Profile, Event, Score
from .serializers import ProfileSerializer, EventSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'User registered'}, status=status.HTTP_201_CREATED)

class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    return Response({'username': request.user.username})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_score(request):
    profile = Profile.objects.get(user=request.user)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_score(request):
    user = request.user
    points = int(request.data.get('points', 0))
    level = int(request.data.get('level', 1))

    score_entry = Score.objects.create(user=user, level=level, points=points)

    profile, created = Profile.objects.get_or_create(user=user)
    profile.score += points
    profile.save()

    return Response({
        "message": "Score updated successfully",
        "user": user.username,
        "level": level,
        "points": points,
        "total_score": profile.score,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_events(request):
    date_str = request.GET.get('date')  # e.g., "2025-09-25"
    
    if date_str:
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            events = Event.objects.filter(date=date_obj)
        except ValueError:
            return Response({"detail": "Invalid date format. Use YYYY-MM-DD."}, status=400)
    else:
        events = Event.objects.all()
    
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_event(request):
    serializer = EventSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({"detail": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.user not in event.attendees.all():
        event.attendees.add(request.user)
        event.save()
    serializer = EventSerializer(event)
    return Response(serializer.data, status=200)



def leaderboard_api(request):
    level = request.GET.get("level")
    period = request.GET.get("period", "all")

    scores = Score.objects.all()

    if level:
        try:
            scores = scores.filter(level=int(level))
        except ValueError:
            pass

    now = timezone.now()
    if period == "monthly":
        scores = scores.filter(created_at__month=now.month, created_at__year=now.year)
    elif period == "yearly":
        scores = scores.filter(created_at__year=now.year)

    leaderboard = (
        scores.values("user__username")
        .annotate(total_score=Sum("points"))
        .order_by("-total_score")[:10]
    )

    return JsonResponse(list(leaderboard), safe=False)