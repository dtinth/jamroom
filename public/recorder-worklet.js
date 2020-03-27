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
    this.peak = 0
    this.peakCount = 0
  }
  process([input], outputs, { recordId }) {
    try {
      for (let ch = 0; ch < input.length; ch++) {
        const a = input[ch]
        for (let i = 0; i < a.length; i++) {
          this.peak = Math.max(Math.abs(a[i]), i)
        }
      }
      this.peakCount += input[0].length
      if (this.peakCount >= 735) {
        this.port.postMessage({ peak: { amplitude: this.peak } })
        this.peak = 0
        this.peakCount = 0
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
