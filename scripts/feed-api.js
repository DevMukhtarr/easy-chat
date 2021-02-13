let selector = () =>{
    let searches = ['house','device','women','nature','men','animals','cartoon','tesla'];
    let randomNum = Math.floor(Math.random() * searches.length);
        console.log(searches[randomNum])
        return searches[randomNum];
    }
    let selectorUp = selector()


const unsplashUrl = "https://api.unsplash.com/photos/?query="+selectorUp+"&client_id="+process.env.API_KEY+""

let photoContainer = document.querySelector('.photo-container');

fetch(unsplashUrl)
.then(info => info.json())
.then(data =>{
    for(let i = 0; i < 10; i++){
            let image = document.createElement('img')
            image.setAttribute('src', data[i].urls.small);
            image.setAttribute('loading', 'lazy')
            photoContainer.appendChild(image)
            console.log(data[i].urls.raw)
        }
    })