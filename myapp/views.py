from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from datetime import datetime
from django.core.paginator import Paginator
from django.urls import reverse
import json
from django.http import JsonResponse
from itertools import chain
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import User, Member, Gossip, Movies, YoutubeVideos, Music
from decouple import config
import os


@login_required
def index(request):

    allobjects = sorted(chain(
        Gossip.objects.filter(poster__isactive=True),
        Movies.objects.filter(poster__isactive=True),
        YoutubeVideos.objects.filter(poster__isactive=True),
        Music.objects.filter(poster__isactive=True),

    ), key=lambda instance: instance.postdate, reverse= True)

    a = request.user
    member = Member.objects.get(id = a.id)

    return render(request, 'mainfeed.html', {
        "allobjects" : allobjects,
        "member" : member
    })

def profile(request, username):

    
    userProfile = User.objects.get(username=username)
    member = Member.objects.get(id = userProfile.id)

    isuser = request.user == userProfile

    gossip_posts = Gossip.objects.filter(poster = userProfile.id)
    movie_posts = Movies.objects.filter(poster = userProfile.id)
    youtube_videos = YoutubeVideos.objects.filter(poster = userProfile.id)
    music_posts = Music.objects.filter(poster = userProfile.id)

    posts = sorted(chain(gossip_posts, movie_posts, youtube_videos, music_posts), key=lambda instance: instance.postdate, reverse=True)

    page = request.GET.get('page', 1)
    paginator = Paginator(posts, per_page=10)


    try:
        page_obj = paginator.get_page(page)
    except PageNotAnInteger:
        users = paginator.page(1)
    except EmptyPage:
        users = paginator.page(paginator.num_pages)

    data = {
        "author": userProfile,
        "page_obj" : page_obj,
        "isuser" : isuser,
        "member" : member
    }
    return render(request, "profile.html", data)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "register.html")


@csrf_exempt
@login_required
def makepostyoutube(request):
    if request.method == "GET":
        return HttpResponseRedirect(reverse("youtube"))


    if request.method == "POST":
        a = request.user
        member = Member.objects.get(id = a.id)
        postdate = datetime.now()
        impressions = request.POST["impressions"]
        thumbnail = request.POST["thumbnail"]
        videotitle = request.POST["videotitle"]
        channel = request.POST["channel"]
        videoid = request.POST["videoid"]

        newpost = YoutubeVideos(
            poster = member,
            videoid = videoid,
            postdate = postdate,
            impressions = impressions,
            thumbnail = thumbnail,
            name = videotitle,
            channel = channel
        )

        newpost.save()

        return HttpResponseRedirect(reverse("youtube"))

@csrf_exempt
@login_required
def makepostmusic(request):
    if request.method == "GET":
        return HttpResponseRedirect(reverse("spotify"))


    if request.method == "POST":
        a = request.user
        member = Member.objects.get(id = a.id)
        postdate = datetime.now()
        impressions = request.POST["impressions"]
        thumbnail = request.POST["thumbnail"]
        songtitle = request.POST["songtitle"]
        artist = request.POST["artist"]
        album = request.POST["album"]
        songpreview = request.POST["songpreview"]

        newpost = Music(
            poster = member,
            postdate = postdate,
            impressions = impressions,
            songtitle = songtitle,
            previewurl= songpreview,
            thumbnail = thumbnail,
            album = album,
            artist = artist,

        )

        newpost.save()

        return HttpResponseRedirect(reverse("spotify"))

@csrf_exempt
@login_required
def makepostmovie(request):
    if request.method == "GET":
        return HttpResponseRedirect(reverse("movie"))


    if request.method == "POST":
        a = request.user
        member = Member.objects.get(id = a.id)
        postdate = datetime.now()
        impressions = request.POST["impressions"]
        thumbnail = request.POST["thumbnail"]
        movietitle = request.POST["movietitle"]


        newpost = Movies(
            poster = member,
            postdate = postdate,
            impressions = impressions,
            thumbnail = thumbnail,
            name = movietitle,
        )

        newpost.save()

        return HttpResponseRedirect(reverse("tmdb"))


@login_required
def spotify(request):
    CLIENT_ID = os.getenv('CLIENT_ID')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')

    allobjects = sorted(chain(
        Music.objects.filter(poster__isactive=True),
    ), key=lambda instance: instance.postdate, reverse= True)


    a = request.user
    member = Member.objects.get(id = a.id)
    return render(request, 'spotify/spotify.html', {
        "allobjects" : allobjects,
        "member" : member,
        "client_id" : CLIENT_ID,
        "client_secret" : CLIENT_SECRET
    })

@login_required
def tmdb(request):

    API_KEY = os.getenv('API_KEY')
 
    allobjects = sorted(chain(
        Movies.objects.filter(poster__isactive=True),
    ), key=lambda instance: instance.postdate, reverse= True)

    a = request.user
    member = Member.objects.get(id = a.id)
    return render(request, 'tmdb/tmdb.html',{
        "member" : member,
        "allobjects" : allobjects,
        "api_key" : API_KEY
    })

@login_required
def youtube(request):

    YOUTUBE_API = os.getenv('YOUTUBE_API')
    
    allobjects = sorted(chain(
        YoutubeVideos.objects.filter(poster__isactive=True),
    ), key=lambda instance: instance.postdate, reverse= True)

    a = request.user
    member = Member.objects.get(id = a.id)
    return render(request, 'youtube/youtube.html',{
        "member" : member,
        "allobjects" : allobjects,
        "youtube_api": YOUTUBE_API
    })

def admin(request):

    member = Member.objects.all()

    return render(request, 'admin.html', {
        "member" : member
    })

def activate(request, id):
    member = Member.objects.get(id = id)

    if member.isactive:
        member.isactive= False

    else:
        member.isactive = True

    member.save()
    return HttpResponseRedirect(reverse("admin"))
    
