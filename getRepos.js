const searchInput = document.querySelector('.search__input')
const searchSuggestions = document.querySelector('.suggestions')
const debounce = (fn, debounceTime) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, debounceTime);
    }
};

searchInput.addEventListener('keyup', debounce(async (e) => {
    if(!e.target.value.length) {
        let repos = document.querySelectorAll('.suggestions__item');
        repos.forEach(e => e.remove());
    } else {
        let result = await fetch(`https://api.github.com/search/repositories?q=${e.target.value}&order=desc&per_page=5`)
        if (result.ok) {
            result.json()
            .then(repo => {
                let repos = document.querySelectorAll('.suggestions__item');
                repos.forEach(e => e.remove());

                repo.items.forEach(e => {
                      let li = document.createElement('li');
                      li.className = 'suggestions__item';
                      li.textContent = e.name;
                      li.owner = e.owner.login;
                      li.stars = e.watchers;
                      searchSuggestions.appendChild(li);
                })

                const repoWrapper = document.querySelector('.repo__wrapper')

                //Adding event listener to the parent
                searchSuggestions.addEventListener('click', (e) => {
                    const repoWrap = document.createElement('div')
                    repoWrap.classList.add('repo__wrap')

                    //Create wrapper for info about repo
                    const repoInfo = document.createElement('div');
                    repoInfo.classList.add('repo__info');

                    //Create span with name of the repo
                    const repoName = document.createElement('p');
                    repoName.classList.add('repo__name');
                    repoName.textContent = 'Name: ' + e.target.textContent;

                    //Create span with owner of the repo
                    const repoOwner = document.createElement('p');
                    repoOwner.classList.add('repo__owner');
                    repoOwner.textContent = 'Owner: ' + e.target.owner;

                    //Create span with stars of the repo
                    const repoStars = document.createElement('p');
                    repoStars.classList.add('repo__stars');
                    repoStars.textContent = 'Stars: ' + e.target.stars;

                    //Create button that deletes this repo
                    const repoDeleteBtn = document.createElement('button');
                    repoDeleteBtn.classList.add('repo__delete');
                    repoDeleteBtn.textContent = 'Delete';

                    //Adding elements to the info wrapper;
                    repoInfo.appendChild(repoName);
                    repoInfo.appendChild(repoOwner);
                    repoInfo.appendChild(repoStars);

                    //Adding info to the wrapper
                    repoWrap.appendChild(repoInfo);
                    repoWrap.appendChild(repoDeleteBtn);

                    const repoWrapper = document.querySelector('.repo__wrapper');
                    repoWrapper.appendChild(repoWrap);

                    searchInput.value = "";

                    let repos = document.querySelectorAll('.suggestions__item');
                    repos.forEach(e => e.remove());
                }, {once: true});

            });

        }

    }
}, 700))

const repoWrapper = document.querySelector('.repo__wrapper');

repoWrapper.addEventListener('click', (e) => {
    let target = e.target;
    if (target.className !== 'repo__delete') return;

    let repoWrap = target.closest('.repo__wrap')
    repoWrap.remove();

})




