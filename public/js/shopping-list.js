// === STRICT MODE === //
"use strict";

// === VARIABLES, CONSTANTS, DOM ELEMENTS === //
let data = {
  ownLists: {},
  sharedLists: {}
};
let markets = [];
let aside;
let closeAsideOption;
let ownShoppingLists;
let sharedShoppingLists;
let noListCTAMessage;
let lists;
let buttonAddList;
let noSharedListCTAMessage;
let sharedLists;
let mainContent;
let openAsideOption;
let createYourFirstListCTAMessage;
let createYourFirstListCTAMessageButton;
let whatCanIDoCTAMessage;
let listViews;
let marketSuggestions;
const REGEX_EMAIL = /^[a-zA-Z0-9]{1}([a-zA-Z0-9\.\_]{0,}[a-zA-Z0-9]{1}){0,1}\@{1}[a-zA-Z0-9]{1}([a-zA-Z0-9\.\_]{0,}[a-zA-Z0-9]{1}){0,1}\.{1}[a-zA-Z]{1,}$/;
const DEFAULT_ITEM_QUANTITY = 1;
const LIST_TYPES = {
  ownLists: "ownLists",
  sharedLists: "sharedLists"
};
const ENDPOINT_SYNC_DATA = window.location.origin + "/getShoppingLists";
const ENDPOINT_UPDATE_DATA = window.location.origin + "/updateShoppingLists";
const HTTP_METHODS = {
  get: "GET",
  post: "POST"
};
const IDLE_SECONDS = 5;
let time;

// === EVENTS === //
window.addEventListener("load", init);
window.addEventListener("load", inactivityActions);

// === METHODS === //

function init() {
  // Link DOM elements
  aside = document.querySelector(".aside");
  closeAsideOption = aside.querySelector(".aside__option--close-aside");
  ownShoppingLists = aside.querySelector(".aside__shopping-list--own-lists");
  sharedShoppingLists = aside.querySelector(".aside__shopping-list--shared-lists");
  noListCTAMessage = ownShoppingLists.querySelector(".aside__no-list-message");
  lists = ownShoppingLists.querySelector(".aside__lists");
  buttonAddList = ownShoppingLists.querySelector(".aside__add-list-button");
  noSharedListCTAMessage = sharedShoppingLists.querySelector(".aside__no-list-message");
  sharedLists = sharedShoppingLists.querySelector(".aside__lists");
  mainContent = document.querySelector(".main-content");
  openAsideOption = mainContent.querySelector(".main-content__option--open-aside");
  createYourFirstListCTAMessage = mainContent.querySelector(".create-your-first-list");
  createYourFirstListCTAMessageButton = createYourFirstListCTAMessage.querySelector(".create-your-first-list__cta-button");
  whatCanIDoCTAMessage = mainContent.querySelector(".what-can-i-do");
  listViews = mainContent.querySelector(".list-views");
  marketSuggestions = document.querySelector("#market-suggestions");

  // Add event listeners
  aside.addEventListener("focusout", (event) => {
    // Check if some of it's child items has not focus
    if (!aside.contains(event.relatedTarget)) {
      closeAside();
    }
  });
  closeAsideOption.addEventListener("click", closeAside);
  buttonAddList.addEventListener("click", addList);
  openAsideOption.addEventListener("click", openAside);
  createYourFirstListCTAMessageButton.addEventListener("click", addList);  
  

  // Actions
  reloadCTAMessages();
  syncListData();
}

function addList() {
  let listId = crypto.randomUUID();
  
  openAside();
  addListEntry(listId);
  addListItem(LIST_TYPES.ownLists, listId);
  addListView(LIST_TYPES.ownLists, listId);
  showList(listId);
  reloadCTAMessages();
}

/** 
 * Add a new entry to list data.
 * 
 * @param { string } listId - Associated list ID
 */
function addListEntry(listId) {
  data.ownLists[listId] = {
    name: null,
    categories: {},
    sharedEmailList: []
  };
}

/** 
 * Add an option associated to list in aside menu.
 * 
 * @param { string } listType - One value of constant LIST_TYPES
 * @param { string } listId - Associated list ID
 */
function addListItem(listType, listId) {
  if (!existsListType(listType)) throw "Given list type '" + listType + "' does not exist";

  // General DOM elements
  let list = document.createElement("div");
  let inputBox = document.createElement("div");
  let inputListName = document.createElement("input");

  // Set attributes
  list.setAttribute("data-shopping-list-id", listId);
  list.setAttribute("class", "aside__list");

  inputBox.setAttribute("class", "aside__input-box");

  inputListName.setAttribute("type", "name");
  inputListName.setAttribute("placeholder", "Enter a list name");
  inputListName.setAttribute("class", "aside__input-field");

  // Append child nodes
  list.appendChild(inputBox);
  inputBox.appendChild(inputListName);

  // Add event listeners
  list.addEventListener("click", () => {
    showList(listId);
    closeAside();
  });
  inputListName.addEventListener("focusout", () => validateListName(listId, inputListName.value));
  inputListName.addEventListener("focusout", () => lockInputField(inputListName));
  inputListName.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      validateListName(listId, inputListName.value);
      lockInputField(inputListName);
      closeAside();
    }
  });
  
  if (listType === LIST_TYPES.ownLists) {
    // DOM elements
    let inputOptions = document.createElement("div");
    let shareListOption = document.createElement("div");
    let shareIcon = document.createElement("i");
    let moreOptions = document.createElement("div");
    let dotsIcon = document.createElement("i");
    let tooltip = document.createElement("div");
    let tooltipOptions = document.createElement("div");
    let renameListOption = document.createElement("div");
    let renameOptionText = document.createElement("span");
    let pencilIcon = document.createElement("i");
    let deleteListOption = document.createElement("div");
    let deleteIcon = document.createElement("i");
    let deleteOptionText = document.createElement("span");
  
    // Set attributes
    list.appendChild(tooltip);
    inputBox.appendChild(inputOptions);

    inputOptions.setAttribute("class", "aside__input-options");

    shareListOption.setAttribute("class", "aside__input-option aside__input-option--share-list");
    shareListOption.setAttribute("tabindex", "0");
  
    shareIcon.setAttribute("class", "ti ti-share aside__input-option-icon");
  
    moreOptions.setAttribute("class", "aside__input-option aside__input-option--more-options");
    moreOptions.setAttribute("tabindex", "0");
  
    dotsIcon.setAttribute("class", "ti ti-dots aside__input-option-icon");
  
    tooltip.setAttribute("class", "aside__list-tooltip");
    tooltip.setAttribute("tabindex", "0");
  
    tooltipOptions.setAttribute("class", "aside__list-tooltip-options");
  
    renameListOption.setAttribute("class", "aside__list-tooltip-option aside__list-tooltip-option--rename-list");
    renameListOption.setAttribute("tabindex", "0");
      
    pencilIcon.setAttribute("class", "ti ti-pencil aside__list-tooltip-option-icon");
    renameOptionText.setAttribute("class", "aside__list-tooltip-option-name");
  
    deleteListOption.setAttribute("class", "aside__list-tooltip-option aside__list-tooltip-option--delete-list");
    deleteListOption.setAttribute("tabindex", "0");
  
    deleteIcon.setAttribute("class", "ti ti-trash aside__list-tooltip-option-icon");
    deleteOptionText.setAttribute("class", "aside__list-tooltip-option-name");
  
    // Set text/HTML content
    renameOptionText.innerText = "Rename";
    deleteOptionText.innerText = "Delete";

    // Append child nodes
    lists.appendChild(list);
    inputOptions.appendChild(shareListOption);
    inputOptions.appendChild(moreOptions);
  
    shareListOption.appendChild(shareIcon);
    moreOptions.appendChild(dotsIcon);
  
    tooltip.appendChild(tooltipOptions);
    
    tooltipOptions.appendChild(renameListOption);
    tooltipOptions.appendChild(deleteListOption);
  
    renameListOption.appendChild(pencilIcon);
    renameListOption.appendChild(renameOptionText);
  
    deleteListOption.appendChild(deleteIcon);
    deleteListOption.appendChild(deleteOptionText);
    
    // Add event listeners
    moreOptions.addEventListener("click", () => openTooltip(tooltip));
    tooltip.addEventListener("focusout", () => closeTooltip(tooltip));
    shareListOption.addEventListener("click", () => showShareWithModal(listId));
    renameListOption.addEventListener("click", () => editInputField(inputListName));
    deleteListOption.addEventListener("click", () => showDeleteListConfirmationModal(listId));
  } else {
    sharedLists.appendChild(list);
  }

  // Actions
  inputListName.focus();
}

/** 
 * Add a view to associated shopping list ID.
 * 
 * @param { string } listType - One list type defined in LIST_TYPES constant
 * @param { string } listId - Associated list ID
 */
function addListView(listType, listId) {
  if (!existsListType(listType)) throw "Given list type '" + listType + "' does not exist";

  // Generic DOM elements
  let listView = document.createElement("div");
  let listViewHeader = document.createElement("div");
  let listViewListName = document.createElement("div");
  let listViewListNameInputBox = document.createElement("div");
  let listViewListNameInputField = document.createElement("input");
  let listViewHeaderOptions = document.createElement("div");
  let listViewAddCategoryOption = document.createElement("div");
  let listViewAddCategoryButton = document.createElement("button");
  let listViewAddCategoryIcon = document.createElement("i");
  let listViewAddCategoryText = document.createElement("span");
  let listViewMainContent = document.createElement("div");
  let listViewCreateYourFirstCategoryCTAMessage = document.createElement("div");
  let listViewCreateYourFirstCategoryCTAMessageIcon = document.createElement("i");
  let listViewCreateYourFirstCategoryCTAMessageHeading = document.createElement("h1");
  let listViewCreateYourFirstCategoryCTAMessageDescription = document.createElement("p");
  let listViewCreateYourFirstCategoryCTAMessageButton = document.createElement("button");
  let listViewCreateYourFirstCategoryCTAMessageButtonIcon = document.createElement("i");
  let listViewCreateYourFirstCategoryCTAMessageButtonText = document.createElement("span");
  let listViewCategories = document.createElement("div");
  let itemViews = document.createElement("div");
  let listViewModals = document.createElement("div");
  let shareWithModal = document.createElement("div");
  let shareWithHeader = document.createElement("div");
  let shareWithTitle = document.createElement("div");
  let shareWithTitleIcon = document.createElement("i");
  let shareWithTitleText = document.createElement("span");
  let shareWithHeaderOptions = document.createElement("div");
  let shareWithCloseModalOption = document.createElement("div");
  let shareWithCloseModalIcon = document.createElement("i");
  let shareWithMainContent = document.createElement("div");
  let shareWithAddEmailToSharedList = document.createElement("div");
  let shareWithAddEmailToSharedListInputBox = document.createElement("div");
  let shareWithAddEmailToSharedListInputIcon = document.createElement("i");
  let shareWithAddEmailToSharedListInputField = document.createElement("input");
  let shareWithAddEmailToSharedListButton = document.createElement("button");
  let shareWithAddEmailToSharedListButtonIcon = document.createElement("i");
  let shareWithAddEmailToSharedListButtonText = document.createElement("span");
  let shareWithAddEmailToSharedListErrors = document.createElement("span");
  let shareWithNoSharedEmailCTAMessage = document.createElement("div");
  let shareWithNoSharedEmailCTAMessageIcon = document.createElement("i");
  let shareWithNoSharedEmailCTAMessageHeading = document.createElement("h1");
  let shareWithNoSharedEmailCTAMessageDescription = document.createElement("p");
  let sharedWithList = document.createElement("div");
  let sharedWithListHeading = document.createElement("h1");
  let sharedWithEmailsList = document.createElement("div");
  let deleteListConfirmationModal = document.createElement("div");
  let deleteListConfirmationHeader = document.createElement("div");
  let deleteListConfirmationTitle = document.createElement("div");
  let deleteListConfirmationTitleIcon = document.createElement("i");
  let deleteListConfirmationTitleText = document.createElement("span");
  let deleteListConfirmationMainContent = document.createElement("div");
  let deleteListConfirmationCTAMessage = document.createElement("div");
  let deleteListConfirmationCTAMessageIcon = document.createElement("i");
  let deleteListConfirmationCTAMessageHeading = document.createElement("h1");
  let deleteListConfirmationCTAMessageDescription = document.createElement("p");
  let deleteListConfirmationCTAMessageOptions = document.createElement("div");
  let deleteListConfirmationCTAMessageKeepListOption = document.createElement("div");
  let deleteListConfirmationCTAMessageKeepListButton = document.createElement("button");
  let deleteListConfirmationCTAMessageDeleteListOption = document.createElement("div");
  let deleteListConfirmationCTAMessageDeleteListButton = document.createElement("button");

  // Set attributes
  listView.setAttribute("data-shopping-list-id", listId);
  listView.setAttribute("class", "list-view");
  listView.setAttribute("tabindex", "0");

  listViewHeader.setAttribute("class", "list-view__header");
  listViewListName.setAttribute("class", "list-view__list-name");
  listViewListNameInputBox.setAttribute("class", "list-view__input-box");

  listViewListNameInputField.setAttribute("type", "text");
  listViewListNameInputField.setAttribute("placeholder", "Enter a list name");
  listViewListNameInputField.setAttribute("class", "list-view__input-field");
  listViewListNameInputField.setAttribute("readonly", true);

  listViewHeaderOptions.setAttribute("class", "list-view__header-options");
  listViewAddCategoryOption.setAttribute("class", "list-view__header-option list-view__header-option--add-category");

  listViewAddCategoryButton.setAttribute("class", "list-view__add-category-button");
  listViewAddCategoryIcon.setAttribute("class", "ti ti-category-plus list-view__add-category-button-icon");
  listViewAddCategoryText.setAttribute("class", "list-view__add-category-button-text");

  listViewMainContent.setAttribute("class", "list-view__main-content");

  listViewCreateYourFirstCategoryCTAMessage.setAttribute("class", "list-view__create-your-first-category");
  listViewCreateYourFirstCategoryCTAMessageIcon.setAttribute("class", "ti ti-category list-view__create-your-first-category-icon");
  listViewCreateYourFirstCategoryCTAMessageHeading.setAttribute("class", "list-view__create-your-first-category-heading");
  listViewCreateYourFirstCategoryCTAMessageDescription.setAttribute("class", "list-view__create-your-first-category-description");
  listViewCreateYourFirstCategoryCTAMessageButton.setAttribute("class", "list-view__create-your-first-category-cta-button");
  listViewCreateYourFirstCategoryCTAMessageButtonIcon.setAttribute("class", "ti ti-category-plus list-view__create-your-first-category-cta-button-icon");
  listViewCreateYourFirstCategoryCTAMessageButtonText.setAttribute("class", "list-view__create-your-first-category-cta-button-text");
  
  listViewCategories.setAttribute("class", "list-view__categories");
  itemViews.setAttribute("class", "item-views");
  listViewModals.setAttribute("class", "list-view__modals");

  shareWithModal.setAttribute("class", "list-view__modal list-view__modal--share-with");
  shareWithHeader.setAttribute("class", "list-view__modal-header");
  shareWithTitle.setAttribute("class", "list-view__modal-header-title");
  shareWithTitleIcon.setAttribute("class", "ti ti-share list-view__modal-header-title-icon");
  shareWithTitleText.setAttribute("class", "list-view__modal-header-title-text");
  shareWithHeaderOptions.setAttribute("class", "list-view__modal-header-options");

  shareWithCloseModalOption.setAttribute("class", "list-view__modal-header-option list-view__modal-header-option--close-modal");
  shareWithCloseModalOption.setAttribute("tabindex", "0");

  shareWithCloseModalIcon.setAttribute("class", "ti ti-x list-view__modal-header-option-icon");

  shareWithMainContent.setAttribute("class", "list-view__modal-main-content");
  shareWithAddEmailToSharedList.setAttribute("class", "list-view__modal-add-email-to-shared-list");
  shareWithAddEmailToSharedListInputBox.setAttribute("class", "list-view__modal-add-email-to-shared-list-input-box");

  shareWithAddEmailToSharedListInputIcon.setAttribute("class", "ti ti-mail list-view__modal-add-email-to-shared-list-input-icon");

  shareWithAddEmailToSharedListInputField.setAttribute("type", "text");
  shareWithAddEmailToSharedListInputField.setAttribute("placeholder", "Enter an email address");
  shareWithAddEmailToSharedListInputField.setAttribute("class", "list-view__modal-add-email-to-shared-list-input-field");

  shareWithAddEmailToSharedListButton.setAttribute("class", "list-view__modal-add-email-to-shared-list-button");
  shareWithAddEmailToSharedListButtonIcon.setAttribute("class", "ti ti-mail-plus list-view__modal-add-email-to-shared-list-button-icon");
  shareWithAddEmailToSharedListButtonText.setAttribute("class", "list-view__modal-add-email-to-shared-button-text");

  shareWithAddEmailToSharedListErrors.setAttribute("class", "list-view__modal-add-email-to-shared-list-errors");

  shareWithNoSharedEmailCTAMessage.setAttribute("class", "list-view__modal-no-shared-email");
  shareWithNoSharedEmailCTAMessageIcon.setAttribute("class", "ti ti-mail-share list-view__modal-no-shared-email-icon");
  shareWithNoSharedEmailCTAMessageHeading.setAttribute("class", "list-view__modal-no-shared-email-heading");
  shareWithNoSharedEmailCTAMessageDescription.setAttribute("class", "list-view__modal-no-shared-email-description");

  sharedWithList.setAttribute("class", "list-view__modal-shared-with");
  sharedWithListHeading.setAttribute("class", "list-view__modal-shared-with-heading");
  sharedWithEmailsList.setAttribute("class", "list-view__modal-shared-emails");

  deleteListConfirmationModal.setAttribute("class", "list-view__modal list-view__modal--delete-shopping-list-confirmation");
  deleteListConfirmationModal.setAttribute("tabindex", "0");

  deleteListConfirmationHeader.setAttribute("class", "list-view__modal-header");
  deleteListConfirmationTitle.setAttribute("class", "list-view__modal-header-title");
  deleteListConfirmationTitleIcon.setAttribute("class", "ti ti-alert-triangle list-view__modal-header-title-icon");
  deleteListConfirmationTitleText.setAttribute("class", "list-view__modal-header-title-text");
  deleteListConfirmationMainContent.setAttribute("class", "list-view__modal-main-content");
  deleteListConfirmationCTAMessage.setAttribute("class", "list-view__modal-delete-shopping-list");
  deleteListConfirmationCTAMessageIcon.setAttribute("class", "ti ti-alert-triangle-filled list-view__modal-delete-shopping-list-icon");
  deleteListConfirmationCTAMessageHeading.setAttribute("class", "list-view__modal-delete-shopping-list-heading");
  deleteListConfirmationCTAMessageDescription.setAttribute("class", "list-view__modal-delete-shopping-list-description");
  deleteListConfirmationCTAMessageOptions.setAttribute("class", "list-view__modal-delete-options");
  deleteListConfirmationCTAMessageKeepListOption.setAttribute("class", "list-view__modal-delete-option list-view__modal-delete-option--keep-list");
  deleteListConfirmationCTAMessageKeepListButton.setAttribute("class", "list-view__modal-delete-option-button list-view__modal-delete-option-button--keep-list");
  deleteListConfirmationCTAMessageDeleteListOption.setAttribute("class", "list-view__modal-delete-option list-view__modal-delete-option--delete-list");
  deleteListConfirmationCTAMessageDeleteListButton.setAttribute("class", "list-view__modal-delete-option-button list-view__modal-delete-option-button--delete-list");

  // Set text/HTML content
  listViewAddCategoryText.innerText = "Add category";

  listViewCreateYourFirstCategoryCTAMessageHeading.innerText = "Organize your list";
  listViewCreateYourFirstCategoryCTAMessageDescription.innerHTML = "<span class=\"featured-word\">Categories</span> allows you to organize items according to their characteristics.";
  listViewCreateYourFirstCategoryCTAMessageButtonText.innerText = "Create category!";

  shareWithTitleText.innerText = "Share your list";
  shareWithAddEmailToSharedListButtonText.innerText = "Add email";
  shareWithNoSharedEmailCTAMessageHeading.innerText = "Want to share your list?";
  shareWithNoSharedEmailCTAMessageDescription.innerHTML = " <span class=\"featured-word\">Add</span> someone's email address to shared list to allow him see your shopping list. <span class=\"featured-word\">Enter</span> it's email address on given field.";
  sharedWithListHeading.innerText = "Shared with";

  deleteListConfirmationTitleText.innerText = "Delete confirmation";
  deleteListConfirmationCTAMessageHeading.innerHTML = "You are going to <span class=\"featured-word featured-word--danger\">delete</span> <span class=\"featured-word list-name\">My first list</span> !";
  deleteListConfirmationCTAMessageDescription.innerHTML = "Remember when this action is executed it all data associated to shopping list will be erased, including shared emails, and <span class=\"featured-word featured-word--danger list-view__modal-shopping-list-name\">cannot be undone</span>. Are you sure?";
  deleteListConfirmationCTAMessageKeepListButton.innerText = "No, keep it";
  deleteListConfirmationCTAMessageDeleteListButton.innerText = "Yes, delete it";

  // Append child nodes
  listViews.appendChild(listView);
  
  listView.appendChild(listViewHeader);
  listView.appendChild(listViewMainContent);
  listView.appendChild(itemViews);
  listView.appendChild(listViewModals);

  listViewHeader.appendChild(listViewListName);
  listViewHeader.appendChild(listViewHeaderOptions);

  listViewListName.appendChild(listViewListNameInputBox);
  
  listViewListNameInputBox.appendChild(listViewListNameInputField);

  listViewHeaderOptions.appendChild(listViewAddCategoryOption);
  listViewAddCategoryOption.appendChild(listViewAddCategoryButton);

  listViewAddCategoryButton.appendChild(listViewAddCategoryIcon);
  listViewAddCategoryButton.appendChild(listViewAddCategoryText);

  listViewMainContent.appendChild(listViewCreateYourFirstCategoryCTAMessage);
  listViewMainContent.appendChild(listViewCategories);

  listViewCreateYourFirstCategoryCTAMessage.appendChild(listViewCreateYourFirstCategoryCTAMessageIcon);
  listViewCreateYourFirstCategoryCTAMessage.appendChild(listViewCreateYourFirstCategoryCTAMessageHeading);
  listViewCreateYourFirstCategoryCTAMessage.appendChild(listViewCreateYourFirstCategoryCTAMessageDescription);
  listViewCreateYourFirstCategoryCTAMessage.appendChild(listViewCreateYourFirstCategoryCTAMessageButton);

  listViewCreateYourFirstCategoryCTAMessageButton.appendChild(listViewCreateYourFirstCategoryCTAMessageButtonIcon);
  listViewCreateYourFirstCategoryCTAMessageButton.appendChild(listViewCreateYourFirstCategoryCTAMessageButtonText);

  listViewModals.appendChild(shareWithModal);
  listViewModals.appendChild(deleteListConfirmationModal);

  shareWithModal.appendChild(shareWithHeader);
  shareWithModal.appendChild(shareWithMainContent);

  shareWithHeader.appendChild(shareWithTitle);
  shareWithHeader.appendChild(shareWithHeaderOptions);

  shareWithTitle.appendChild(shareWithTitleIcon);
  shareWithTitle.appendChild(shareWithTitleText);

  shareWithHeaderOptions.appendChild(shareWithCloseModalOption);
  shareWithCloseModalOption.appendChild(shareWithCloseModalIcon);

  shareWithMainContent.appendChild(shareWithAddEmailToSharedList);
  shareWithMainContent.appendChild(shareWithNoSharedEmailCTAMessage);
  shareWithMainContent.appendChild(sharedWithList);

  shareWithAddEmailToSharedList.appendChild(shareWithAddEmailToSharedListInputBox);
  shareWithAddEmailToSharedList.appendChild(shareWithAddEmailToSharedListButton);
  shareWithAddEmailToSharedList.appendChild(shareWithAddEmailToSharedListErrors);

  shareWithAddEmailToSharedListInputBox.appendChild(shareWithAddEmailToSharedListInputIcon);
  shareWithAddEmailToSharedListInputBox.appendChild(shareWithAddEmailToSharedListInputField);

  shareWithAddEmailToSharedListButton.appendChild(shareWithAddEmailToSharedListButtonIcon);
  shareWithAddEmailToSharedListButton.appendChild(shareWithAddEmailToSharedListButtonText);

  shareWithNoSharedEmailCTAMessage.appendChild(shareWithNoSharedEmailCTAMessageIcon);
  shareWithNoSharedEmailCTAMessage.appendChild(shareWithNoSharedEmailCTAMessageHeading);
  shareWithNoSharedEmailCTAMessage.appendChild(shareWithNoSharedEmailCTAMessageDescription);

  sharedWithList.appendChild(sharedWithListHeading);
  sharedWithList.appendChild(sharedWithEmailsList);

  deleteListConfirmationModal.appendChild(deleteListConfirmationHeader);
  deleteListConfirmationModal.appendChild(deleteListConfirmationMainContent);

  deleteListConfirmationHeader.appendChild(deleteListConfirmationTitle);
  
  deleteListConfirmationTitle.appendChild(deleteListConfirmationTitleIcon);
  deleteListConfirmationTitle.appendChild(deleteListConfirmationTitleText);

  deleteListConfirmationMainContent.appendChild(deleteListConfirmationCTAMessage);

  deleteListConfirmationCTAMessage.appendChild(deleteListConfirmationCTAMessageIcon);
  deleteListConfirmationCTAMessage.appendChild(deleteListConfirmationCTAMessageHeading);
  deleteListConfirmationCTAMessage.appendChild(deleteListConfirmationCTAMessageDescription);
  deleteListConfirmationCTAMessage.appendChild(deleteListConfirmationCTAMessageOptions);
  
  deleteListConfirmationCTAMessageOptions.appendChild(deleteListConfirmationCTAMessageKeepListOption);
  deleteListConfirmationCTAMessageOptions.appendChild(deleteListConfirmationCTAMessageDeleteListOption);

  deleteListConfirmationCTAMessageKeepListOption.appendChild(deleteListConfirmationCTAMessageKeepListButton);
  deleteListConfirmationCTAMessageDeleteListOption.appendChild(deleteListConfirmationCTAMessageDeleteListButton);
  
  // Event listeners
  listViewListNameInputField.addEventListener("focusout", () => lockInputField(listViewListNameInputField));
  listViewListNameInputField.addEventListener("focusout", () => validateListName(listId, listViewListNameInputField.value));
  listViewListNameInputField.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      validateListName(listId, listViewListNameInputField.value);
      lockInputField(listViewListNameInputField);
      closeAside();
    }
  });
  listViewAddCategoryButton.addEventListener("click", () => addCategory(listId));
  listViewCreateYourFirstCategoryCTAMessageButton.addEventListener("click", () => addCategory(listId));
  shareWithCloseModalOption.addEventListener("click", () => hideModal(shareWithModal));
  shareWithAddEmailToSharedListInputField.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      validateSharedEmail(listId, shareWithAddEmailToSharedListInputField.value);
    }
  });
  shareWithAddEmailToSharedListButton.addEventListener("click", () => validateSharedEmail(listId, shareWithAddEmailToSharedListInputField.value));
  deleteListConfirmationCTAMessageKeepListButton.addEventListener("click", () => hideModal(deleteListConfirmationModal));
  deleteListConfirmationCTAMessageDeleteListButton.addEventListener("click", () => deleteList(listId));

  if (listType === LIST_TYPES.ownLists) {
    // DOM elements
    let listViewListNameInputOptions = document.createElement("div");
    let listViewShareListOption = document.createElement("div");
    let listViewShareListIcon = document.createElement("i");
    let listViewRenameListOption = document.createElement("div");
    let listViewRenameListIcon = document.createElement("i");
    let listViewDeleteListOption = document.createElement("div");
    let listViewDeleteListIcon = document.createElement("i");

    // Set attributes
    listViewListNameInputOptions.setAttribute("class", "list-view__input-options");
  
    listViewShareListOption.setAttribute("class", "list-view__input-option list-view__input-option--share-list");
    listViewShareListOption.setAttribute("tabindex", "0");

    listViewShareListIcon.setAttribute("class", "ti ti-share list-view__input-option-icon");

    listViewRenameListOption.setAttribute("class", "list-view__input-option list-view__input-option--rename-list");
    listViewRenameListOption.setAttribute("tabindex", "0");

    listViewRenameListIcon.setAttribute("class", "ti ti-pencil list-view__input-option-icon");

    listViewDeleteListOption.setAttribute("class", "list-view__input-option list-view__input-option--delete-list");
    listViewDeleteListOption.setAttribute("tabindex", "0");

    listViewDeleteListIcon.setAttribute("class", "ti ti-trash list-view__input-option-icon");

    // Append child nodes
    listViewListNameInputBox.appendChild(listViewListNameInputOptions);

    listViewListNameInputOptions.appendChild(listViewShareListOption);
    listViewListNameInputOptions.appendChild(listViewRenameListOption);
    listViewListNameInputOptions.appendChild(listViewDeleteListOption);
  
    listViewShareListOption.appendChild(listViewShareListIcon);
    listViewRenameListOption.appendChild(listViewRenameListIcon);
    listViewDeleteListOption.appendChild(listViewDeleteListIcon);
  
    // Event listeners
    listViewShareListOption.addEventListener("click", () => showShareWithModal(listId));
    listViewRenameListOption.addEventListener("click", () => editInputField(listViewListNameInputField));
    listViewDeleteListOption.addEventListener("click", () => showDeleteListConfirmationModal(listId));
  }
}

/** 
 * Actions:
 * 
 * - If given list name is not valid and is set by first time, associated data
 *   will be removed.
 * - If given list name is not valid but there's one valid, the associated name
 *   will be latest valid.
 * - If given list name is valid, all references to it will be updated.
 * 
 * @param { string } listId - Associated list ID
 * @param { string } newListName - Name you want associate to list.
 */
function validateListName(listId, newListName) {
  let listType = getListType(listId);
  if (!data[listType][listId] instanceof Object) throw "There's no data associated to list '" + listId + "'";
  if (typeof(newListName) !== "string") throw "List name must be a 'string'";

  newListName = newListName.trim();

  if (newListName === "") {
    if (data[listType][listId].name !== null) {
      updateListNameReferences(listId);
    } else {
      deleteList(listId);
    }
  } else {
    updateListName(listId, newListName);
  }
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } newListName - New name to associate the list
 */
function updateListName(listId, newListName) {
  data[getListType(listId)][listId].name = newListName;
  updateListNameReferences(listId);
  updateListData();
}

/** 
 * @param { string } listId - Associated list ID
 */
function updateListNameReferences(listId) {
  let listName = data[getListType(listId)][listId].name;
  let listView = listViews.querySelector("[data-shopping-list-id='" + listId + "']");
  let asideListName = aside.querySelector("[data-shopping-list-id='" + listId + "'] .aside__input-field");
  let viewListName =  listView.querySelector(".list-view__list-name .list-view__input-field");
  let deleteConfirmationModalListName = listView.querySelector(".list-view__modal-delete-shopping-list .list-name");

  asideListName.value = listName;
  viewListName.value = listName;
  deleteConfirmationModalListName.innerText = listName;
}

/** 
 * @param { string } listId - Associated list ID
 */
function deleteList(listId) {
  deleteListEntry(listId);  
  deleteListItem(listId);
  deleteListView(listId);
  reloadCTAMessages();
  updateListData();
}

/** 
 * @param { string } listId - Associated list ID
 */
function deleteListEntry(listId) {
  delete data[getListType(listId)][listId];
}

/** 
 * @param { string } listId - Associated list ID
 */
function deleteListItem(listId) {
  let list = aside.querySelector("[data-shopping-list-id='" + listId + "']");
  if (!list instanceof Element) throw "Given list '" + listId + "' does not exists in aside menu";
  list.remove();
}

/** 
 * @param { string } listId - Associated list ID
 */
function deleteListView(listId) {
  let listView = listViews.querySelector("[data-shopping-list-id='" + listId + "']");
  if (!listView instanceof Element) throw "Given list '" + listId + "' does not exist in views";
  listView.remove();
}

function reloadCTAMessages() {
  reloadAsideCTAMessages();
  reloadMainContentCTAMessages();
}

function reloadAsideCTAMessages() {
  reloadAsideOwnListCTAMessage();
  reloadAsideSharedListCTAMessage();
}

function reloadAsideOwnListCTAMessage() {
  if (getObjectKeys(data.ownLists).length > 0) {
    deactivateElement(noListCTAMessage);
  } else {
    activateElement(noListCTAMessage);
  }
}

function reloadAsideSharedListCTAMessage() {
  if (getObjectKeys(data.sharedLists).length > 0) {
    deactivateElement(noSharedListCTAMessage);
  } else {
    activateElement(noSharedListCTAMessage);
  }
}

function reloadMainContentCTAMessages() {
  let activeView = listViews.querySelector(".list-view.active");

  if (activeView instanceof Element) {
    deactivateElement(createYourFirstListCTAMessage);
    deactivateElement(whatCanIDoCTAMessage);
  } else {
    if (getObjectKeys(data.ownLists).length > 0) {
      deactivateElement(createYourFirstListCTAMessage);  
      activateElement(whatCanIDoCTAMessage);
    } else {
      deactivateElement(whatCanIDoCTAMessage);
      activateElement(createYourFirstListCTAMessage);
    }
  }
}

function showList(listId) {
  deactivateCurrentActiveAsideListItem();
  activateAsideListItem(listId);
  hideCurrentActiveListView(listId);
  showListView(listId);
  reloadMainContentCTAMessages();
  reloadListViewCTAMessages(listId);
}

function deactivateCurrentActiveAsideListItem() {
  let activeAsideListItem = aside.querySelector(".aside__list.active");
  if (activeAsideListItem instanceof Element) deactivateElement(activeAsideListItem);
}

/** 
 * @param { string } listId - Associated list ID
 */
function activateAsideListItem(listId) {
  let asideListItem = aside.querySelector("[data-shopping-list-id='" + listId + "']");
  if (!(asideListItem instanceof Element)) throw "Given list '" + listId + "' does not have associated any aside item";
  activateElement(asideListItem);
}

function hideCurrentActiveListView() {
  let activeListView = listViews.querySelector(".list-view.active");
  if (activeListView instanceof Element) deactivateElement(activeListView);
}

/** 
 * @param { string } listId - Associated list ID
 */
function showListView(listId) {
  activateElement(getListView(listId));
}

/** 
 * @param listId
 */
function reloadListViewCTAMessages(listId) {
  reloadListViewCreateYourFirstCategoryCTAMessage(listId);
  reloadListViewModalsCTAMessages(listId);
}

/** 
 * @param { string } listId - Associated list ID
 */
function reloadListViewCreateYourFirstCategoryCTAMessage(listId) {
  let listView = getListView(listId);
  let createYourFirstCategoryCTAMessage = listView.querySelector(".list-view__create-your-first-category");

  if (getObjectKeys(data[getListType(listId)][listId].categories).length > 0) {
    deactivateElement(createYourFirstCategoryCTAMessage);
  } else {
    activateElement(createYourFirstCategoryCTAMessage);
  }
};

/** 
 * @param { string } listId - Associated list ID
 */
function reloadListViewModalsCTAMessages(listId) {
  reloadSharedWithEmailModal(listId);
}

/** 
 * @param { string } listId - Associated list ID
 */
function reloadSharedWithEmailModal(listId) {
  let listView = getListView(listId);
  let shareWithModal = listView.querySelector(".list-view__modal.list-view__modal--share-with");
  let noSharedEmailCTAMessage = shareWithModal.querySelector(".list-view__modal-no-shared-email");
  let sharedEmailList = shareWithModal.querySelector(".list-view__modal-shared-with");

  if (data[getListType(listId)][listId].sharedEmailList.length > 0) {
    deactivateElement(noSharedEmailCTAMessage);
    activateElement(sharedEmailList);
  } else {
    deactivateElement(sharedEmailList);
    activateElement(noSharedEmailCTAMessage);
  }
}

// === UTILS === //

/** 
 * Activate document element by adding him '.active' class.
 * 
 * @param { element } element 
 */
function activateElement(element) {
  if (!element instanceof Element) throw "Element must be an instance of 'Element'";
  element.classList.add("active");
}

/** 
 * Deactivate an element by removing '.active' class.
 * 
 * @param { element } element 
 */
function deactivateElement(element) {
  if (!element instanceof Element) throw "CTA Message must be an instance of 'Element'";
  element.classList.remove("active");
}

/** 
 * Return an array with given object keys.
 * 
 * @param { object } object
 * @return { array } An array with object keys.
 */
function getObjectKeys(object) {
  return Object.keys(object);
}

/** 
 * Return list view associated to given list ID.
 * 
 * @param { string } listId 
 * @return { element } View associated to given list ID
 * @throws { Error } If list view does not exists.
 */
function getListView(listId) {
  let listView = listViews.querySelector("[data-shopping-list-id='" + listId + "']");
  if (!(listView instanceof Element)) throw "Given list '" + listId + "' does not have an associated view";
  return listView;
}

/** 
 * @param { string } listId - Associated list ID
 */
function addCategory(listId) {
  let categoryId = crypto.randomUUID();

  addCategoryEntry(listId, categoryId);
  addCategoryItem(listId, categoryId);
  reloadListViewCTAMessages(listId);
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 */
function addCategoryEntry(listId, categoryId) {
  data[getListType(listId)][listId].categories[categoryId] = {
    name: null,
    items: {}
  };
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 */
function addCategoryItem(listId, categoryId) {
  // DOM elements
  let listView = getListView(listId);
  let categories = listView.querySelector(".list-view__categories");
  let category = document.createElement("div");
  let categoryHeader = document.createElement("div");
  let categoryName = document.createElement("div");
  let categoryHeaderInputBox = document.createElement("div");
  let categoryHeaderInputField = document.createElement("input");
  let categoryHeaderInputOptions = document.createElement("div");
  let renameCategoryOption = document.createElement("div");
  let renameCategoryIcon = document.createElement("i");
  let deleteCategoryOption = document.createElement("div");
  let deleteCategoryIcon = document.createElement("i");
  let categoryMainContent = document.createElement("div");
  let categoryItems = document.createElement("div");
  let addItemButton = document.createElement("button");
  let addItemButtonIcon = document.createElement("i");
  let addItemButtonText = document.createElement("span");

  // Set attributes
  category.setAttribute("class", "list-view__category");
  category.setAttribute("data-category-id", categoryId);

  categoryHeader.setAttribute("class", "list-view__category-header");
  categoryName.setAttribute("class", "list-view__category-name");
  categoryHeaderInputBox.setAttribute("class", "list-view__category-header-input-box");
  
  categoryHeaderInputField.setAttribute("type", "text");
  categoryHeaderInputField.setAttribute("placeholder", "Enter category name");
  categoryHeaderInputField.setAttribute("class", "list-view__category-header-input-field");

  categoryHeaderInputOptions.setAttribute("class", "list-view__category-header-input-options");
  
  renameCategoryOption.setAttribute("class", "list-view__category-header-input-option list-view__category-header-input-option--rename-category");
  renameCategoryOption.setAttribute("tabindex", "0");

  renameCategoryIcon.setAttribute("class", "ti ti-pencil list-view__category-header-input-option-icon");

  deleteCategoryOption.setAttribute("class", "list-view__category-header-input-option list-view__category-header-input-option--delete-category");
  deleteCategoryOption.setAttribute("tabindex", "0");

  deleteCategoryIcon.setAttribute("class", "ti ti-trash list-view__category-header-input-option-icon");

  categoryMainContent.setAttribute("class", "list-view__category-main-content");
  categoryItems.setAttribute("class", "list-view__items");

  addItemButton.setAttribute("class", "list-view__add-item-button");
  addItemButtonIcon.setAttribute("class", "ti ti-cube-plus list-view__add-item-button-icon");
  addItemButtonText.setAttribute("class", "list-view__add-item-button-text");

  // Set text/HTML content
  addItemButtonText.innerText = "Add item";

  // Append child nodes
  categories.appendChild(category);

  category.appendChild(categoryHeader);
  category.appendChild(categoryMainContent);

  categoryHeader.appendChild(categoryName);
  categoryName.appendChild(categoryHeaderInputBox);

  categoryHeaderInputBox.appendChild(categoryHeaderInputField);
  categoryHeaderInputBox.appendChild(categoryHeaderInputOptions);

  categoryHeaderInputOptions.appendChild(renameCategoryOption);
  categoryHeaderInputOptions.appendChild(deleteCategoryOption);

  renameCategoryOption.appendChild(renameCategoryIcon);
  deleteCategoryOption.appendChild(deleteCategoryIcon);

  categoryMainContent.appendChild(categoryItems);
  categoryMainContent.appendChild(addItemButton);

  addItemButton.appendChild(addItemButtonIcon);
  addItemButton.appendChild(addItemButtonText);

  // Events
  categoryHeaderInputField.addEventListener("focusout", () => validateCategoryName(listId, categoryId, categoryHeaderInputField.value));
  categoryHeaderInputField.addEventListener("focusout", () => lockInputField(categoryHeaderInputField));
  categoryHeaderInputField.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && categoryHeaderInputField.value !== "") {
      validateCategoryName(listId, categoryId, categoryHeaderInputField.value);
      lockInputField(categoryHeaderInputField);
      addItem(listId, categoryId);
    }
  });
  renameCategoryOption.addEventListener("click", () => editInputField(categoryHeaderInputField));
  deleteCategoryOption.addEventListener("click", () => deleteCategory(listId, categoryId));
  addItemButton.addEventListener("click", () => addItem(listId, categoryId));

  // Actions
  categoryHeaderInputField.focus();
}

/** 
 * Actions:
 * 
 * - If given new category name is empty and it's first time set, category 
 *   will be removed.
 * - If given new category name is empty but latest name is valid, definitive
 *   category name will be latest valid.
 * - If given new category name is valid all it's references will be updated.
 * 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } newCategoryName - New name you want assign to category
 */
function validateCategoryName(listId, categoryId, newCategoryName) {
  let listType = getListType(listId);

  if (!(data[listType][listId].categories[categoryId] instanceof Object)) throw "Given category '" + categoryId + "' does not have an entry";
  if (typeof(newCategoryName) !== "string") throw "Category name must be a 'String'";

  newCategoryName = newCategoryName.trim();

  if (newCategoryName === "") {
    if (data[listType][listId].categories[categoryId].name !== null) {
      updateCategoryNameReferences(listId, categoryId);
    } else {
      deleteCategory(listId, categoryId);
    }
  } else {
    updateCategoryName(listId, categoryId, newCategoryName);
  }
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } newCategoryName - New name to associate category
 */
function updateCategoryName(listId, categoryId, newCategoryName) {
  data[getListType(listId)][listId].categories[categoryId].name = newCategoryName;
  updateCategoryNameReferences(listId, categoryId);
  updateListData();
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 */
function updateCategoryNameReferences(listId, categoryId) {
  let category = getListViewCategoryItem(listId, categoryId);
  let categoryNameField = category.querySelector(".list-view__category-header-input-field");

  categoryNameField.value = data[getListType(listId)][listId].categories[categoryId].name;
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 */
function deleteCategory(listId, categoryId) {
  deleteCategoryEntry(listId, categoryId);
  deleteCategoryItem(listId, categoryId);
  reloadListViewCTAMessages(listId);
  updateListData();
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 */
function deleteCategoryEntry(listId, categoryId) {
  delete data[getListType(listId)][listId].categories[categoryId];
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 */
function deleteCategoryItem(listId, categoryId) {
  let category = getListViewCategoryItem(listId, categoryId);
  category.remove();
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @return { element } Category document element item associated to category ID
 * @throws { Error } If category document element item does not exist
 */
function getListViewCategoryItem(listId, categoryId) {
  let listView = getListView(listId);
  let categories = listView.querySelector(".list-view__categories");
  let category = categories.querySelector("[data-category-id='" + categoryId + "']");

  if (!(category instanceof Element)) throw "Given category '" + category + "' does not exist in list '" + listId + "' view";

  return category;  
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 */
function addItem(listId, categoryId) {
  let itemId = crypto.randomUUID();

  addItemEntry(listId, categoryId, itemId);
  addItemToCategory(listId, categoryId, itemId);
  addItemView(listId, categoryId, itemId);
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 */
function addItemEntry(listId, categoryId, itemId) {
  data[getListType(listId)][listId].categories[categoryId].items[itemId] = {
    name: null,
    quantity: 1,
    checked: false,
    market: "",
    description: ""
  };
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 */
function addItemToCategory(listId, categoryId, itemId) {
  // DOM elements
  let category = getListViewCategoryItem(listId, categoryId);
  let items = category.querySelector(".list-view__items");
  let item = document.createElement("div");
  let itemInputCheckbox = document.createElement("input");
  let itemQuantity = document.createElement("span");
  let itemInputBox = document.createElement("div");
  let itemInputField = document.createElement("input");
  let itemInputOptions = document.createElement("div");
  let renameItemOption = document.createElement("div");
  let renameItemIcon = document.createElement("i");
  let deleteItemOption = document.createElement("div");
  let deleteItemIcon = document.createElement("i");

  // Set attributes
  item.setAttribute("data-item-id", itemId);
  item.setAttribute("class", "list-view__item");
  item.setAttribute("tabindex", "0");

  itemInputCheckbox.setAttribute("type", "checkbox");
  itemInputCheckbox.setAttribute("class", "list-view__item-checkbox");

  itemQuantity.setAttribute("class", "list-view__item-quantity");
  itemInputBox.setAttribute("class", "list-view__item-input-box");
  
  itemInputField.setAttribute("type", "text");
  itemInputField.setAttribute("placeholder", "Enter an item name");
  itemInputField.setAttribute("class", "list-view__item-input-field");

  itemInputOptions.setAttribute("class", "list-view__item-input-options");

  renameItemOption.setAttribute("class", "list-view__item-input-option list-view__item-input-option--rename-item");
  renameItemOption.setAttribute("tabindex", "0");

  renameItemIcon.setAttribute("class", "ti ti-pencil list-view__item-input-option-icon");

  deleteItemOption.setAttribute("class", "list-view__item-input-option list-view__item-input-option--delete-item");
  deleteItemOption.setAttribute("tabindex", "0");

  deleteItemIcon.setAttribute("class", "ti ti-trash list-view__item-input-option-icon");

  // Set text/HTML content
  itemQuantity.innerText = String(DEFAULT_ITEM_QUANTITY);

  // Append child nodes
  items.appendChild(item);

  item.appendChild(itemInputCheckbox);
  item.appendChild(itemQuantity);
  item.appendChild(itemInputBox);

  itemInputBox.appendChild(itemInputField);
  itemInputBox.appendChild(itemInputOptions);

  itemInputOptions.appendChild(renameItemOption);
  itemInputOptions.appendChild(deleteItemOption);

  renameItemOption.appendChild(renameItemIcon);
  deleteItemOption.appendChild(deleteItemIcon);

  // Events
  itemInputCheckbox.addEventListener("change", () => updateItemChecked(listId, categoryId, itemId, itemInputCheckbox.checked));
  itemInputField.addEventListener("click", () => showItemView(listId, itemId));
  itemInputField.addEventListener("focusout", () => validateItemName(listId, categoryId, itemId, itemInputField.value));
  itemInputField.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && itemInputField.value !== "") {
      validateItemName(listId, categoryId, itemId, itemInputField.value);
      addItem(listId, categoryId);
    }
  });
  deleteItemOption.addEventListener("click", () => deleteItem(listId, categoryId, itemId));

  // Actions
  itemInputField.focus();
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 */
function addItemView(listId, categoryId, itemId) {
  // DOM elements
  let listView = getListView(listId);
  let itemViews = listView.querySelector(".item-views");
  let itemView = document.createElement("div");
  let itemViewHeader = document.createElement("div");
  let itemViewHeaderOptions = document.createElement("div");
  let closeItemViewOption = document.createElement("div");
  let closeItemViewIcon = document.createElement("i");
  let itemViewMainContent = document.createElement("div");
  let itemViewItemName = document.createElement("div");
  let itemViewItemNameInputBox = document.createElement("div");
  let itemViewItemNameInputField = document.createElement("input");
  let itemViewItemFeatures = document.createElement("div");
  let quantityFeature = document.createElement("div");
  let quantityFeatureName = document.createElement("div");
  let quantityFeatureIcon = document.createElement("i");
  let quantityFeatureText = document.createElement("span");
  let quantityFeatureValue = document.createElement("div");
  let quantityFeatureValueInputBox = document.createElement("div");
  let quantityFeatureValueInputField = document.createElement("input");
  let checkedFeature = document.createElement("div");
  let checkedFeatureName = document.createElement("div");
  let checkedFeatureIcon = document.createElement("i");
  let checkedFeatureText = document.createElement("span");
  let checkedFeatureValue = document.createElement("div");
  let checkedFeatureValueInputBox = document.createElement("div");
  let checkedFeatureValueInputField = document.createElement("input");
  let marketFeature = document.createElement("div");
  let marketFeatureName = document.createElement("div");
  let marketFeatureIcon = document.createElement("i");
  let marketFeatureText = document.createElement("span");
  let marketFeatureValue = document.createElement("div");
  let marketFeatureValueInputBox = document.createElement("div");
  let marketFeatureValueInputField = document.createElement("input");
  let descriptionFeature = document.createElement("div");
  let descriptionFeatureName = document.createElement("div");
  let descriptionFeatureIcon = document.createElement("i");
  let descriptionFeatureText = document.createElement("span");
  let descriptionFeatureValue = document.createElement("div");
  let descriptionFeatureValueInputBox = document.createElement("div");
  let descriptionFeatureValueInputField = document.createElement("textarea");

  // Set attributes
  itemView.setAttribute("data-item-id", itemId);

  itemView.setAttribute("class", "item-view");
  itemView.setAttribute("tabindex", "0");
  
  itemViewHeader.setAttribute("class", "item-view__header");
  itemViewHeaderOptions.setAttribute("class", "item-view__header-options");

  closeItemViewOption.setAttribute("class", "item-view__header-option item-view__header-option--close-item-view");
  closeItemViewOption.setAttribute("tabindex", "0");

  closeItemViewIcon.setAttribute("class", "ti ti-chevrons-right item-view__header-option-icon");
  
  itemViewMainContent.setAttribute("class", "item-view__main-content");
  itemViewItemName.setAttribute("class", "item-view__item-name");  
  itemViewItemNameInputBox.setAttribute("class", "item-view__input-box");
  
  itemViewItemNameInputField.setAttribute("type", "text");
  itemViewItemNameInputField.setAttribute("placeholder", "Enter item name");
  itemViewItemNameInputField.setAttribute("class", "item-view__input-field");

  itemViewItemFeatures.setAttribute("class", "item-view__item-features");
  
  quantityFeature.setAttribute("class", "item-view__item-feature item-view__item-feature--quantity");
  quantityFeatureName.setAttribute("class", "item-view__item-feature-name");
  quantityFeatureIcon.setAttribute("class", "ti ti-circles item-view__item-feature-icon");
  quantityFeatureText.setAttribute("class", "item-view__item-feature-text");
  quantityFeatureValue.setAttribute("class", "item-view__item-feature-value");
  quantityFeatureValueInputBox.setAttribute("class", "item-view__item-feature-input-box");

  quantityFeatureValueInputField.setAttribute("type", "number");
  quantityFeatureValueInputField.setAttribute("min", String(DEFAULT_ITEM_QUANTITY));
  quantityFeatureValueInputField.setAttribute("value", String(DEFAULT_ITEM_QUANTITY));
  quantityFeatureValueInputField.setAttribute("class", "item-view__item-feature-input-field item-view__item-feature-input-field--numeric");

  checkedFeature.setAttribute("class", "item-view__item-feature item-view__item-feature--checked");
  checkedFeatureName.setAttribute("class", "item-view__item-feature-name");
  checkedFeatureIcon.setAttribute("class", "ti ti-checkbox item-view__item-feature-icon");
  checkedFeatureText.setAttribute("class", "item-view__item-feature-text");
  checkedFeatureValue.setAttribute("class", "item-view__item-feature-value");
  checkedFeatureValueInputBox.setAttribute("class", "item-view__item-feature-input-box");
  
  checkedFeatureValueInputField.setAttribute("type", "checkbox");
  checkedFeatureValueInputField.setAttribute("class", "item-view__item-feature-input-checkbox");

  marketFeature.setAttribute("class", "item-view__item-feature item-view__item-feature--market");
  marketFeatureName.setAttribute("class", "item-view__item-feature-name");
  marketFeatureIcon.setAttribute("class", "ti ti-building-store item-view__item-feature-icon");
  marketFeatureText.setAttribute("class", "item-view__item-feature-text");
  marketFeatureValue.setAttribute("class", "item-view__item-feature-value");
  marketFeatureValueInputBox.setAttribute("class", "item-view__item-feature-input-box");
  
  marketFeatureValueInputField.setAttribute("type", "text");
  marketFeatureValueInputField.setAttribute("placeholder", "Where you want to buy this item?");
  marketFeatureValueInputField.setAttribute("class", "item-view__item-feature-input-field");
  marketFeatureValueInputField.setAttribute("list", "market-suggestions");

  descriptionFeature.setAttribute("class", "item-view__item-feature item-view__item-feature--description");
  descriptionFeatureName.setAttribute("class", "item-view__item-feature-name");
  descriptionFeatureIcon.setAttribute("class", "ti ti-note item-view__item-feature-icon");
  descriptionFeatureText.setAttribute("class", "item-view__item-feature-text");
  descriptionFeatureValue.setAttribute("class", "item-view__item-feature-value");
  descriptionFeatureValueInputBox.setAttribute("class", "item-view__item-feature-input-box");

  descriptionFeatureValueInputField.setAttribute("placeholder", "Enter some description for this item");
  descriptionFeatureValueInputField.setAttribute("class", "item-view__item-feature-textarea");

  // Set text/HTML content
  quantityFeatureText.innerText = "Quantity";
  checkedFeatureText.innerText = "Checked";
  marketFeatureText.innerText = "Market";
  descriptionFeatureText.innerText = "Description";

  // Append child nodes
  itemViews.appendChild(itemView);

  itemView.appendChild(itemViewHeader);
  itemView.appendChild(itemViewMainContent);

  itemViewHeader.appendChild(itemViewHeaderOptions);
  itemViewHeaderOptions.appendChild(closeItemViewOption);
  closeItemViewOption.appendChild(closeItemViewIcon);

  itemViewMainContent.appendChild(itemViewItemName);
  itemViewMainContent.appendChild(itemViewItemFeatures);

  itemViewItemName.appendChild(itemViewItemNameInputBox);
  itemViewItemNameInputBox.appendChild(itemViewItemNameInputField);

  itemViewItemFeatures.appendChild(quantityFeature);
  itemViewItemFeatures.appendChild(checkedFeature);
  itemViewItemFeatures.appendChild(marketFeature);
  itemViewItemFeatures.appendChild(descriptionFeature);

  quantityFeature.appendChild(quantityFeatureName);
  quantityFeature.appendChild(quantityFeatureValue);

  quantityFeatureName.appendChild(quantityFeatureIcon);
  quantityFeatureName.appendChild(quantityFeatureText);

  quantityFeatureValue.appendChild(quantityFeatureValueInputBox);
  quantityFeatureValueInputBox.appendChild(quantityFeatureValueInputField);

  checkedFeature.appendChild(checkedFeatureName);
  checkedFeature.appendChild(checkedFeatureValue);

  checkedFeatureName.appendChild(checkedFeatureIcon);
  checkedFeatureName.appendChild(checkedFeatureText);

  checkedFeatureValue.appendChild(checkedFeatureValueInputBox);
  checkedFeatureValueInputBox.appendChild(checkedFeatureValueInputField);

  marketFeature.appendChild(marketFeatureName);
  marketFeature.appendChild(marketFeatureValue);

  marketFeatureName.appendChild(marketFeatureIcon);
  marketFeatureName.appendChild(marketFeatureText);

  marketFeatureValue.appendChild(marketFeatureValueInputBox);
  marketFeatureValueInputBox.appendChild(marketFeatureValueInputField);

  descriptionFeature.appendChild(descriptionFeatureName);
  descriptionFeature.appendChild(descriptionFeatureValue);

  descriptionFeatureName.appendChild(descriptionFeatureIcon);
  descriptionFeatureName.appendChild(descriptionFeatureText);

  descriptionFeatureValue.appendChild(descriptionFeatureValueInputBox);
  descriptionFeatureValueInputBox.appendChild(descriptionFeatureValueInputField);

  // Events
  itemView.addEventListener("focusout", (event) => {
    // Check if some of it's child items has not focus
    if (!itemView.contains(event.relatedTarget)) {
      hideItemView(itemView);
    }
  });
  closeItemViewOption.addEventListener("click", () => hideItemView(itemView));
  itemViewItemNameInputField.addEventListener("focusout", () => validateItemName(listId, categoryId, itemId, itemViewItemNameInputField.value));
  quantityFeatureValueInputField.addEventListener("change", () => updateItemQuantity(listId, categoryId, itemId, quantityFeatureValueInputField.value));
  checkedFeatureValueInputField.addEventListener("change", () => updateItemChecked(listId, categoryId, itemId, checkedFeatureValueInputField.checked));
  marketFeatureValueInputField.addEventListener("focusout", () => updateItemMarket(listId, categoryId, itemId, marketFeatureValueInputField.value));
  descriptionFeatureValueInputField.addEventListener("focusout", () => updateItemDescription(listId, categoryId, itemId, descriptionFeatureValueInputField.value));
}

/** 
 * Actions:
 * 
 * - If given item name is not valid and it's first time set, item will be 
 *   removed.
 * - If given item name is not valid but has a latest valid name, definitive
 *   item name will be the latest valid name.
 * - If given item name is valid, all references to it will be updated.
 * 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 * @param { string } newItemName - New name to associate item
 */
function validateItemName(listId, categoryId, itemId, newItemName) {
  let listType = getListType(listId);

  if (!(data[listType][listId].categories[categoryId].items[itemId] instanceof Object)) throw "Given item '" + itemId + "' does not exists in category '" + categoryId + "' assigned to list '" + listId + "'";
  if (typeof(newItemName) !== "string") throw "Item name must be a 'String', '" + typeof(newItemName) + "' given";

  newItemName = newItemName.trim();

  if (newItemName === "") {
    if (data[listType][listId].categories[categoryId].items[itemId].name === null) {
      deleteItem(listId, categoryId, itemId);
    } else {
      updateItemNameReferences(listId, categoryId, itemId);
    }
  } else {
    updateItemName(listId, categoryId, itemId, newItemName);
  }
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 * @param { string } newItemName - New name to associate item
 */
function updateItemName(listId, categoryId, itemId, newItemName) {
  data[getListType(listId)][listId].categories[categoryId].items[itemId].name = newItemName;
  updateItemNameReferences(listId, categoryId, itemId);
  updateListData();
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 */
function updateItemNameReferences(listId, categoryId, itemId) {
  let itemName = data[getListType(listId)][listId].categories[categoryId].items[itemId].name;
  let listViewItem = getListViewItem(listId, categoryId, itemId);
  let listViewItemNameField = listViewItem.querySelector(".list-view__item-input-field");
  let itemView = getItemView(listId, itemId);
  let itemViewItemNameField = itemView.querySelector(".item-view__item-name .item-view__input-field");

  listViewItemNameField.value = itemName;
  itemViewItemNameField.value = itemName;
}

/** 
 * @param { string } listId - Associated list ID.
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 * @return { element } Item document element associated to item ID
 */
function getListViewItem(listId, categoryId, itemId) {
  let category = getListViewCategoryItem(listId, categoryId);
  let items = category.querySelector(".list-view__items");
  let item = items.querySelector("[data-item-id='" + itemId + "']");

  if (!(item instanceof Element)) throw "Given item '" + itemId + "' does not exists in category '" + categoryId + "' assigned to list '" + listId + "'";

  return item;
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 */
function deleteItem(listId, categoryId, itemId) {
  deleteItemEntry(listId, categoryId, itemId);
  deleteItemElement(listId, categoryId, itemId);
  deleteItemView(listId, itemId);
  updateListData();
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 */
function deleteItemEntry(listId, categoryId, itemId) {
  delete data[getListType(listId)][listId].categories[categoryId].items[itemId];
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID 
 */
function deleteItemElement(listId, categoryId, itemId) {
  let itemElement = getListViewItem(listId, categoryId, itemId);
  itemElement.remove();
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } itemId - Associated item ID
 */
function deleteItemView(listId, itemId) {
  let itemView = getItemView(listId, itemId);
  itemView.remove();
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } itemId - Associated item ID
 * @return { element } Associated item view from given item ID
 * @throws { Error } If item view associated to item ID does not exist
 */
function getItemView(listId, itemId) {
  let listView = getListView(listId);
  let itemViews = listView.querySelector(".item-views");
  let itemView = itemViews.querySelector("[data-item-id='" + itemId + "']");

  if (!(itemView instanceof Element)) throw "Given item '" + itemId + "' does not have any associated view in list '" + listId + "'";
  
  return itemView;
}

/**
 * @param { element } tooltip
 */
function openTooltip(tooltip) {
  if (!(tooltip instanceof Element)) throw "Tooltip must be an 'Element', '" + typeof(tooltip) + "' given";
  activateElement(tooltip);
  tooltip.focus();
}

/** 
 * @param { element } tooltip
 */
function closeTooltip(tooltip) {
  if (!(tooltip instanceof Element)) throw "Tooltip must be an 'Element', '" + typeof(tooltip) + "' given";
  deactivateElement(tooltip);
}

/** 
 * @param { string } listId - Associated list ID
 */
function showDeleteListConfirmationModal(listId) {
  let listView = getListView(listId);
  let modals = listView.querySelector(".list-view__modals");
  let deleteListConfirmationModal = modals.querySelector(".list-view__modal.list-view__modal--delete-shopping-list-confirmation");

  showModal(listId, deleteListConfirmationModal);
}

/** 
 * @param { string } listId - Associated list ID
 */
function showShareWithModal(listId) {
  let listView = getListView(listId);
  let modals = listView.querySelector(".list-view__modals");
  let shareWithModal = modals.querySelector(".list-view__modal.list-view__modal--share-with");

  showModal(listId, shareWithModal);
}

/** 
 * @param { string } listId - Associated list ID
 * @param { element } modal
 */
function showModal(listId, modal) {
  hideCurrentActiveListView(listId);
  hideListViewCurrentActiveModal(listId);
  showListView(listId);
  showModalItem(modal);
}

/** 
 * @param { element } modal
 */
function showModalItem(modal) {
  if (!(modal instanceof Element)) throw "Modal must be an 'Element', '" + typeof(modal) + "' given";
  activateElement(modal);
  modal.focus();
}

/** 
 * Hide current active modal
 * 
 * @param { string } listId - Associated list ID
 */
function hideListViewCurrentActiveModal(listId) {
  let activeModal = getListViewCurrentActiveModal(listId);
  if (activeModal instanceof Element) hideModal(activeModal);
}

/** 
 * @param { element } modal
 */
function hideModal(modal) {
  if (!(modal instanceof Element)) throw "Modal must be an 'Element', '" + typeof(modal) + "' given";
  deactivateElement(modal);
}

/** 
 * @param listId
 */
function getListViewCurrentActiveModal(listId) {
  let listView = getListView(listId);
  let modals = listView.querySelector(".list-view__modals");
  let activeModal = modals.querySelector(".list-view__modal.active");
  return activeModal;
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } itemId - Associated item ID
 */
function showItemView(listId, itemId) {
  let itemView = getItemView(listId, itemId);
  
  hideCurrentActiveItemView(listId);
  showItemViewElement(itemView);
}

/** 
 * @param { string } listId - Associated list ID
 */
function hideCurrentActiveItemView(listId) {
  let listView = getListView(listId);
  let itemViews = listView.querySelector(".item-views");
  let activeItemView = itemViews.querySelector(".item-view.active");

  if (activeItemView instanceof Element) hideItemView(activeItemView);
}

/** 
 * @param { element } itemView
 */
function showItemViewElement(itemView) {
  if (!(itemView instanceof Element)) throw "Item view must be an 'Element', '" + typeof(itemView) + "' given";
  activateElement(itemView);
}

/** 
 * @param { element } itemView
 */
function hideItemView(itemView) {
  if (!(itemView instanceof Element)) throw "Item view must be an 'Element', '" + typeof(itemView) + "' given";
  deactivateElement(itemView);
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } itemId - Associated list ID
 * @return { element } Item view associated to given item ID
 * @throws { Error } If item view does not exist
 */
function getItemView(listId, itemId) {
  let listView = getListView(listId);
  let itemViews = listView.querySelector(".item-views");
  let itemView = itemViews.querySelector("[data-item-id='" + itemId + "']");

  if (!(itemView instanceof Element)) throw "Given item '" + itemId + "' does not have any associated view in list '" + listId +"'";

  return itemView;
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 * @param { boolean } checked
 */
function updateItemChecked(listId, categoryId, itemId, checked) {
  data[getListType(listId)][listId].categories[categoryId].items[itemId].checked = checked;
  updateItemCheckedReferences(listId, categoryId, itemId);
  updateListData();
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 */
function updateItemCheckedReferences(listId, categoryId, itemId) {
  let checked = data[getListType(listId)][listId].categories[categoryId].items[itemId].checked;
  let itemElement = getItemElement(listId, categoryId, itemId);
  let itemElementCheckbox = itemElement.querySelector(".list-view__item-checkbox");
  let itemView = getItemView(listId, itemId);
  let itemViewCheckbox = itemView.querySelector(".item-view__item-feature--checked .item-view__item-feature-input-checkbox");

  itemElementCheckbox.checked = checked;
  itemViewCheckbox.checked = checked;  
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @return { element } Category element associated to given category ID in list view
 * @throws { Error } If category element is not found
 */
function getCategoryElement(listId, categoryId) {
  let listView = getListView(listId);
  let categories = listView.querySelector(".list-view__categories");
  let category = categories.querySelector("[data-category-id='" + categoryId + "']");

  if (!(category instanceof Element)) throw "Category '" + categoryId + "' does not exist in list '" + listId + "' view";
  
  return category;
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID 
 * @param { string } itemId - Associated item ID
 * @return { element } Item element associated to given item ID in list view
 * @throws { Error } If item does not exist in list view
 */
function getItemElement(listId, categoryId, itemId) {
  let categoryElement = getCategoryElement(listId, categoryId);
  let items = categoryElement.querySelector(".list-view__items");
  let item = items.querySelector("[data-item-id='" + itemId + "']");

  if (!(item instanceof Element)) throw "Item '" + itemId + "' does not exist in category '" + categoryId + "' associated in list '" + listId + "' view";

  return item;
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 * @param { string } quantity - Positive value higher than 0
 */
function updateItemQuantity(listId, categoryId, itemId, quantity) {
  if (isValidItemQuantity(quantity)) {
    data[getListType(listId)][listId].categories[categoryId].items[itemId].quantity = (String(quantity) !== "")
      ? parseInt(quantity)
      : DEFAULT_ITEM_QUANTITY;
    updateItemQuantityReferences(listId, categoryId, itemId);
    updateListData();
  }
}

/** 
 * @param { number } quantity - Number higher than 0
 * @return { boolean } Indicating if quantity is valid or not
 * @throws { Error } If quantity not passes validators
 */
function isValidItemQuantity(quantity) {
  if (!isNumeric(quantity)) throw "Quantity must be a 'number', '" + typeof(quantity) + "' given";
  if (parseInt(quantity) <= 0) throw "Quantity must be higher than 0";
  return true;
}

/**
 * @param { string } string
 * @return { boolean } Indicating if string is a number
 */
function isNumeric(string) {
  try {
    parseInt(string);
    return true;
  } catch (e) {
    return false;
  }
}

/** 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 */
function updateItemQuantityReferences(listId, categoryId, itemId) {
  let quantity = data[getListType(listId)][listId].categories[categoryId].items[itemId].quantity;
  let listViewItemElement = getItemElement(listId, categoryId, itemId);
  let listViewItemQuantity = listViewItemElement.querySelector(".list-view__item-quantity");
  let itemView = getItemView(listId, itemId);
  let itemQuantityFeatureInputField = itemView.querySelector(".item-view__item-feature-input-field--numeric");

  listViewItemQuantity.innerText = String(quantity);
  itemQuantityFeatureInputField.value = quantity;
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 * @param { string } market
 */
function updateItemMarket(listId, categoryId, itemId, market) {
  data[getListType(listId)][listId].categories[categoryId].items[itemId].market = market.trim();
  updateItemMarketReferences(listId, categoryId, itemId);
  reloadMarketSuggestions();
  updateListData();
}

/** 
 * @param { string } market
 * @return { boolean } Indicating if given market name is valid.
 */
function isValidMarketName(market) {
  if (typeof(market) !== "string") throw "Market must be a 'String', '" + typeof(market) + "' given";
  return market.trim() !== "";
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 */
function updateItemMarketReferences(listId, categoryId, itemId) {
  let market = data[getListType(listId)][listId].categories[categoryId].items[itemId].market;
  let itemView = getItemView(listId, itemId);
  let marketFeatureInputField = itemView.querySelector(".item-view__item-feature--market .item-view__item-feature-input-field");

  marketFeatureInputField.value = market;
}

function reloadMarketSuggestions() {
  reloadMarketSuggestionsArray();
  reloadMarketSuggestionsDatalist();
}

function reloadMarketSuggestionsArray() {
  markets = [];

  for (let listType of getObjectKeys(data)) {
    for (let listId of getObjectKeys(data[listType])) {
      for (let categoryId of getObjectKeys(data[listType][listId].categories)) {
        for (let itemId of getObjectKeys(data[listType][listId].categories[categoryId].items)) {
          let market = data[listType][listId].categories[categoryId].items[itemId].market;
          if (isValidMarketName(market) && !markets.includes(market)) {
            markets.push(market);
          }
        }
      }
    }
  }

  markets.sort();
}

function reloadMarketSuggestionsDatalist() {
  marketSuggestions.innerHTML = "";

  for (let market of markets) {
    addMarketSuggestion(market);
  }
}

/**
 * @param { string } market
 */
function addMarketSuggestion(market) {
  // DOM elements
  let option = document.createElement("option");

  // Set attributes
  option.setAttribute("value", market);

  // Append child nodes
  marketSuggestions.appendChild(option);
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 * @param { string } description
 */
function updateItemDescription(listId, categoryId, itemId, description) {
  data[getListType(listId)][listId].categories[categoryId].items[itemId].description = description.trim();
  updateItemDescriptionReferences(listId, categoryId, itemId);
  updateListData();
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 */
function updateItemDescriptionReferences(listId, categoryId, itemId) {
  let description = data[getListType(listId)][listId].categories[categoryId].items[itemId].description;
  let itemView = getItemView(listId, itemId);
  let descriptionFeatureInputField = itemView.querySelector(".item-view__item-feature--description .item-view__item-feature-textarea");

  descriptionFeatureInputField.innerText = description;
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } email
 */
function validateSharedEmail(listId, email) {
  let listView = getListView(listId);
  let shareWithModal = listView.querySelector(".list-view__modal--share-with");
  let addEmailErrors = shareWithModal.querySelector(".list-view__modal-add-email-to-shared-list-errors");

  try {
    addEmailErrors.innerHTML = "";

    if (isSharedEmailValid(listId, email)) addEmailToSharedList(listId, email.toLowerCase());
  } catch (error) {
    if (error instanceof ValidationError) {
      addEmailErrors.innerHTML = error.message;
    } else {
      console.error(error);
    }
  }
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } email
 * @return { boolean } Indicating if email is valid
 */
function isSharedEmailValid(listId, email) {
  if (typeof(email) !== "string") throw "Email must be a 'String', '" + typeof(email) + "' given";
  if (!REGEX_EMAIL.exec(email)) throw new ValidationError("Given email does not have a valid format. Example: john.doe@mail.com");
  if (isEmailInSharedList(listId, email)) throw new ValidationError("Given email is currently in email shared list.");

  return true;
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } email
 * @return { boolean } Indicating if email is in email shared list data.
 */
function isEmailInSharedList(listId, email) {
  return data[getListType(listId)][listId].sharedEmailList.includes(email);
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } email
 */
function addEmailToSharedList(listId, email) {
  addEmailToSharedListData(listId, email);
  addEmailToSharedListElement(listId, email);
  reloadSharedWithEmailModal(listId);
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } email
 */
function addEmailToSharedListData(listId, email) {
  data[getListType(listId)][listId].sharedEmailList.push(email);
  updateListData();
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } email
 */
function addEmailToSharedListElement(listId, email) {
  // DOM elements
  let listView = getListView(listId);
  let shareWithModal = listView.querySelector(".list-view__modal--share-with");
  let sharedEmailList = shareWithModal.querySelector(".list-view__modal-shared-emails");
  let sharedEmailItem = document.createElement("div");
  let sharedEmailInputBox = document.createElement("div");
  let sharedEmailInputUserIcon = document.createElement("i");
  let sharedEmailInputField = document.createElement("input");
  let sharedEmailInputOptions = document.createElement("div");
  let deleteSharedEmailOption = document.createElement("div");
  let deleteSharedEmailIcon = document.createElement("i");

  // Set attributes
  sharedEmailItem.setAttribute("class", "list-view__modal-shared-email");
  sharedEmailItem.setAttribute("data-email-address", email);

  sharedEmailInputBox.setAttribute("class", "list-view__modal-shared-email-input-box");
  sharedEmailInputUserIcon.setAttribute("class", "ti ti-user-circle list-view__modal-shared-email-input-icon");
  
  sharedEmailInputField.setAttribute("type", "text");
  sharedEmailInputField.setAttribute("class", "list-view__modal-shared-email-input-field");
  sharedEmailInputField.setAttribute("value", email);

  sharedEmailInputOptions.setAttribute("class", "list-view__modal-shared-email-input-options");

  deleteSharedEmailOption.setAttribute("class", "list-view__modal-shared-email-input-option list-view__modal-shared-email-input-option--delete-shared-email");
  deleteSharedEmailOption.setAttribute("tabindex", "0");

  deleteSharedEmailIcon.setAttribute("class", "ti ti-trash list-view__modal-shared-email-input-option-icon");

  // Append child nodes
  sharedEmailList.appendChild(sharedEmailItem);
  sharedEmailItem.appendChild(sharedEmailInputBox);

  sharedEmailInputBox.appendChild(sharedEmailInputUserIcon);
  sharedEmailInputBox.appendChild(sharedEmailInputField);
  sharedEmailInputBox.appendChild(sharedEmailInputOptions);

  sharedEmailInputOptions.appendChild(deleteSharedEmailOption);
  deleteSharedEmailOption.appendChild(deleteSharedEmailIcon);

  // Events
  deleteSharedEmailOption.addEventListener("click", () => deleteSharedEmail(listId, email));
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } email
 */
function deleteSharedEmail(listId, email) {
  deleteSharedEmailEntry(listId, email);
  deleteSharedEmailElement(listId, email);
  reloadSharedWithEmailModal(listId);
  updateListData();
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } email
 */
function deleteSharedEmailEntry(listId, email) {
  let listType = getListType(listId);
  let sharedEmailList = data[listType][listId].sharedEmailList;
  let indexOfEmail = sharedEmailList.indexOf(email);

  if (indexOfEmail !== -1) {
    data[listType][listId].sharedEmailList.splice(indexOfEmail, 1);
  } 
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } email
 */
function deleteSharedEmailElement(listId, email) {
  let listView = getListView(listId);
  let shareWithModal = listView.querySelector(".list-view__modal--share-with");
  let sharedEmailList = shareWithModal.querySelector(".list-view__modal-shared-emails");
  let sharedEmailElement = sharedEmailList.querySelector("[data-email-address='" + email + "']");

  if (!(sharedEmailElement instanceof Element)) throw "Given email '" + email + "' has no associated element in list '" + listId + "'";

  sharedEmailElement.remove();
}

/**
 * @param { element } field
 */
function editInputField(field) {
  if (!(field instanceof Element)) throw "Input field must be an 'Element', '" + typeof(field) + "' given";

  field.removeAttribute("readonly");
  field.focus();
}

/**
 * @param { element } field
 */
function lockInputField(field) {
  if (!(field instanceof Element)) throw "Input field must be an 'Element', '" + typeof(field) + "' given";

  field.setAttribute("readonly", true);
}

/**
 * @param { string } listId - Associated list ID
 * @return { string } String indicating list type of given list ID
 * @throws { Error } If given list ID has not associated any type
 */
function getListType(listId) {
  for (let listType of getObjectKeys(data)) {
    if (data[listType][listId] instanceof Object) return listType; 
  }
  
  throw "Given list '" + listId + "' does not exist in any of available list types [" + getObjectKeys(LIST_TYPES).join(", ") + "]";
}

/**
 * @param { string } listType
 * @return { boolean } Indicating if given list type is in LIST_TYPES constant
 */
function existsListType(listType) {
  for (let type of getObjectKeys(LIST_TYPES)) {
    if (listType === LIST_TYPES[type]) return true;
  }

  return false;
}

/**
 * Make an AJAX request to some resource.
 * 
 * @param { string } httpMethod - One value of HTTP_METHODS constant
 * @param { string } url - URL of resource
 * @param { object } parameters - Parameters you want to send in request 
 * @param { boolean } async - Make an ASYNC request?
 * @param { function } callback - Must receive by parameter an XMLHttpRequest object
 */
function ajax(httpMethod, url, parameters, async, callback) {
  let xhttp = new XMLHttpRequest();
  xhttp.addEventListener("readystatechange", () => {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      callback(xhttp);
    }
  });
  xhttp.open(httpMethod, url, async);
  xhttp.setRequestHeader("X-CSRF-TOKEN", document.querySelector("meta[name='csrf-token']").getAttribute("content"));

  if (httpMethod === HTTP_METHODS.post) {
    let formData = new FormData();

    for (let key in parameters) {
      let value = (parameters[key] instanceof Object)
        ? JSON.stringify(parameters[key])
        : parameters[key];
      formData.append(key, value);
    }
    
    xhttp.send(formData);
  } else {
    xhttp.send(JSON.stringify(parameters));
  }
}

function syncListData() {
  console.log("Syncing data...");
  ajax(HTTP_METHODS.get, ENDPOINT_SYNC_DATA, {}, false, loadListData);
}

/**
 * @param { XMLHttpRequest } xhttp
 */
function loadListData(xhttp) {
  let response = JSON.parse(xhttp.response);

  if (response.status === 200) {
    let updatedData = response.lists;
    syncShoppingLists(updatedData);  
  } else {
    throw response.msg;
  }
}

/**
 * Sync shopping lists
 */
function syncShoppingLists(updatedData) {
  // Update existent data
  for (let listType of getObjectKeys(data)) {
    for (let listId of getObjectKeys(data[listType])) {
      if (updatedData[listType][listId] !== undefined) {
        if (!existsListView(listId)) addListView(listId);

        for (let categoryId of getObjectKeys(data[listType][listId].categories)) {
          if (updatedData[listType][listId].categories[categoryId] !== undefined) {
            if (!existsCategoryInListView(listId, categoryId)) addCategoryItem(listId, categoryId);
            for (let itemId of getObjectKeys(data[listType][listId].categories[categoryId].items)) {
              if (updatedData[listType][listId].categories[categoryId].items[itemId] !== undefined) {
                data[listType][listId].categories[categoryId].items[itemId] = updatedData[listType][listId].categories[categoryId].items[itemId];
                if (!existsItemElementInListView(listId, categoryId, itemId)) addItemToCategory(listId, categoryId, itemId);
                if (!existsItemView(listId, itemId)) addItemView(listId, categoryId, itemId);
                updateItemReferences(listId, categoryId, itemId);
              } else {
                deleteItem(listId, categoryId, itemId);
              }
            }
            data[listType][listId].categories[categoryId] = updatedData[listType][listId].categories[categoryId];
            updateCategoryNameReferences(listId, categoryId);
          } else {
            deleteCategory(listId, categoryId);
          }
        }
        data[listType][listId] = updatedData[listType][listId];
        updateListNameReferences(listId);
        loadEmailList(listId);
        reloadListViewCTAMessages(listId);
      } else {
        deleteList(listId);
      }
    }
  }

  // Add pending data
  for (let listType of getObjectKeys(updatedData)) {
    for (let listId of getObjectKeys(updatedData[listType])) {
      if (data[listType][listId] === undefined) {
        data[listType][listId] = {
          name: "",
          categories: {},
          sharedEmailList: []
        };
        addListItem(listType, listId);
        addListView(listType, listId);

        for (let categoryId of getObjectKeys(updatedData[listType][listId].categories)) {
          if (data[listType][listId].categories[categoryId] === undefined) {
            data[listType][listId].categories[categoryId] = {
              name: "",
              items: {}
            };
            addCategoryItem(listId, categoryId);

            for (let itemId of getObjectKeys(updatedData[listType][listId].categories[categoryId].items)) {
              if (data[listType][listId].categories[categoryId].items[itemId] === undefined) {
                data[listType][listId].categories[categoryId].items[itemId] = updatedData[listType][listId].categories[categoryId].items[itemId]
                if (!existsItemElementInListView(listId, categoryId, itemId)) addItemToCategory(listId, categoryId, itemId);
                if (!existsItemView(listId, itemId)) addItemView(listId, categoryId, itemId);
                updateItemReferences(listId, categoryId, itemId);
              }
            }
            data[listType][listId].categories[categoryId] = updatedData[listType][listId].categories[categoryId];
            updateCategoryNameReferences(listId, categoryId);
          }
        }
        data[listType][listId] = updatedData[listType][listId];
        updateListNameReferences(listId);
        loadEmailList(listId);
        reloadListViewCTAMessages(listId);
      }
    }
  }

  console.log("Data fully synced");

  reloadCTAMessages();
}

/**
 * @param { string } listId - Associated list ID
 */

function inactivityActions() {
  window.onload = resetTimer;
  // DOM Events
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;


  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(() => {
      syncListData();
      resetTimer();
    }, IDLE_SECONDS * 1000);
  }
}

/**
 * @param { string } listId - Associated list ID
 * @return { boolean } Indicating if list view exist
 */
function existsListView(listId) {
  try {
    getListView(listId);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @return { boolean } Indicating if category exists in list view
 */
function existsCategoryInListView(listId, categoryId) {
  try {
    getCategoryElement(listId, categoryId);
    return true;
  } catch (e) {
    return false
  }
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 * @return { boolean } Indicating if item exists in list view
 */
function existsItemElementInListView(listId, categoryId, itemId) {
  try {
    getItemElement(listId, categoryId, itemId);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @param { string } listId - Associated list ID
 * @param { string } itemId - Associated item ID
 * @return { boolean } Indicating if item view exists in list view
 */
function existsItemView(listId, itemId) {
  try {
    getItemView(listId, itemId);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Update all item references
 * 
 * @param { string } listId - Associated list ID
 * @param { string } categoryId - Associated category ID
 * @param { string } itemId - Associated item ID
 */
function updateItemReferences(listId, categoryId, itemId) {
  updateItemNameReferences(listId, categoryId, itemId);
  updateItemQuantityReferences(listId, categoryId, itemId);
  updateItemCheckedReferences(listId, categoryId, itemId);
  updateItemMarketReferences(listId, categoryId, itemId);
  updateItemDescriptionReferences(listId, categoryId, itemId);
}

/**
 * @param { string } listId - Associated list ID
 */
function loadEmailList(listId) {
  let listView = getListView(listId);
  let shareWithModal = listView.querySelector(".list-view__modal--share-with");
  let sharedEmailList = shareWithModal.querySelector(".list-view__modal-shared-emails");

  sharedEmailList.innerHTML = "";

  data[getListType(listId)][listId].sharedEmailList.forEach(email => {
    addEmailToSharedListElement(listId, email);
  });
}

function updateListData() {
  ajax(HTTP_METHODS.post, ENDPOINT_UPDATE_DATA, { data: data }, true, (xhttp) => {
    let response = JSON.parse(xhttp.response);

    if (response.status === 200) {
      console.log(response.msg ?? "Data successfully updated");
    } else {
      console.error(response.msg ?? "Something went wrong updating data");
    }
  });
}

function openAside() {
  activateElement(aside);
  aside.focus();
}

function closeAside() {
  deactivateElement(aside);
}