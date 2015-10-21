# Unit 8 - Building an API in Node

##Summary

In this unit you will be constructing an API from scratch by 'scraping' a website page's data and making it easily accessible at a 'route' for other developers

---

## Learning Goals

* Learning what a server is and does
* Understand what an API is and how to build one
* Learn how to find the data you need and properly scrape a website
* Understand the importance of good documentation to encourage developers to use your API

---

###What is an API?

For our purposes an API can be thought of as a destination that we or other developers can go to and get data from in a standardised way. 

For example, *without an API*, if I wanted to get the latest weather from Weather.com I would go to Weather.com and worry about how the layout or formatting has changed if I want to grab the latest 7 days' weather. 

Now if Weather.com has made their weather information available as an 'API', I can go to the right address, e.g. weather.com/api?los-angeles&last-7-days and I will always get back a nice tidy set of data with the last 7 days of weather from Los Angeles.

Even better, that data is stored in a common format, that is easy to use and manipulate in JavaScript, known as JSON - [MDN - JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

###What are we doing with our API?

Our goal is to 'scrape' a website page (or pages) and make some portion of its contents available in a tidy (JSON) format at an address (an 'endpoint') - this is our API. Other developers that wanted to use the information from the site we scraped can now access the data in a very predictable tidy way from our API

You can see an example of Spotify's API endpoints [here](https://developer.spotify.com/web-api/endpoint-reference/)

The best APIs have great documentation and often have a simple but compelling launch page. In Unit 10 you will build the launch page for your API. In Unit 11, you will make sure other developers using your API have to login first so they don't use it execssively (known as authentication) and in Unit 12 you will set up the database to store user account information for your API users.

A user should be able to make a GET request to one of your routes (endpoints), and your server should respond with the data you scraped.

---

## Things to look out for

* As you scrape, you should consider that the DOM does not always load all at once and may use JavaScript to populate its content
* Investigate the http status code of the response you get when scrape a site - 200 is a success, others might require more thought [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
* You should expect to spend a lot of time closely reading the [node documentation](https://nodejs.org/api/) directly but balance this by looking at others' notes on how to navigate Node e.g. [Scraping with node](http://maxogden.com/scraping-with-node.html)

---

In this challenge, we're going to be scraping an external site, parsing their html, converting it into JSON and making that JSON data available at an 'endpoint' (a route)

We are going to use a module in node called [cheerio](https://github.com/cheeriojs/cheerio) to help us do this. Node gives us access to lots of free pre-written code for us (packages) through a service known as [npm](http://npmjs.com). We can install these packages for our project [Installing npm packages locally](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)

[Cheerio](https://github.com/cheeriojs/cheerio) is an npm packages that allows developers to interact with pages on the server similar to the way they interact with the DOM using jQuery

##Getting started

- Set Up
  - [ ] Figure out with your partner what site you want to scrape/what data you want to return.
  - [ ] Run npm install in your terminal to install external dependencies.
- Basic API (use `npm test` to test your solutions for this section) You may also visit your route in your browser. The browser sends an http GET request to your route. Your server should respond.
  - [ ] Add a root route `/` to your Express server so that your server responds to requests to `http://localhost:3000/`
  - [ ] Configure your server to respond with Content-Type JSON for requests to the `/` route
  - [ ] Add at least two total endpoints to your server
  - [ ] Allow [Cross-Origin-Resource-Sharing](http://enable-cors.org/) on your server in order to allow your API to respond to requests from anywhere, not just from your own computer
- Advanced API: Scraping
  - [ ] When a request to one of your endpoints comes in, have your server retrieve HTML from another site (you can build upon the starting code provided in `scraper.js`)
  - [ ] After retrieving the HTML, use Cheerio to navigate through the HTML and pick out the bits of information that you want for your API, then bundle that information into a JavaScript object
  - [ ] Have your server respond to requests to your endpoint with your newly created object
  - [ ] Have your second endpoint scrape a different site and respond with a JSON formatted response just like the previous endpoint
- Scraping Pt. 2
  - [ ] Sometimes it's necessary to follow a link when scraping in order to gather more information from the new location. Modify one of your endpoints to follow at least one URL from the original page it's scraping, and then scrape that page as well. Make sure you fully populate your results object before sending your response (remember: Node HTTP requests are asynchronous - use your callbacks!)
  - [ ] You might notice that as your scraper follows other URLs to new locations, its speed drastically decreases with each new HTTP request it must wait for. Implement server-side caching for your routes so that a request sent within 5 minutes of a previous request to the same route will be responded to with the cached content from the first request.

###Bonus

1. Have your API gather data from more than one site.
  * Example: a GET request to /cats gets a list of cats pictures from three different sites
1. Add additional routes 
  * Examples: a GET request to /cats, /dogs, /people


# Additional Links and Resources
<https://blog.hartleybrody.com/web-scraping/>
<https://en.wikipedia.org/wiki/List_of_HTTP_status_codes>
<http://maxogden.com/scraping-with-node.html>
<http://www.smashingmagazine.com/2015/04/web-scraping-with-nodejs/>
<http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/>
<https://nodejs.org/api/http.html>
