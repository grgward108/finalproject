from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("login/", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("adminview", views.admin, name="admin"),
    path("activate/<int:id>", views.activate, name="activate"),   
    path("spotify", views.spotify, name="spotify"),
    path("tmdb", views.tmdb, name="tmdb"),
    path("youtube", views.youtube, name="youtube"),
    path("makepostyoutube", views.makepostyoutube, name="makepostyoutube"),
    path("makepostmovie", views.makepostmovie, name="makepostmovie"),
    path("makepostmusic", views.makepostmusic, name="makepostmusic")

]