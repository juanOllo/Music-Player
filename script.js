const playerBtns = document.querySelector(".player-buttons");
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");
const progressBar = document.getElementById("progress-bar");
const volumeBar = document.getElementById("volume-bar");
const volumeBarDiv = document.getElementById("volume-bar-div");
const volumeBarBtn = document.getElementById("volume");

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
// audio.volume = 0.75;
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

const playSong = (id, event = null) => {

  vinyl.style.animation = "vinyl-anim 4s linear 0s infinite";

  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
    progressBar.value = 0;
  } else {
    // audio.currentTime = userData?.songCurrentTime;
    audio.currentTime = progressBar.value;
  }
  userData.currentSong = song;
  playButton.classList.add("playing");
  pauseButton.classList.remove("playing");

  // Si clickeas una cancion de la playlist con el shuffle activado, se vuelven a mezclar
  //  Event no es null solo cuando clickeas una cancion de la playlist
  if (shuffleButton.classList.contains("shuffled") && event !== null) {
    userData.songs = userData?.songs.filter(s => s.id !== userData?.currentSong.id);
    userData?.songs.sort(() => Math.random() - 0.5);
    userData.songs.unshift(userData?.currentSong);
  }
  // console.log("userData.songs", userData.songs.reduce((acc, e) => acc + e.id.toString() + ", ", ""));

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
   else if(audio.currentTime > 3) {
    audio.currentTime = 0;
   } else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
   }
};

audio.addEventListener("timeupdate", () => {
  progressBar.max = audio.duration;
  progressBar.value = audio.currentTime;
});

progressBar.addEventListener('input', () => {
  audio.currentTime = progressBar.value;
});

volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value / 100;
})

const shuffle = () => {
  if (shuffleButton.classList.contains("shuffled")) {
    userData.songs = [...allSongs];
    shuffleButton.classList.remove("shuffled");
  } else {

    if (userData.currentSong===null) {
      userData?.songs.sort(() => Math.random() - 0.5);
    } else {
      userData.songs = userData?.songs.filter(s => s.id !== userData?.currentSong.id);
      userData?.songs.sort(() => Math.random() - 0.5);
      userData.songs.unshift(userData?.currentSong);
    }

    shuffleButton.classList.add("shuffled");
  }

  // renderSongs(userData?.songs);
  // pauseSong();
  // setPlayerDisplay();
  setPlayButtonAccessibleText();
  highlightCurrentSong();
};

volumeBarBtn.addEventListener("click", () => {
  if (volumeBarDiv.classList.contains("displayed")) {
    volumeBarDiv.style.display = "none";
    volumeBarDiv.classList.remove("displayed");

    volumeBarBtn.classList.remove("shuffled");

    for(let btn of playerBtns.children) {
      if (btn.id !== "volume" && btn.id !== "volume-bar-div") {
        btn.classList.remove("hiden");
      }
    }
  } else {
    volumeBarDiv.style.display = "flex";
    volumeBarDiv.classList.add("displayed");

    // Le agrego la clase shuffled solo para que el boton quede rosa
    volumeBarBtn.classList.add("shuffled");

    // Oculto los demas botones del player
    for(let btn of playerBtns.children) {
      if (btn.id !== "volume" && btn.id !== "volume-bar-div") {
        btn.classList.add("hiden");
      }
    }
  }
})


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
      // if (song.id) {
        
      // }

      return `
      <li id="song-${song.id}" class="playlist-song">
        <button class="playlist-song-info" onclick="playSong(${song.id}, event)">
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

function clickAnim() {
  anim(playerBtns, "player-buttons-anim 0.4s ease-in-out");
}



const body = document.getElementsByTagName("body")[0];
// Si clickeas cualquier elemento que no contenga la clase "volume" o "volume-click" y
//  el div del volumen esta visible entonces lo oculta.
body.addEventListener("click", (e) => {
  if (e.target.classList.contains("volume") || e.target.classList.contains("volume-click")) {
    return;
  }

  // (Codigo copiado del eventListener de volumeBarDiv)
  if (volumeBarDiv.classList.contains("displayed")) {
    volumeBarDiv.style.display = "none";
    volumeBarDiv.classList.remove("displayed");

    volumeBarBtn.classList.remove("shuffled");

    for(let btn of playerBtns.children) {
      if (btn.id !== "volume" && btn.id !== "volume-bar-div") {
        btn.classList.remove("hiden");
      }
    }
  }
})