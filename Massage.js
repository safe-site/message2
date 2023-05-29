const cardElement = document.getElementById('card');
const messageElement = document.getElementById('message');
const titleElement = document.getElementById('title');
const shareButton = document.getElementById('share-button');
const infoButton = document.getElementById('info-button');

// add click event listener to share button
shareButton.addEventListener('click', async () => {
  // generate a new token and create a share link with the message, title, and token in the query parameters
  const token = generateToken();
  const shareUrl = `${window.location.origin}${window.location.pathname}?message=${encodeURIComponent(messageElement.innerText)}&title=${encodeURIComponent(titleElement.innerText)}&token=${encodeURIComponent(token)}`;

  try {
    // send a POST request to the bitelink API to shorten the shareUrl
    const response = await fetch('https://bitelink.000webhostapp.com/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        longUrl: shareUrl
      })
    });

    if (response.ok) {
      const responseData = await response.json();
      const shortUrl = responseData.shortUrl;

      // show share dialog if supported, otherwise prompt user to copy the link
      if (navigator.share) {
        navigator.share({
          title: 'Custom Message Card',
          text: 'Click 👉 ',
          url: shortUrl,
        });
      } else {
        prompt('Copy this URL and share it with others:', shortUrl);
      }
    } else {
      throw new Error('Failed to shorten the URL');
    }
  } catch (error) {
    console.error(error);
    alert('Error occurred while shortening the URL. Please try again later.');
  }
});

// add click event listener to info button
infoButton.addEventListener('click', () => {
  alert('Introducing the latest tool by Shashi: the One-Time Message Sender. Iss tool ki madad se aap kisi ko message bhej sakte ho, jo sirf ek baar dikhayi dega, phir hamesha ke liye delete ho jaayega. Yeh tool sensitive information aur private conversations ke liye accha option hai.');
});

// check if a message, title, and token are present in the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
const title = urlParams.get('title');
const token = urlParams.get('token');

if (message && title && token) {
  // if a message, title, and token are present, check if the token is valid
  const viewedToken = localStorage.getItem(token);

  if (viewedToken === null) {
    // if the token is valid, show the message and title and store the token in local storage
    messageElement.innerText = message;
    titleElement.innerText = title;
    localStorage.setItem(token, true);
  } else {
    // if the token has already been viewed, show the default message and title
    messageElement.innerText = 'This message has been already viewed. Tap to edit and send.';
    titleElement.innerText = 'Sorry';
  }
} else {
  // if no message, title, or token are present, show the default message and title
  messageElement.innerText = 'Enter your message here';
  titleElement.innerText = 'Enter Your Name';
}

// generate a random token and store it in local storage
function generateToken() {
  return Math.random().toString(36).substr(2, 9);
}
