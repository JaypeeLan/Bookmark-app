const modal = document.getElementById("modal") as HTMLElement;
const modalShow = document.getElementById("show-modal") as HTMLElement;
const modalClose = document.getElementById("close-modal") as HTMLElement;
const bookmarkForm = document.getElementById(
  "bookmark-form"
) as HTMLFormElement;
const websiteNameElem = document.getElementById(
  "website-name"
) as HTMLInputElement;
const websiteUrlElem = document.getElementById(
  "website-url"
) as HTMLInputElement;
const bookmarksContainer = document.getElementById(
  "bookmarks-container"
) as HTMLElement;

interface Bookmarks {
  [key: string]: {
    name: string;
    url: string;
  };
}

interface BookmarksID {
  name: string;
  url: string;
}

let bookmarks: Bookmarks = {};

// Show Modal, Focus on Input
function showModal() {
  modal.classList.add("show-modal");
  websiteNameElem.focus();
}

// Validate Form
function validate(nameValue: string, urlValue: string) {
  const expression =
    /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields.");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address.");
    return false;
  }
  // Valid
  return true;
}

// Build Bookmarks
function buildBookmarks() {
  // Remove all bookmark elements
  bookmarksContainer.textContent = "";
  // Build items
  Object.keys(bookmarks).forEach((id: string) => {
    const { name, url } = bookmarks[id] as BookmarksID;

    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${id}')`);
    // Favicon / Link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    // Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Fetch bookmarks
function fetchBookmarks() {
  // Get bookmarks from localStorage if available
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "");
  } else {
    // Create bookmarks object in localStorage
    const id = `http://laniran-jp.netlify.app`;
    bookmarks[id] = {
      name: "Laniran Dev",
      url: "http://laniran-jp.netlify.app",
    };
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }

  buildBookmarks();
}

// Delete Bookmarkbookmark-form
function deleteBookmark(id: string) {
  // Loop through the bookmarks array
  bookmarks[id] ? delete bookmarks[id] : null;
  // Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

// save to local storage
function storeBookmark(e: any) {
  e.preventDefault();
  let nameValue = websiteNameElem.value;
  let urlValue = websiteUrlElem.value;
  if (!urlValue.includes("http://") || !urlValue.includes("https://")) {
    urlValue = `https://${urlValue}`;
  }
  // Validate
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  // Set bookmark object, add to object
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;
  // Set bookmarks in localStorage, fetch, reset input fields
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameElem.focus();
}

// Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

// Modal Event Listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

// On Load, Fetch Bookmarks
fetchBookmarks();
