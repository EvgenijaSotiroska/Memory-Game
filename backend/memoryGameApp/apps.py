from django.apps import AppConfig


class MemorygameappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'memoryGameApp'

    def ready(self):
        import memoryGameApp.signals
        import memoryGameApp.task
