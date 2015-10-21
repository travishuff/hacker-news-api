# Unit 8 building an API

##Summary
Node-API is the beginning of an incredible project - you will be constructing an API from scratch. This section will be broken down into these components:
- Unit 8 : Node-API
  Scrape data
- Unit 9: Angular
  Create a launch page for your API. This page will contain a home page, documentation page, and a guide to get started
- Unit 10: Authentication
  Users can login and logout
- Unit 10: Database
  Store user account information


In this challenge, we will scrape data from a website, parsing the content. A user should be able to make a GET request to one of your routes, and your server should respond with the data you scraped.

## APIs

>We're entering a new world in which data may be more important than software -Tim O'Reilly

Creating JSON apis allows us to do something really awesome. We can separate how our data is **created** and sent out from how it is **displayed** and used. 

Figuring out how to send out json data in response to HTTP requests is a crucial part of modern web applications. Everything from twitter, to etsy to pinterest use internal apis to release their content. 

This means that you can use react to display your JSON data one day, and then a year from now switch to something else without having to refactor your **server-side** code. After all, its just JSON data.

---

In this challenge, we're going to be scraping an external site, parsing their html, converting it into JSON and returning that JSON data.

# Web scraping
Web scraping is making an HTML request, and pulling out data from the response. We web scrape all the time with our eyes we just don't know that we're doing it
We go to a web page and parse it to extract the data that is relevant to us.

> How Can Mirrors Be Real If Our Eyes Aren't Real - Jaden Smith

We are going to use a module called [cheerio](https://github.com/cheeriojs/cheerio) to help us do this. Cheerio allows developers to interact with pages on the server similar to the way they interact with the DOM using jQuery. There are tons of great guides out there to help you figure it out, their docs are very helpful as well.

##Getting started

- Set Up
  - [ ] Figure out with your partner what site you want to scrape/what data you want to return.
  - [ ] Run npm install in your terminal to install external dependencies.
- Basic API (use `npm test` to test your solutions for this section)
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


##How do I test if my answer is correct?
There are two ways to test your code
1. Visit your route in your browser. The browser sends an http GET request to your route. Your server should respond with the data you scraped.

1. Run ```npm test``` in your terminal




# Links and Resources
<https://blog.hartleybrody.com/web-scraping/>
