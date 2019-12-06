const puppeteer = require('puppeteer');
// I used puppeteer for this challenge. I've never done web scraping before, everything below is derived from the documentation and youtube tutorials.
// https://pptr.dev
// https://www.scrapehero.com/how-to-build-a-web-scraper-using-puppeteer-and-node-js/
// https://www.youtube.com/watch?v=ARt3zDHSsd4
// https://www.youtube.com/watch?v=seeK5v01p48


// my idea with masterReview is to have an array that reviews[] is pushed into each time I go click forward in the webpages.
// var masterReview = [];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  
  // puppeteer is a "headless" version of chrome, I create an instance of it above and direct it to the website below.

  // I don't like hardcoding with a for loop here, I would prefer to use an if statement where 
  // if (reviews.length < 50) { click next page, scrape page } 
  // else { sort reviews }
  // However I am having a serious issue with hoisting variable in the async function. I don't want to declare masterReview in the asynch function
  // as it will get erased everytime masterReview = []; is called, however if I declare it outside the function then I get a variable undefined error.

  for (i = 1; i < 6; i++)
  {
  await page.goto(`https://www.dealerrater.com/dealer/McKaig-Chevrolet-Buick-A-Dealer-For-The-People-dealer-reviews-23685/page${i}/?filter=ALL_REVIEWS#link`,
  {waitUntil: 'networkidle2'}); // network idle2 makes async wait until there is no more network activity
  
  let reviewData = await page.evaluate(() => {
    let reviews = [];
    
    // I want to make  everything below a function, then implement an if statement. after this runs through, if (reviews.length < 50) click to the next page and run the function again, else {sort reviews}
    
    // find the review elements in the html
    let reviewsNodes = document.querySelectorAll('div.review-entry.col-xs-12.text-left.pad-none.pad-top-lg.border-bottom-teal-lt');
    
    // For each review I iterate through and find specific divs to add to the reviewJson. Each time it completes this element is pushed to the review array and gets overwritten.
    reviewsNodes.forEach((reviewElement) => {
      let reviewJson ={};
      try {

        // I figured if a review is "overly positive" then it will have 5 stars. 
        // This div below is for 5 star ratings, and all other ratings will be filtered out later.
        if(reviewElement.querySelector('.rating-static.hidden-xs.rating-50.margin-center')) {
          reviewJson.rating = '5 Stars';
        }
        else {
          reviewJson.rating = 'not perfect';
        }
        reviewJson.name = reviewElement.querySelector('.italic.font-18.black.notranslate').innerText;
        reviewJson.review = reviewElement.querySelector('.font-16.review-content.margin-bottom-none.line-height-25').innerText;
        reviewJson.date = reviewElement.querySelector('.italic.col-xs-6.col-sm-12.pad-none.margin-none.font-20').innerText;
      }
      catch(exception){
        
      }
      reviews.push(reviewJson);
    });
    // for some reason masterReview is undefined in the function. I can't seem to reference it properly due to hoisting.
    // masterReview.push(reviews);
    // return masterReview;
    // SortReviews(reviews);
    return reviews;
  }) 
  
  console.dir(reviewData);
  
}
await browser.close();
console.log('shutting down puppeteer...');
})();

// I want to implement this sorting function, however I think it is first important to have a masterReview array that contains all 50 reviews.
// The idea is that I first filter out all the non 5 star reviews, and then I sort the reviews according to their length. 
// The most "overly positive" reviews would be the 3 longest reviews with a 5 star rating.
const SortReviews = (reviews) => {

  // this removes all non 5 star reviews from the array.
  for (i = 0; i < reviews.length; i++)
  if (reviews[i][0] != '5 stars')
  {
    reviews.splice(i);
  }

  // a[2] and b[2] are the reviews themselves. The longer reviews should get moved to the front of the array.
  let sortedReviews = reviews.sort( (a, b) => {
    // I think the issue here is that a[2] is serveral strings being added together, i.e. "string1" + "string2" + "sting3", so a[2].length is undefined.
    var A = a[2].length;
    var B = b[2].length;
    if (A - B < 0) {
      return -1;
    }
    if (A - B > 0) {
      return 1;
    }
    else {
      return 0
    }
  });
  // When I run the function above, it is undefined.
  return sortedReviews;
}



