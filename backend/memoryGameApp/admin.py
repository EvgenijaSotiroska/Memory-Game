from django.contrib import admin
from .models import Event
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from django.contrib.admin.views.main import ChangeList
from .models import Score

# Register your models here.
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'user')  
    list_filter = ('date',)                   
    search_fields = ('title', 'description') 

    
admin.site.register(Event)



@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ("user", "level", "points", "created_at")
    list_filter = ("level", "created_at", "user")

    

   
