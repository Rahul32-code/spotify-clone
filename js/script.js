// console.log("hello")
let currentSong = new Audio();
let songs;
let currfolder; 

function convertSecondsToMinutesAndSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00 : 00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  let resp = await a.text();
  // console.log(resp)
  let div = document.createElement("div")
  div.innerHTML = resp;
  // console.log(div)
  let as = div.getElementsByTagName("a")
  // console.log(as)
   songs = [];

  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      // console.log(element.href)
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  // console.log(song);
  // return songs;

    // store in html show all the songplay list
    let songul = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0]
    songul.innerHTML=""
  for (const items of songs) {
    // console.log(items)
    songul.innerHTML =
      songul.innerHTML +
      `<li>
          <img src="img/music.svg" class="invert" alt="">
            <div class="info">
              <div>${items.replaceAll("%20", ' ')}</div>
                <div>Rahul</div>
              </div>
            <div class="playnow">
          <img src="img/play.svg" class="invert" alt="">
        </div>
      </li>
      `;
  }
  // attach at event Listener to eACH song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector("div").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  })

  return songs

}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentSong.play()
    play.src = "img/pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
  
};

async function displayAlbum(){
  let a = await fetch(`/songs/`);
  let resp = await a.text();
  // console.log(resp)
  let div = document.createElement("div");
  div.innerHTML = resp;
  let anchors = div.getElementsByTagName("a")
  // console.log(anchors)
  let cardContainer = document.querySelector(".card-container");
  // console.log(cardContainer)

  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
      
      // console.log(e.href)
    if(e.href.includes("/songs")){
    // console.log(e.href.split("/").slice(-2)[0])http://127.0.0.1:3000/http://127.0.0.1:3000/
    let folder = e.href.split("/").slice(-2)[0];
    
  // get the meta data of the folder 
  let a = await fetch(`http://127.0.0.1:3000//songs/${folder}/info.json`);
  let resp = await a.json();
  // console.log(resp)
  cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card ">
  <div class="play">
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <path
  d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
  fill="#000000" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
  </div>
  <img src="/songs/${folder}/cover.jpg" alt="" srcset="">
  <h2>${resp.tittle}</h2>
  <p>${resp.description}</p>
</div>`
    }
  }
  
  // load a playlist whenever crd is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    // console.log(e)
  e.addEventListener("click", async item=>{
    songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
    playMusic(songs[0])
    
  })
})


}

async function main() {
  // get the list all the song
  await getsongs(`songs/ncs`);
  // console.log(song);
  playMusic(songs[0], true);
  
  // display all the albumson the page
  displayAlbum()
  
  
  
  // atach to event to play prev and next
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "img/pause.svg"
    } else {
      currentSong.pause()
      play.src = "img/play.svg"
    }
  })

  // lsten for time update
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(
      ".songTime"
      ).innerHTML = `${convertSecondsToMinutesAndSeconds(
        currentSong.currentTime
        )} / ${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
        (currentSong.currentTime / currentSong.duration) * 100 + "%";
      });
      
  // add an event listen inseakbar
  
  document.querySelector(".SeakBar").addEventListener("click", e => {
    // console.log("offsetx:" + e.offsetX, "offsety:" + e.offsetY)
    // console.log(e.target.getBoundingClientRect().width, "offsetx:" + e.offsetX)
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100
  });

  // add event listener on hamburger
  
  document
  .querySelector(".hamburgerContainer")
  .addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })
  
  // add event listener on close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120" + "%"
  })
  
  // add a event listner prev
  document.querySelector("#prev").addEventListener("click", () => {
    // console.log("prev click");
  
    let findIndex = currentSong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(findIndex);
  
    // console.log(song, index)
  
    if((index - 1) >= 0){
      playMusic(songs[index - 1]);
    }
  });
  // console.log(songs);  
  
  // add a event listner next
  document.querySelector("#next").addEventListener("click", () => {
    // console.log(songs);
    // console.log("next click");
    // console.log("dgdh :" + currentSong.src.split("/").slice(-1)[0]);
    
    let findIndex = currentSong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(findIndex);
    
    // console.log( index);
  
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1]);
    }
  });
  
  
  // add an event on volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    //  console.log(e, e.target, e.target.value)
    currentSong.volume = parseInt(e.target.value) / 100
    if(currentSong.volume > 0){
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }
  })
  
  // add eventlistner to mute the volume
  document.querySelector(".volume img").addEventListener("click", (e)=>{
    if (e.target.src.includes("img/volume.svg")) {
      // console.log(e.target);
      e.target.src = "img/mute.svg";
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = "0" ;
    } else {
      currentSong.volume = 0.10;  // Adjust the volume as needed
      e.target.src = "img/volume.svg";
      document.querySelector(".range").getElementsByTagName("input")[0].value = "10" ;
    }
  })
  
  
}
main()
