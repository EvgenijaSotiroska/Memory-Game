from django.urls import path
from .views import RegisterView, LoginView
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('get_current_user/', views.get_current_user),
    path('get_score/', views.get_score),
    path('update_score/', views.update_score),
    path('events/', views.get_events, name='get_events'),
    path('events/add/', views.add_event, name='add_event'),
    path('events/<int:event_id>/apply/', views.apply_event, name='apply-event'),
    path("leaderboard/", views.leaderboard_api, name="leaderboard_api"),
]
