<!-- PROJECT SHIELDS -->

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h2 align="center">Myntra Hackerramp: Collaborative Shopping</h3>
  <h3 align="center">Gaussian Noise</h4> <br/><br/>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li><a href="#built-with">Built With</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
  </ol>
</details>

<br/>

<!-- ABOUT THE PROJECT -->
## About The Project

This is a solution to the problem statement of "Collaborative Shopping" by Myntra. We have built a platform that allows you to communicate with friends, family and co-shoppers as you browse the products in Myntra's site. The platform offers you the following features.

Features: <br/>
### Public Lounges
Any shopper can join a public lounge (can be based on apperal) and find company while shopping.
### Private Party 
Only close friends having the unique Room ID can join the private party.
<br/>
<br/>

### Relaxed Mode
Features that do not need your presence for communication with co-shopperd

* Chat
* Poll on Item
* Suggest Item to a fellow shopper
* Make a Downloadable Wishlist 
* Open Myntra Website

### Real-Time Mode
Features than enable online interaction with co-shoppers

* (Show or Hide) Video
* (Mute or Unmute) Audio
* Screen-Share with a zoom in Feature on the screen

### Chrome Extension
The above features have been enable via a chrome extension for easier access while browsing on Myntra as well. 

<br/><br/>
Members of the team:
* [Mansi Nanavati](https://github.com/glitched-shadeslayer)
* [Nandita LT](https://github.com/Nanditalt07)
* [Soumi Chakraborty](https://github.com/boredtea)

## Built With

The major frameworks that are used to build this project are:
* [Twilio](https://www.twilio.com/) - To set up API that forms the backend storing usernames, Room names. It is even used to add video, audio and chat tracks in the application.
* Vanilla JS - To carry out the functionality of the buttons. It even communicates with the API to facilitate login and polling.
* HTML, CSS, [Bootstrap](https://getbootstrap.com) - The frontend is built using HTML, CSS and CSS by Bootstrap.
* [Flask](https://flask.palletsprojects.com/en/1.1.x/) - It is used to run the app in python.



<!-- GETTING STARTED -->
## Getting Started

The following are the instructions to be followed while setting up the application locally. Once you have set it up, check out the demo.

1. Clone the repo
   ```sh
   git clone https://github.com/boredtea/gaussian-noise.git
   ```
3. Go to the required directory
   ```sh
   cd gaussian-noise
   ```
3. The application includes a file named .env.template which includes the three configuration variables needed. These are the private values of API. Ideally, the .env shouldn't be public, but for the purpose of the hackathon, we've pushed the .env file as well.
4. Create and start a Python virtual environment
   ```sh
   python -m venv venv
   venv\Scripts\activate (for windows)
   source venv\bin\activate (for linux)

   ```
5. Run the application using flask
   ```sh
   python wsgi.py
   ```
   The application is now running on [http://localhost:5000/](http://localhost:5000/). Head over to localhost:5000 in your machine.
6. Alternatively, the application has been deployed on [Heroku](https://gaussian-noise.herokuapp.com/).

## Setting up the Chrome Extension

Follow these steps to set up the chrome extension for this application:
1. Go to [chrome://extensions/](chrome://extensions/) and switch on the Developer Mode.

2. Click on **load unpacked**, and upload the **static** folder from the repo.

3. And that's it! The extension should now appear along with your other chrome extensions on Chrome.



## Demo
1. Home page displaying Public and Private lounges<img src="images/index.png" alt="index"> 
2. Rooms in public lounge<img src="images/lounge.png" alt="index"> 
2. Enter username<img src="images/username.png" alt="index"> 
2. Relaxed Mode<img src="images/relaxed.png" alt="index"> 
2. Wishlist<img src="images/wishlist.png" alt="index"> 
2. Save wishlist before leaving call<img src="images/save.png" alt="index"> 
2. Live mode<img src="images/live.png" alt="index"> 
2. Poll<img src="images/poll.png" alt="index"> 
2. Poll results<img src="images/result.png" alt="index"> 
2. Enter unique room name in private parties<img src="images/room.png" alt="index"> 
