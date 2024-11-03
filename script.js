const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

const vinyl = document.getElementById("vinyl-img");

const allSongs = [
  {
    id: 0,
    title: "01 - Ñeris Night",
    artist: "Davus ft. Santi Sanz",
    duration: "3:30",
    src: "./songs/01- davus - Ñeris Night feat. Santi Sanz.opus",
  },
  {
    id: 1,
    title: "02 - Checkin' The Check",
    artist: "Davus",
    duration: "2:14",
    src: "./songs/02- davus -Checkin' The Check.opus",
  },
  {
    id: 2,
    title: "03 - Yas",
    artist: "Davus ft. Christian de Lugano",
    duration: "4:23",
    src: "./songs/03- davus - yas ft Christian de lugano.opus",
  },
  {
    id: 3,
    title: "04 - Balads of Gay Tony",
    artist: "Davus",
    duration: "3:07",
    src: "./songs/04- davus - baladas of gay tony.opus",
  },
  {
    id: 4,
    title: "05 - Solo No Me Quito",
    artist: "Davus",
    duration: "2:32",
    src: "./songs/05- davus - solo no me quito.opus",
  },
  {
    id: 5,
    title: "07 - Kung Fu",
    artist: "Davus",
    duration: "1:47",
    src: "./songs/07- davus - kung fu.opus",
  },
  {
    id: 6,
    title: "08 - Balads of Sad Tony",
    artist: "Davus",
    duration: "3:34",
    src: "./songs/08- davus - Balads of Sad Tony.opus",
  },
  
];

const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

const playSong = (id) => {

  vinyl.style.animation = "vinyl-anim 4s linear 0s infinite";

  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song;
  playButton.classList.add("playing");
  pauseButton.classList.remove("playing");

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;

  vinyl.style.animation = "none";
  
  playButton.classList.remove("playing");
  pauseButton.classList.add("playing");
  audio.pause();
};

const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];

    playSong(nextSong.id);
  }
};

const playPreviousSong = () => {
  // console.log("actual time: ", audio.currentTime);

   if (userData?.currentSong === null) return;
   else if(audio.currentTime > 5) {
    audio.currentTime = 0;
   } else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
   }
};

const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  anim(playlistSongs, "shuffle-playlist-anim 0.5s ease-in-out");

  setTimeout(() => {

    renderSongs(userData?.songs);
    pauseSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
  }, 250)
};


//aplica animaciones
const anim = (el, str) => {
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = str;
}


// const deleteSong = (id) => {
//   if (userData?.currentSong?.id === id) {
//     userData.currentSong = null;
//     userData.songCurrentTime = 0;

//     pauseSong();
//     setPlayerDisplay();
//   }

//   userData.songs = userData?.songs.filter((song) => song.id !== id);
//   renderSongs(userData?.songs); 
//   highlightCurrentSong(); 
//   setPlayButtonAccessibleText(); 

//   if (userData?.songs.length === 0) {
//     const resetButton = document.createElement("button");
//     const resetText = document.createTextNode("Reset Playlist");

//     resetButton.id = "reset";
//     resetButton.ariaLabel = "Reset playlist";
//     resetButton.appendChild(resetText);
//     playlistSongs.appendChild(resetButton);

//     resetButton.addEventListener("click", () => {
//       userData.songs = [...allSongs];

//       renderSongs(sortSongs()); 
//       setPlayButtonAccessibleText();
//       resetButton.remove();
//     });

//   }

// };

const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const renderSongs = (array) => {
  const songsHTML = array
    .map((song)=> {
      return `
      <li id="song-${song.id}" class="playlist-song">
        <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-duration">${song.duration}</span>
        </button>
      </li>
      `;
    })
    .join("");

  playlistSongs.innerHTML = songsHTML;
};

const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];

  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }
});

pauseButton.addEventListener("click",  pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

shuffleButton.addEventListener("click", shuffle);

audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

    if (nextSongExists) {
      playNextSong();
    } else {
      userData.currentSong = null;
      userData.songCurrentTime = 0;  
pauseSong()
setPlayerDisplay()
highlightCurrentSong()
setPlayButtonAccessibleText()
    }
});

const sortSongs = () => {
  userData?.songs.sort((a,b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return userData?.songs;
};

renderSongs(sortSongs());
setPlayButtonAccessibleText();


const playerBtns = document.querySelector(".player-buttons");
// console.log("soada", playerBtns);

function clickAnim() {
  anim(playerBtns, "player-buttons-anim 0.2s ease-in-out");
}