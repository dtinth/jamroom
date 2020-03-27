class RecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }
  process(inputs, outputs, parameters) {
  }
}

registerProcessor('recorder-processor', RecorderProcessor);
