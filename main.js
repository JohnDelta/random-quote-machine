const QuoteBox = ".quote-wrapper";
const QuoteText = "#text";
const QuoteButton = "#new-quote";
const QuoteAuthor = "#author";
const TweetQuote = "#tweet-quote";
const TumblrQuote = "#tumblr-quote";

var quotesData = undefined;
let counter = 0;
let selectedQuote = "";
let selectedAuthor = "";

/*
	-- Post tweet link
	'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="quote"-Author';
	
	-- Post on Tumblr
	https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption='author'&content='quote'&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button
	
*/

/*
	This function takes as argument an object (QuoteBox) to rotate in the Y axis.
	At the 3/4sec of the rotation it calls the addNewQuote() function to 
	change the quote. Also, when the animation is enabled the button
	becomes unable to press.
	
	obj : the object to rotate in the Y axis.
	now : the degrees of the rotation.
	addNewQuote() : the function to change the quote.
	counter : determines the time in which the quote will change.
		every counter step unit is a 1/10 sec.
*/
const objectRotateY = (obj) => {
	$(obj).animate(
		{
			now : "+=360"
		},
		{
			duration : 1000,
			step : function(now,fx) {
				counter++;
				$(this).css({
					"transform" : "rotateY("+now+"deg)",
				});
				if(counter == 45) {
					addNewQuote();
					counter = 0;
				}
			},
			easing : "swing",
			complete : function() {
				$(QuoteButton).prop("disabled",false);
				objectRotateZ(QuoteButton,false);
				counter = 0;
			}
		}
	);
};

const objectRotateZ = (obj,play) => {
	if(play) {
		$(obj).removeClass("animation-paused").addClass("animation-running");
	} else {
		$(obj).removeClass("animation-running").addClass("animation-paused");
	}
}

const addNewQuote = () => {
	var quoteValue = getRandomQuote();
	$(QuoteText).html(quoteValue.quote);
	$(QuoteAuthor).html(quoteValue.author);
	selectedQuote = quoteValue.quote;
	selectedAuthor = quoteValue.author;
	updateTweetQuoteLink();
	updateTumblrQuoteLink();
};

/*
	Returns array of quotes and their authors.
	Basic keys: 
	.quotes
	.quote
	.author
*/

let getQuotes = () => {
	$.ajax({
		headers: {
		  Accept: "application/json"
		},
		url: 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json',
		success: function(jsonQuotes) {
		  if (typeof jsonQuotes === 'string') {
			quotesData = JSON.parse(jsonQuotes);
			addNewQuote();
		  }
		}
	});
}

const getRandomQuote = () => {
	return quotesData.quotes[Math.floor(Math.random() * quotesData.quotes.length)];
}

// url to twitter with a tweet which includes the current quote
const updateTweetQuoteLink = () => {
	$(TweetQuote).attr("href","https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=\""+selectedQuote+"\"-"+selectedAuthor);
}

const updateTumblrQuoteLink = () => {
	$(TumblrQuote).attr("href","https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption='"+selectedAuthor+"'&content='"+selectedQuote+"'&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button");
}

$(document).ready(function() {
	getQuotes();
	
	$(QuoteButton).click(() => {
		$(QuoteButton).prop("disabled",true);
		objectRotateZ(QuoteButton,true);
		objectRotateY(QuoteBox,true);
	});
	
	$(TweetQuote).click(() => {
		tweetQuote();
	});
	
});


