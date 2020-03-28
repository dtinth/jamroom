/* global sampleRate currentTime */
class RecorderProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{
      name: 'recordId',
      defaultValue: -1
    }]
  }
  constructor() {
    super()
    this.currentRecording = null
    this.port.postMessage({ hello: 'world' })
    this.peak = null
    this.waveform = null
  }
  process([input], outputs, { recordId }) {
    try {
      if (!this.waveform) {
        this.waveform = { startAudioTime: currentTime, peaks: [], numberOfSamples: 0 }
      }
      if (!this.peak) {
        this.peak = { startAudioTime: currentTime, amplitude: 0, numberOfSamples: 0 }
      }
      for (let ch = 0; ch < input.length; ch++) {
        const a = input[ch]
        const peak = this.peak
        for (let i = 0; i < a.length; i++) {
          peak.amplitude = Math.max(Math.abs(a[i]), peak.amplitude)
        }
      }
      this.peak.numberOfSamples += input[0].length
      if (this.peak.numberOfSamples >= sampleRate / 1000) {
        this.peak.duration = this.peak.numberOfSamples / sampleRate
        this.waveform.peaks.push(this.peak)
        this.waveform.numberOfSamples += this.peak.numberOfSamples
        this.peak = null

        if (this.waveform.numberOfSamples >= sampleRate / 30) {
          this.port.postMessage({ waveform: this.waveform })
          this.waveform = null
        }
      }
      if (recordId.length === 1) {
        this.save(recordId[0], input.map(a => a.slice()))
      } else {
        let current
        for (let i = 0; i < recordId.length; i++) {
          if (!current || recordId[i] !== current.recordId) {
            if (current) {
              this.save(current.recordId, input.map(a => a.slice(current.startIndex, i)))
            }
            current = {
              recordId: recordId[i],
              startIndex: i
            }
          }
        }
        if (current) {
          this.save(current.recordId, input.map(a => a.slice(current.startIndex)))
        }
      }
    } catch (error) {
      this.port.postMessage({ error })
    }
    return true
  }
  save(recordId, chunk) {
    if (this.currentRecording && recordId !== this.currentRecording.recordId) {
      this.port.postMessage({ recording: this.currentRecording })
      this.currentRecording = null
    }
    if (!this.currentRecording && recordId !== -1) {
      this.currentRecording = { recordId, chunks: [], totalLength: 0 }
    }
    if (this.currentRecording) {
      this.currentRecording.chunks.push(chunk)
      this.currentRecording.totalLength += chunk[0].length
    }
  }
}

registerProcessor('recorder-processor', RecorderProcessor);
