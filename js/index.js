const form = document.querySelector('#github-form')
const userList = document.querySelector('#user-list')

const searchGitHub = (e) => {
  const radioCheckUsers = document.querySelector('#radioCheckUsers').checked
  radioCheckUsers ? submitFetchUsers(e) : submitFetchRepos(e)
}

const submitFetchRepos = (e) => {
  e.preventDefault()
  const searchValue = document.querySelector('#search').value
  fetch(`https://api.github.com/search/repositories?q=${searchValue}`,{
    method: 'GET',
    headers: {
      Accept: "application/vnd.github.v3+json"
    }
  })
    .then(res => res.json())
    .then(handleRepoSearchSuccess)
    .catch(handleError)
}

const submitFetchUsers = (e) => {
  e.preventDefault()
  const searchValue = document.querySelector('#search').value
  fetch(`https://api.github.com/search/users?q=${searchValue}`,{
    method: 'GET',
    headers: {
      Accept: "application/vnd.github.v3+json"
    }
  })
    .then(res => res.json())
    .then(handleSearchSuccess)
    .catch(handleError)
}

const handleRepoSearchSuccess = (repos) => {
  userList.innerHTML = ''
  repos.items.forEach(renderRepos)
}

const renderRepos = (repo) => {
  const div = document.createElement('div')
  const publicPrivateBadge = repo.private ? 'Private' : 'Public'
  const language = repo.language ? repo.language : "Language N/A"
  const license = repo.license ? repo.license.name : "License N/A"
  const description = repo.description ? repo.description : ""
  div.innerHTML = `
  <div class="container mt-3">
      <div class="repo-header">
          <div>
              <a href="${repo.html_url}" target="_blank" class="repo-title">${repo.name}</a>
              <span class="public-badge">${publicPrivateBadge}</span>
              
              <div class="description">
                  ${description}
              </div>
              <div class="repo-info">
                  <span class="language-color"></span>
                  <span>${language}</span>
                  <span class="mx-2">•</span>
                  <span>${license}</span>
                  <span class="mx-2">•</span>
                  <span>Updated on ${repo["updated_at"].slice(0,10)}</span>
              </div>
          </div>
          <div class="star-button">
              <a type="button" class="btn btn-light" href="${repo.owner.html_url}" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
                  ${repo.owner.login}
              </a>
          </div>
      </div>
  </div>`
  userList.appendChild(div)
}

const handleSearchSuccess = (users) => {
  userList.innerHTML = ''
  users.items.forEach(renderUser)
}

const renderUser = (user) => {
  const div = document.createElement('div')
  let profileBio = "No profile bio available"
  if(user.bio !== null){
    profileBio = user.bio
  }
  div.innerHTML = `
  <div class="card text-center border-dark mb-5 bg-light" style="width: 18rem;">
  <div class="d-flex justify-content-center mt-3">
    <a href="#">
    <img src="${user.avatar_url}" id="${user.login}" class="card-img-top rounded-circle" style="width: 150px" alt="...">
    </a>
    </div>
    <div class="card-body">
    <h5 class="card-title">${user.login}</h5>
    <a href="${user.html_url}" target="_blank" class="btn btn-primary">Checkout Profile</a>
  </div>
  </div>`
  userList.appendChild(div)
  document.querySelector(`#${user.login}`).addEventListener('click', fetchUserRepos)
}

const fetchUserRepos = (e) => {
  fetch(`https://api.github.com/users/${e.target.id}/repos`,{
    method: 'GET',
    headers: {
      Accept: "application/vnd.github.v3+json"
    }
  })
    .then(res => res.json())
    .then(handleReposSuccess)
    .catch(handleError)
}

const handleReposSuccess = (repos) => {
  const modalContent = document.querySelector('#modalContent')
  modalContent.innerHTML = ''
  const ul = document.createElement('ul')
  repos.forEach(repo => {
    const li = document.createElement('li')
    li.style.marginBottom = '5px'
    const h6 = document.createElement('h6')
    const strong = document.createElement('strong')
    strong.textContent = repo.name
    h6.appendChild(strong)
    const p = document.createElement('p')
    p.textContent = repo.description
    li.appendChild(h6)
    li.appendChild(p)
    ul.appendChild(li)
  })
  modalContent.appendChild(ul)
  const modalElement = document.getElementById('userModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

const handleError = (error) => {
  console.log(error)
  alert('Something went wrong during fetch')
}

const initApp = () => {
  form.addEventListener('submit', searchGitHub)
  document.querySelector('#search').value = ''
}

initApp()
