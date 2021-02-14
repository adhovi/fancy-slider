const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

//hide gallery-header
imagesArea.style.display = 'none'
// show images 
const showImages = (query, data) => {

  if (data.total == 0) {
    spinnerToggle()
    const noMatchDiv = document.createElement('div')
    const itemInfo = `<p class="text-center"> No matched item found </p>`
    noMatchDiv.innerHTML = itemInfo
    document.getElementById('no-match').appendChild(noMatchDiv)
    document.getElementById('images-section').style.display = 'none'
  } else if (query == '') {
    spinnerToggle()
    const noMatchDiv = document.createElement('div')
    const itemInfo = `<p class="text-center"> Enter something to see the search result </p>`
    noMatchDiv.innerHTML = itemInfo
    document.getElementById('no-match').appendChild(noMatchDiv)
    document.getElementById('images-section').style.display = 'none'
  } else {
    spinnerToggle()
    const images = data.hits
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-4';
      div.innerHTML = ` <img class="img-fluid img-thumbnail img-height" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
  }
}

const getImages = (query) => {
  spinnerToggle()
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(query, data))
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1)
  }
  let imageCount = sliders.length
  document.getElementById('selected-image').innerText = imageCount
}
var timer
const createSlider = () => {
  // check slider image length

  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // duration of slider
  let duration = document.getElementById('duration').value || 1000;
  //Check the duration
  if (duration < 1000) {
    duration = 1000;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

//Search Button click event
searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
  document.getElementById('no-match').innerHTML = ''
  document.getElementById('search').value = ''
})

//Enter key press event
document.getElementById('search').addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
    document.getElementById('no-match').innerHTML = ''
    document.getElementById('search').value = ''
  }
})

//slider button click event
sliderBtn.addEventListener('click', function () {
  createSlider()
})

//spinner show hide
const spinnerToggle = () => {
  document.getElementById('spinner').classList.toggle('d-none')
  document.getElementById('images-section').classList.toggle('d-none')
}

//Back button of slider page
document.getElementById('search-back').addEventListener('click', () => {
  sliderContainer.innerHTML = ''
  document.querySelector('.main').style.display = 'none'
  document.getElementById('images-section').style.display = 'block'
  clearInterval(timer)
})