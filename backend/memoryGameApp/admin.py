from django.contrib import admin
from .models import Event
from django.urls import path
from django.shortcuts import redirect
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

    change_list_template = "admin/scores_change_list.html"  
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "export-csv/", 
                self.admin_site.admin_view(self.export_csv),
                name="memorygameapp_score_export_csv",  
            ),
        ]
        return custom_urls + urls

    def export_csv(self, request):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(
            content_type='text/csv',
            headers={'Content-Disposition': 'attachment; filename="scores.csv"'},
        )
        writer = csv.writer(response, delimiter=';')
        writer.writerow(["Rank", "Player", "Score"])
        
        for idx, score in enumerate(Score.objects.all(), start=1):
            writer.writerow([idx, score.user.username, score.points])
        
        return response

    

   
