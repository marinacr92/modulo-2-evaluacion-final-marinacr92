'use strict';
const btnSearch = document.querySelector('.js-btn-search'),
  btnReset = document.querySelector('.js-btn-reset'),
  ulSearch = document.querySelector('.js-ul-search-list'),
  ulFavorites = document.querySelector('.js-ul-favorite'),
  inputSearch = document.querySelector('.js-input-search'),
  favoritesSection = document.querySelector('.js-favorites'),
  btnResetFav = document.querySelector('.js-reset-fav');
let searchList = [],
  favoritesList = [];
function createImg(e) {
  const t = document.createElement('img');
  return (
    null === e
      ? t.setAttribute(
          'src',
          'https://via.placeholder.com/200x200/d3d3d3d3/666666/?text=Sin+foto'
        )
      : t.setAttribute('src', e),
    t.setAttribute('class', 'drink-img'),
    t
  );
}
function renderDrink(e, t) {
  const s = document.createElement('li'),
    r = document.createElement('article'),
    n = document.createElement('h3'),
    i = createImg(e.strDrinkThumb),
    a = document.createTextNode(e.strDrink);
  if (
    (s.setAttribute('id', e.idDrink),
    r.setAttribute('class', 'drink-article'),
    n.setAttribute('class', 'drink-name'),
    s.appendChild(r),
    r.appendChild(n),
    n.appendChild(a),
    t)
  ) {
    const t = document.createElement('div'),
      n = document.createElement('div'),
      a = document.createElement('i');
    t.setAttribute('class', 'container-img'),
      n.setAttribute('class', 'container-icon'),
      a.setAttribute('id', e.idDrink),
      a.setAttribute('class', 'fa-solid fa-heart-crack'),
      ulFavorites.appendChild(s),
      r.appendChild(t),
      t.appendChild(i),
      t.appendChild(n),
      n.appendChild(a),
      a.addEventListener('click', handleClickBtnHeart);
  } else
    r.appendChild(i),
      ulSearch.appendChild(s),
      s.addEventListener('click', addRemoveItemsFav);
}
function renderDrinksList(e, t) {
  if (null !== e) for (const s of e) renderDrink(s, t);
}
function addSelectedClass(e) {
  null !== e && e.classList.add('selected'), showBtnResetFav();
}
function removeSelectedClass(e) {
  null !== e && e.classList.remove('selected'), showBtnResetFav();
}
function handleEnterKey(e) {
  13 === e.keyCode && handleClickSearch(e);
}
function handleClickSearch(e) {
  e.preventDefault(), (ulSearch.innerHTML = '');
  const t = inputSearch.value;
  fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + t)
    .then((e) => e.json())
    .then((e) => {
      (searchList = e.drinks),
        renderDrinksList(searchList),
        addSelectedFromLocal();
    });
}
function selectItems(e) {
  ulFavorites.innerHTML = '';
  const t = e.currentTarget.id,
    s = searchList.find((e) => e.idDrink === t),
    r = favoritesList.findIndex((e) => e.idDrink === t);
  -1 === r
    ? (favoritesList.push(s), addSelectedClass(e.currentTarget))
    : (favoritesList.splice(r, 1), removeSelectedClass(e.currentTarget)),
    localStorage.setItem('favList', JSON.stringify(favoritesList)),
    renderDrinksList(favoritesList, !0);
}
function handleClickBtnHeart(e) {
  const t = e.currentTarget.id,
    s = favoritesList.findIndex((e) => e.idDrink === t),
    r = ulSearch.querySelector(`[id='${t}']`);
  -1 !== s &&
    (favoritesList.splice(s, 1),
    (ulFavorites.innerHTML = ''),
    localStorage.setItem('favList', JSON.stringify(favoritesList)),
    renderDrinksList(favoritesList, !0)),
    removeSelectedClass(r);
}
function showBtnResetFav() {
  favoritesList && favoritesList.length > 0
    ? btnResetFav.classList.remove('hidden')
    : btnResetFav.classList.add('hidden');
}
btnSearch.addEventListener('click', handleClickSearch),
  document.addEventListener('keypress', handleEnterKey);
const localStorageData = JSON.parse(localStorage.getItem('favList'));
function addSelectedFromLocal() {
  if (localStorageData)
    for (const e of localStorageData) {
      addSelectedClass(ulSearch.querySelector(`[id='${e.idDrink}']`));
    }
}
function handleClickResetInput(e) {
  e.preventDefault(), (inputSearch.value = '');
}
function handleClickResetFav(e) {
  e.preventDefault(),
    (favoritesList = []),
    localStorage.clear('favList'),
    (ulFavorites.innerHTML = '');
  const t = ulSearch.querySelectorAll('.selected');
  for (const e of t) removeSelectedClass(e);
}
localStorageData &&
  ((favoritesList = localStorageData), renderDrinksList(favoritesList, !0)),
  btnResetFav.addEventListener('click', handleClickResetFav),
  btnReset.addEventListener('click', handleClickResetInput),
  fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita')
    .then((e) => e.json())
    .then((e) => {
      console.log('data.drinks', e.drinks),
        (searchList = e.drinks),
        renderDrinksList(searchList),
        addSelectedFromLocal();
    });
