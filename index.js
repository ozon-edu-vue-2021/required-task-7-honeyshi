const usersListContainer = document.querySelector(".contacts-list");
const userDetailsContainer = document.querySelector(".details-view");
const friendsListContainer = document.querySelector(".friends-list");
const userDetailsHeader = userDetailsContainer.querySelector(
  ".person-name-header"
);
const backButton = document.querySelector(".back");
const showPeopleCount = 3;
let popularPeople = [];
let people = [];
let peopleNamesMap = null;

const initialState = () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((json) => renderUsersList(json));
};

const appendListElement = (friends) => {
  friends.forEach((friend) => {
    const listElement = document.createElement("li");
    listElement.innerHTML = '<i class="fa fa-male"></i><span></span>';
    listElement.querySelector("span").textContent = peopleNamesMap.get(friend);
    friendsListContainer.appendChild(listElement);
  });
};

const getSectionHeaderElement = (title) => {
  const sectionHeader = document.createElement("li");
  sectionHeader.classList.add("people-title");
  sectionHeader.textContent = title;
  return sectionHeader;
};

const renderUserFriends = (friends) => {
  userDetailsContainer.style.zIndex = "10";

  friendsListContainer.appendChild(getSectionHeaderElement("Друзья"));
  appendListElement(friends);

  friendsListContainer.appendChild(getSectionHeaderElement("Не в друзьях"));
  const notFriends = people
    .filter((person) => !friends.includes(person.id))
    .map((person) => person.id)
    .slice(0, showPeopleCount);
  appendListElement(notFriends);

  friendsListContainer.appendChild(getSectionHeaderElement("Популярные люди"));
  appendListElement(popularPeople);
};

const onUserClick = (event) => {
  const userRow = event.target.closest("li");
  userDetailsHeader.textContent = userRow.userName;
  renderUserFriends(userRow.friends);
};

const getPopularPeople = (list) => {
  const peopleFriendsCount = new Map();
  const peopleNames = new Map();
  list.forEach((person) => {
    peopleNames.set(person.id, person.name);
    person.friends.forEach((friend) => {
      if (peopleFriendsCount.has(friend))
        peopleFriendsCount.set(friend, peopleFriendsCount.get(friend) + 1);
      else peopleFriendsCount.set(friend, 1);
    });
  });
  const sortedPeopleFriendsCount = new Map(
    [...peopleFriendsCount.entries()].sort((a, b) => b[1] - a[1])
  );
  const popularPeopleId = [...sortedPeopleFriendsCount.keys()].slice(
    0,
    showPeopleCount
  );
  peopleNamesMap = peopleNames;
  return popularPeopleId;
};

const renderUsersList = (list) => {
  people = list;
  list.forEach((person) => {
    var listElement = document.createElement("li");
    listElement.innerHTML = "<strong></strong>";
    listElement.querySelector("strong").textContent = person.name;
    listElement.friends = person.friends;
    listElement.userName = person.name;
    usersListContainer.appendChild(listElement);
  });
  usersListContainer.addEventListener("click", onUserClick);
  popularPeople = getPopularPeople(list);
};

const onBackClick = () => {
  userDetailsContainer.style.zIndex = "0";
  friendsListContainer.innerHTML = "";
};

initialState();
backButton.addEventListener("click", onBackClick);
