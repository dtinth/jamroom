console.log('init')
self.OggVorbisEncoderConfig = {
  memoryInitializerPrefixURL: "https://rawcdn.githack.com/higuma/ogg-vorbis-encoder-js/7a872423f416e330e925f5266d2eb66cff63c1b6/lib/"
};
importScripts("https://rawcdn.githack.com/higuma/ogg-vorbis-encoder-js/7a872423f416e330e925f5266d2eb66cff63c1b6/lib/OggVorbisEncoder.min.js");
console.log('imported')
onmessage = (e) => {
  var encoder = new OggVorbisEncoder(44100, 2, 0.3)
  encoder.encode(e.data.audioData)
  postMessage({ blob: encoder.finish() })
}
