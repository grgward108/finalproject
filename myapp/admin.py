from django.contrib import admin
from .models import User, Member, Gossip, Movies, YoutubeVideos, Music
# Register your models here.

admin.site.register(User)
admin.site.register(Member)
admin.site.register(Gossip)
admin.site.register(Movies)
admin.site.register(YoutubeVideos)
admin.site.register(Music)