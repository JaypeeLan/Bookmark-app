const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameElem = document.getElementById("website-name");
const websiteUrlElem = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = [];

// show modal, focus on Input
const showModal = () => {
  modal.classList.add("show-modal");
  websiteNameElem.focus();
};

// modal event listners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

// Data from form
const storeBookmark = (e) => {
  e.preventDefault();
  const nameValue = websiteNameElem.value;
  let urlValue = websiteUrlElem.value;
  if (!urlValue.includes("http://") && !urlValue.includes("https://")) {
    urlValue = `https://${urlValue}`;
  }
  !formValidation(nameValue, urlValue) ? false : true;
  // --------------------------
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  // --------------------------------------
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmark));
  fetchBookmarks();
  // ---------------------------
  bookmarkForm.reset();
  websiteNameElem.focus();
};

// fetch bookmarks from local storage
const fetchBookmarks = () => {
  // if available
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // creare bookmarks array in local storage
    bookmarks = [
      {
        name: "Portfolio",
        url: "https://laniran-jp.netlify.app",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
};

// ---- To ensure both name and url fields are filled and the url is valid

const formValidation = (nameValue, urlValue) => {
  const exp =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

  const regex = new RegExp(exp);

  if (!nameValue || !urlValue) {
    alert("please fill out both fields");
    return false;
  }

  if (!urlValue.match(regex)) {
    alert("Please enter a correct url");
    return false;
  }
  return true;
};

// Event listeners
bookmarkForm.addEventListener("submit", storeBookmark);

// on load, fetch bookmarks
fetchBookmarks();
