class RecorderProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{
      name: 'recordId',
      defaultValue: -1
    }]
  }
  constructor() {
    super()
    this.currentRecordId = -1
  }
  process([input], outputs, { recordId }) {
    if (recordId.length === 1) {
      this.save(recordId[0], )
    } else {
      for (let i = 0; i < recordId.length; i++) {
      }
    }
  }
}

registerProcessor('recorder-processor', RecorderProcessor);
