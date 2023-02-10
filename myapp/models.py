from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import datetime


class User(AbstractUser):
    pass

class Member(models.Model):
    member = models.OneToOneField(User, on_delete= models.CASCADE, related_name="users")
    isactive = models.BooleanField(default = False)
    isadmin = models.BooleanField(default = False)
    bio = models.TextField(max_length= 500, blank=True)
    profilepicture = models.URLField(max_length = 300, default="https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png")

    def __str__(self):
          return f"{self.member}"

@receiver(post_save, sender=User)
def create_member(sender, instance, created, **kwargs):
    if created:
        Member.objects.create(member=instance)

class Gossip(models.Model):
    poster = models.ForeignKey(Member, null=True, on_delete= models.SET_NULL, related_name="gossippostings")
    postdate = models.DateTimeField()
    post = models.CharField(max_length = 250)
    keyword = models.CharField(max_length = 200, default="gossip")

    def __str__(self):
          return f"{self.poster}, {self.postdate}"
    

class Movies(models.Model):
    poster = models.ForeignKey(Member, on_delete= models.CASCADE, related_name="moviepostings")
    postdate = models.DateTimeField()
    impressions = models.CharField(max_length= 250, blank=True)
    name = models.CharField(max_length = 200)
    overview = models.CharField(max_length = 200, blank=True)
    release_date = models.CharField(max_length = 50, blank=True)
    thumbnail = models.URLField(max_length = 200)
    keyword = models.CharField(max_length = 200, default="movie")

    def __str__(self):
          return f"{self.poster}, {self.postdate}"

class YoutubeVideos(models.Model):
    videoid = models.CharField(max_length = 250, default="AA")
    poster = models.ForeignKey(Member, on_delete= models.CASCADE, related_name="youtubepostings")
    postdate = models.DateTimeField()
    impressions = models.CharField(max_length= 250, blank=True)
    thumbnail = models.URLField(max_length = 200)
    name = models.CharField(max_length = 2000, blank=True)
    channel = models.CharField(max_length = 150)
    keyword = models.CharField(max_length = 200, default="youtubevideo")

    def __str__(self):
          return f"{self.poster}, {self.postdate}"

class Music(models.Model):
    poster = models.ForeignKey(Member, on_delete= models.CASCADE, related_name="musicpostings")
    postdate = models.DateTimeField(default = datetime.now)
    impressions = models.CharField(max_length= 250, blank=True)
    keyword = models.CharField(max_length = 200, default="music")
    previewurl = models.URLField(max_length= 200, default="https://p.scdn.co/mp3-preview/5a2b8b0d4cc595c371575a419288cd1799e3ed2c?cid=ba3f5e0f0bbb4b3e973df8367d56d100")
    thumbnail = models.URLField(max_length = 200, default="https://i.scdn.co/image/ab67616d0000b27336615a0a60523dd62135ab3a")
    album = models.CharField(max_length= 250, blank=True)
    songtitle = models.CharField(max_length= 250, blank=True)
    artist = models.CharField(max_length= 250, blank=True)

    def __str__(self):
          return f"{self.poster}, {self.postdate}"
