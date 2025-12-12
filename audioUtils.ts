
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function downsampleTo16k(
  input: Float32Array,
  inputSampleRate: number,
  targetSampleRate: number = 16000
): Int16Array {
  if (inputSampleRate === targetSampleRate) {
    const res = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      res[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return res;
  }

  const ratio = inputSampleRate / targetSampleRate;
  const newLength = Math.floor(input.length / ratio);
  const result = new Int16Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const originalIndex = i * ratio;
    const index1 = Math.floor(originalIndex);
    const index2 = Math.min(index1 + 1, input.length - 1);
    const fraction = originalIndex - index1;
    
    // Linear interpolation
    const value = input[index1] * (1 - fraction) + input[index2] * fraction;
    
    // Clamp and convert to Int16
    const s = Math.max(-1, Math.min(1, value));
    result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  return result;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
    // SAFETY: Ensure even byte length for Int16Array
    let safeData = data;
    if (data.byteLength % 2 !== 0) {
        safeData = data.slice(0, data.byteLength - 1);
    }

    const dataInt16 = new Int16Array(safeData.buffer, safeData.byteOffset, safeData.byteLength / 2);
    const frameCount = dataInt16.length / numChannels;
    
    // Create buffer with the expected rate (Gemini is usually 24k output)
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}
