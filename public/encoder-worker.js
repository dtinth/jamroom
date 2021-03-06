/* global OggVorbisEncoder */
console.log('[encoder-worker] initializing')
self.OggVorbisEncoderConfig = {
  memoryInitializerPrefixURL:
    'https://rawcdn.githack.com/higuma/ogg-vorbis-encoder-js/7a872423f416e330e925f5266d2eb66cff63c1b6/lib/'
}
importScripts(
  'https://rawcdn.githack.com/higuma/ogg-vorbis-encoder-js/7a872423f416e330e925f5266d2eb66cff63c1b6/lib/OggVorbisEncoder.min.js'
)
onmessage = e => {
  if (e.data.hello) {
    postMessage({ ready: true })
  } else if (e.data.audioData) {
    var encoder = new OggVorbisEncoder(
      e.data.sampleRate,
      e.data.numberOfChannels,
      0.3
    )
    for (const chunk of e.data.audioData) encoder.encode(chunk)
    postMessage({ blob: encoder.finish(), id: e.data.id })
  }
}
console.log('[encoder-worker] ready')
