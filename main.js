// load a book brom disk
function loadBook(filename, displayName) {
    let currentBook = "";
    let url = "books/" + filename; // books is a folder

    //reset our UI
    document.getElementById("fileName").innerHTML = displayName; // h2 title in main content area
    document.getElementById("searchstat").innerHTML = ""; // Search Widget div at last
    document.getElementById("keyword").value = ""; // search input

    //create a server a request to load our book
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true); // true is for async requests
    xhr.send(); //If the request is asynchronous (which is the default),this method returns as soon as the request is sent 
    //and the result is delivered using events. If the request is synchronous, this method doesn't return until the response has arrived.


// onreadystatechange function is The readyState property holds the status of the XMLHttpRequest.
// The onreadystatechange property defines a function to be executed when the readyState changes.
// The status property and the statusText property holds the status of the XMLHttpRequest object.
    xhr.onreadystatechange = function () {
        //    ready state
        /*  0	     UNSENT	                  Client has been created. open() not called yet.
            1	     OPENED	                  open() has been called.
            2	     HEADERS_RECEIVED	      send() has been called, and headers and status are available.
            3	     LOADING	                  Downloading;responseText holds partial data.
            4	     DONE	                  The operation is complete. */

        if (xhr.readyState == 4 && xhr.status == 200) {
            currentBook = xhr.responseText;

            // to get stat of doc
            getDocStats(currentBook);

            // before printing the data to browser it ignore line break and white spaces
            // so to solve that remove line breaks and carriage returns and replace with a <br>
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            // set text of book to div 
            document.getElementById("fileContent").innerHTML = currentBook;

            // every time a document is loded the scrool will positioned from start
            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;

        }
    };
}

//get the stats for the book
function getDocStats(fileContent) {

    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let text = fileContent.toLowerCase();
    
    // it search a work "\b space  /S word \b space" 
    // array of words
    let wordArray = text.match(/\b\S+\b/g);

    // it's a dictionary (key(index) : value("word" , number of word) )
    // value contain two properties
    let wordDictionary = {};

    // array of words without stop words
    var uncommonWords = [];

    //filter out the uncommon words
    uncommonWords = filterStopWords(wordArray);


    //Count every word in the wordArray and putting it in wordDictionary
    for (let word in uncommonWords) {
        let wordValue = uncommonWords[word];
        if (wordDictionary[wordValue] > 0) {
            wordDictionary[wordValue] += 1;
        } else {
            wordDictionary[wordValue] = 1;
        }
    }

    //sort the array
    let wordList = sortProperties(wordDictionary);

    //Return the top 5 words
    var top5Words = wordList.slice(0, 6);
    //return the least 5 words
    var least5Words = wordList.slice(-6, wordList.length);

    //Write the values to the page
    ULTemplate(top5Words, document.getElementById("mostUsed"));
    ULTemplate(least5Words, document.getElementById("leastUsed"));

    docLength.innerText = "Document Length: " + text.length;
    wordCount.innerText = "Word Count: " + wordArray.length;

}

function ULTemplate(items, element) {
    let rowTemplate = document.getElementById('template-ul-items');  // this get the whole script tag but we only need li in that tag
    let templateHTML = rowTemplate.innerHTML; // this will get us li
    let resultsHTML = "";

    for (i = 0; i < items.length - 1; i++) {
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
    }

    element.innerHTML = resultsHTML;

}

function sortProperties(obj) {
    //first convert the object to an array
    let rtnArray = Object.entries(obj);

    //Sort the array
    /*  artray contain 
     key                      value 
                                 0      1
     0                       ["harry", 1258]      
     1                       ["DDFV", 1255] 
     2                       ["bghnh", 1488] 
     3                       [mhuuk", 158]

     */

    rtnArray.sort(function (first, second) {
        return second[1] - first[1];
    });

    return rtnArray;

    /* The function begins by creating a new array rtnArray using the Object.entries() method. This method returns an array of the object's enumerable properties as [key, value] pairs. Each pair is represented as an array within rtnArray.
For example, if obj is { a: 5, b: 2, c: 10 }, then rtnArray will be [['a', 5], ['b', 2], ['c', 10]].

The sort() method is then applied to rtnArray. It takes a comparison function as an argument to determine the sorting order.
The comparison function compares pairs of elements in rtnArray and specifies the order in which they should be sorted. In this case, the comparison function is (first, second) => second[1] - first[1]. This means the elements are sorted based on the numeric values of their second element (value).

The comparison (second[1] - first[1]) ensures that the pairs are sorted in descending order. If the result is a positive number, second is considered greater and is placed before first. If the result is negative, first is considered greater and is placed before second. If the result is zero, the order remains unchanged. */
}

//filter out stop words
function filterStopWords(wordArray) {
    var commonWords = getStopWords();
    var commonObj = {};
    var uncommonArr = [];

    /*      commonWord contain stop word
    marking every stop word true in obj
      a     true
      able  true  etc... */
    for (i = 0; i < commonWords.length; i++) {
        commonObj[commonWords[i].trim()] = true;
    }

    for (i = 0; i < wordArray.length; i++) {
        word = wordArray[i].trim().toLowerCase();
        if (!commonObj[word]) {
            uncommonArr.push(word);
        }
    }

    return uncommonArr;
}

//a list of stop words we don't want to include in stats
function getStopWords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}


//highlight the words in search
function performMark() {

    //read the keyword
    var keyword = document.getElementById("keyword").value;
    var display = document.getElementById("fileContent");

    var newContent = "";

    //find all the currently marked items  to reset the search
    let spans = document.querySelectorAll('mark');
    //<mark>Harry</mark> == outer html
    //Harry == inner html

    for (var i = 0; i < spans.length; i++) {
        spans[i].outerHTML = spans[i].innerHTML;
    }

    var re = new RegExp(keyword, "gi"); // gi = global case insensitive
    var replaceText = "<mark id='markme'>$&</mark>"; // $&= take content and replace it
    var bookContent = display.innerHTML;

    //add the mark to the book content
    newContent = bookContent.replace(re, replaceText);

    display.innerHTML = newContent;
    var count = document.querySelectorAll('mark').length;
    document.getElementById("searchstat").innerHTML = "found " + count + " matches";

    // scrool to the first match found
    if (count > 0) {
        var element = document.getElementById("markme");
        element.scrollIntoView();
    };

} 