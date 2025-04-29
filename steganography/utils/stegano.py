#for images
from PIL import Image

# Unique markers to wrap the data (safe for JSON)
START_MARKER = "<<<START>>>"
END_MARKER = "<<<END>>>"

def _int_to_bin(rgb):
    """Convert integer RGB tuple to binary tuple."""
    return tuple(format(i, '08b') for i in rgb)

def _bin_to_int(rgb):
    """Convert binary RGB tuple to integer tuple."""
    return tuple(int(b, 2) for b in rgb)

def _encode_lsb(data: str, image: Image.Image) -> Image.Image:
    # Wrap data in markers
    wrapped_data = f"{START_MARKER}{data}{END_MARKER}"

    # Convert to binary
    binary_data = ''.join(format(ord(char), '08b') for char in wrapped_data)

    data_index = 0
    pixels = image.load()

    for y in range(image.size[1]):
        for x in range(image.size[0]):
            if data_index >= len(binary_data):
                return image

            r, g, b = _int_to_bin(pixels[x, y])
            new_rgb = []

            for color in (r, g, b):
                if data_index < len(binary_data):
                    new_rgb.append(color[:-1] + binary_data[data_index])
                    data_index += 1
                else:
                    new_rgb.append(color)

            pixels[x, y] = _bin_to_int(tuple(new_rgb))

    return image

def _decode_lsb(image: Image.Image) -> str:
    binary_data = ""
    pixels = image.load()

    for y in range(image.size[1]):
        for x in range(image.size[0]):
            r, g, b = _int_to_bin(pixels[x, y])
            binary_data += r[-1] + g[-1] + b[-1]

    all_bytes = [binary_data[i:i+8] for i in range(0, len(binary_data), 8)]

    decoded_data = ""
    for byte in all_bytes:
        decoded_data += chr(int(byte, 2))

    # Extract content between markers
    start = decoded_data.find(START_MARKER)
    end = decoded_data.find(END_MARKER)

    if start == -1 or end == -1:
        raise ValueError("Data markers not found. Possibly not a valid stego file.")

    return decoded_data[start + len(START_MARKER):end].strip()



def hide_data_in_image(image_path: str, data: str, output_path: str) -> None:
    img = Image.open(image_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    encoded = _encode_lsb(data, img)
    encoded.save(output_path)

def extract_data_from_image(image_path: str) -> str:
    img = Image.open(image_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    return _decode_lsb(img)

#For audio
# Add this to stegano.py
import wave
import numpy as np

AUDIO_START_MARKER = "<<<START>>>"
AUDIO_END_MARKER = "<<<END>>>"

def _str_to_bin(message: str) -> str:
    return ''.join(format(ord(char), '08b') for char in message)

def _bin_to_str(binary_data: str) -> str:
    chars = [binary_data[i:i+8] for i in range(0, len(binary_data), 8)]
    return ''.join(chr(int(b, 2)) for b in chars)

def hide_data_in_audio(audio_path: str, data: str, output_path: str) -> None:
    # Open WAV file
    with wave.open(audio_path, 'rb') as audio:
        params = audio.getparams()
        frames = bytearray(audio.readframes(audio.getnframes()))

    full_data = AUDIO_START_MARKER + data + AUDIO_END_MARKER
    binary_data = _str_to_bin(full_data)

    if len(binary_data) > len(frames):
        raise ValueError("Data is too large to hide in this audio file.")

    # Embed data into the LSB of each byte
    for i in range(len(binary_data)):
        frames[i] = (frames[i] & 0b11111110) | int(binary_data[i])

    # Save new audio file
    with wave.open(output_path, 'wb') as stego_audio:
        stego_audio.setparams(params)
        stego_audio.writeframes(frames)

def extract_data_from_audio(audio_path: str) -> str:
    with wave.open(audio_path, 'rb') as audio:
        frames = bytearray(audio.readframes(audio.getnframes()))

    # Read all LSBs
    bits = ''.join([str(byte & 1) for byte in frames])
    chars = [bits[i:i+8] for i in range(0, len(bits), 8)]
    message = _bin_to_str(''.join(chars))

    # Find markers
    start = message.find(AUDIO_START_MARKER)
    end = message.find(AUDIO_END_MARKER)

    if start == -1 or end == -1:
        raise ValueError("No hidden data found in this audio file.")

    return message[start + len(AUDIO_START_MARKER):end]

#for videos
import cv2
import numpy as np

START_MARKER = "<<<START>>>"
END_MARKER   = "<<<END>>>"

def _str_to_bits(s: str) -> str:
    return ''.join(format(ord(c), '08b') for c in s)

def _bits_to_str(b: str) -> str:
    return ''.join(chr(int(b[i:i+8], 2)) for i in range(0, len(b), 8))

def _encode_lsb_frame(frame: np.ndarray, data: str) -> np.ndarray:
    h, w, _ = frame.shape
    bits = _str_to_bits(START_MARKER + data + END_MARKER)
    idx, total = 0, len(bits)

    for y in range(h):
        for x in range(w):
            for c in range(3):
                if idx < total:
                    pv = int(frame[y, x, c])
                    frame[y, x, c] = np.uint8((pv & 0xFE) | int(bits[idx]))
                    idx += 1
                else:
                    return frame
    return frame

def _decode_lsb_frame(frame: np.ndarray) -> str:
    h, w, _ = frame.shape
    bits = []

    for y in range(h):
        for x in range(w):
            for c in range(3):
                bits.append(str(int(frame[y, x, c]) & 1))

    text = _bits_to_str(''.join(bits))
    start = text.find(START_MARKER)
    end   = text.find(END_MARKER, start + len(START_MARKER))
    if start == -1 or end == -1:
        raise ValueError("Data markers not found.")
    return text[start + len(START_MARKER):end]

def hide_data_in_video(input_path: str, data: str, output_path: str) -> None:
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise IOError("Cannot open input video.")

    w   = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h   = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    # Use FFV1 (lossless) so LSB stays intact
    fourcc = cv2.VideoWriter_fourcc(*'FFV1')
    out    = cv2.VideoWriter(output_path, fourcc, fps, (w, h))

    success, frame = cap.read()
    if not success:
        raise IOError("Cannot read first frame.")

    stego_frame = _encode_lsb_frame(frame.copy(), data)
    out.write(stego_frame)

    while True:
        success, frame = cap.read()
        if not success:
            break
        out.write(frame)

    cap.release()
    out.release()

def extract_data_from_video(input_path: str) -> str:
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise IOError("Cannot open stego video.")

    success, frame = cap.read()
    cap.release()
    if not success:
        raise IOError("Cannot read first frame.")
    return _decode_lsb_frame(frame)
