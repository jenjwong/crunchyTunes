import React from 'react';

const SongPlayer = ({ track }) => {
  let embed;

  switch (track.apiSource) {
    case 'Spotify':
      embed = <iframe src={`https://embed.spotify.com/?uri=spotify%3Atrack%3A${track.contentId}`} width="500" height="80" frameBorder="0" allowTransparency="true"></iframe>;
      break;
    case 'SoundCloud':
      embed = <iframe width="500" height="80" scrolling="no" frameBorder="no" src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.contentId}&color=orange_white&auto_play=true`}></iframe>;
      break;
    case 'YouTube':
      embed = <iframe width="500" height="80" src={`https://www.youtube.com/embed/${track.contentId}?autoplay=1`} frameBorder="0" allowFullScreen></iframe>;
      break;
    case 'test':
      embed = <iframe width="500" height="80" scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/66111705&color=orange_white" ></iframe>;
      break;
    default:
      console.log('uh oh');
  }

  return (
    <div className="songPlayer">
      <div>{embed}</div>
    </div>
  );
};

export default SongPlayer;
