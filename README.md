# Prequisites

- Node >= v18

# Setup
Included in this repo is a backend server in express and a front-end [React](https://react.dev/) project setup using [Vite](https://vitejs.dev/). 

Below are instructions to get both running.

Backend server:
You will need to provide a YELP API key using a `YELPAPIKEY` environment variable before starting the backend.


```sh
export YELPAPIKEY=[YOURKEYHERE]

cd /server 

npm install

npm run dev
```

Frontend:

```sh
cd /app 

npm install

npm run dev
```

Once both are running you should be able to go to `http://127.0.0.1:5173/` in your browser to see the app.

# Project Summary

My approach to this project was to find as many pre-built components and libraries I could to speed development time and focus on getting an acceptable user experience. One of the primary focus area managing load on the YELP API through caching on the backend layer and attempted caching on the front-end. I also wanted to be able organize the data with as few clicks as possible. To me that meant avoiding dropdowns or submenus. I wanted a flat user experience with a focus on getting data quickly and manipulating it easily

## Caching and Config

My main concern with managing the API load both on YELP and the backend server. An in-memory cache with the server would be fine up until a certain level of traffic then maybe a distributed cache would be more reasonable. For configuring the server and front-end I tried to use config files as much as possible to make it easy to add stuff later.

## Areas of Improvement

One area I would like to improve is how loading new items are handled. It is not obvious that new items have loaded until you scroll, an animation or automatic scroll nudge would have been ideal to alert the user to new items in the stream.

I sacrificed some polish on the front-end to spend more time getting the backend right. I didn't implement any kind of testing either, so that would be good to implement too. I would have liked to make the config for locations shared so that the front-end could load it from the backend instead of maintaining its own config.

I also tried to make the front-end en code somewhat modular but I think more can be done there to seperate data fetching logic from the display logic. For smaller projects I find it easier to be a little less modular to start and increase modularity as complexity grows as you take better advantage of component reuse.

## Questions
 
I used a static search term for the YELP search, but that could be moved into a config variable. I am also curious how the different search terms affect response and if different results show up based on that and what would be the best way to deal with that.

## Backend

I built out the backend API first and testing it out in a browser to make sure it was returning the correct data based on the location and filtering criteria we wanted.

One of my main concerns was making sure not to overwhelm the yelp API with to many requests since each API key has limited number of calls. Also the kind of data we are retrieving is not particularly volatile so caching for longer periods seems acceptable. After making sure I was retreiving the right data I added a basic in-memory cache to prevent hitting the YELP API on every request and used cache keys based on filtering criteria and paging. I tried to implment some reasonable level of logging so that while I was developing the front-end I could see what was happening in the backend.

## Frontend

I mapped out the basic layout I wanted for the app to fulfill the requirements and provide a decent user experience. Once I setup the skeleton with Vite I decied to use Material Design React component library and search through there for the different parts I would need.

My goal was to try and make things as simple as possible and take from component examples and modify them as needed. As on the backend one of my concerns was caching of request as to not hit API so much. Even though the library I chose to handle data fetching, claims built in caching, it doesn't appear to be working properly. I would need to investigate it further to understand what is happening there.
