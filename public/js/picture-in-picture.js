let playButton = document.querySelector("button");
let audio = document.createElement('audio');

let playlist = getAwesomePlaylist();
let index = 0;

function onPlayButtonClick() {
  playAudio();
}

async function playAudio() {
  let track = playlist[index];
  audio.src = track.src;
  try {
    // Play audio
    await audio.play();

    // Update Media Session metadata
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: track.artwork
    });

    // Show track album in a Picture-in-Picture window
    await showPictureInPictureWindow();

    console.log(`Playing "${track.album}" audio track in Picture-in-Picture...`);
  } catch(error) {
    console.log(error);
  }
}

/* Picture-in-Picture Canvas */

const canvas = document.createElement('canvas');
canvas.width = canvas.height = 512;

const video = document.createElement('video');
video.srcObject = canvas.captureStream();
video.muted = true;

async function showPictureInPictureWindow() {
  const image = new Image();
  // image.crossOrigin = true;
  // image.src = '../assets/Stella/boca1.gif';
  // await image.decode();
  gifler('assets/gif/run.gif').animate(image);

  canvas.getContext('2d').drawImage(image, 0, 0, 512, 512);
  await video.play();
  await video.requestPictureInPicture();
}

/* Previous Track & Next Track */

navigator.mediaSession.setActionHandler('previoustrack', function() {
  console.log('> User clicked "Previous Track" button.');
  index = (index - 1 + playlist.length) % playlist.length;
  playAudio();
});

navigator.mediaSession.setActionHandler('nexttrack', function() {
  console.log('> User clicked "Next Track" button.');
  index = (index + 1) % playlist.length;
  playAudio();
});

audio.addEventListener('ended', function() {
  // Play automatically the next track when audio ends.
  index = (index - 1 + playlist.length) % playlist.length;
  playAudio();
});

/* Play & Pause */

navigator.mediaSession.setActionHandler('play', function() {
  console.log('> User clicked "Play" button.');
  audio.play();
  if (document.pictureInPictureElement)
    document.pictureInPictureElement.play();
});

navigator.mediaSession.setActionHandler('pause', function() {
  console.log('> User clicked "Pause" button.');
  audio.pause();
  if (document.pictureInPictureElement)
    document.pictureInPictureElement.pause();
});

/* Feature Support */

playButton.disabled = !document.pictureInPictureEnabled;

/* Utils */

function getAwesomePlaylist() {
  const BASE_URL = 'https://storage.googleapis.com/media-session/';

  return [{
      src: BASE_URL + 'sintel/snow-fight.mp3',
      title: 'Snow Fight',
      artist: 'Jan Morgenstern',
      album: 'Sintel',
      artwork: [
        { src: BASE_URL + 'sintel/artwork-512.png', sizes: '512x512', type: 'image/png' },
      ]
    }];
}
playButton.addEventListener('click',onPlayButtonClick);




/**
 * 
    <button id="playButton">Click here</button>
    <canvas class="container"></canvas>
 */