// get the current URL without the token parameter
let newUrl = window.location.href.replace(/\?token=.*/, '');

// replace the current URL with the new URL without the token parameter
window.history.replaceState({}, document.title, newUrl);


// Get the current date/time and format it
function getDateTime() {
    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    return `${date} ${time}`;
  }
  
  // Set the current date/time
  const datetimeElem = document.getElementById('datetime');
  datetimeElem.textContent = getDateTime();
  
  // Update the date/time every second
  setInterval(() => {
    datetimeElem.textContent = getDateTime();
  }, 1000);

  function login(){
    let serverUrl = encodeURIComponent("http://localhost:5000/")
    location.href = "http://localhost:3001/login?service="+serverUrl+"&AppId=2"
  }


