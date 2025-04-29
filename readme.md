# 🕵️‍♂️ SPYVERSE — Steganography Web Application

Welcome, Agent.  
This is **SPYVERSE** — a covert communication platform built with Django and steganography techniques to hide encrypted messages inside image, audio, or video files.

No tracking. No surveillance. Just pure stealth.

---

## 🔐 Features

- Encrypt + Hide messages inside:
  - Images (.png, .jpg)
  - Audio (.wav)
  - Videos (.avi, lossless)
- Password-based encryption (AES-GCM via Scrypt)
- Data never saved in plaintext
- Clean, spy-themed UI with animated effects
- Easy Upload & Decode interface
- Minimal database: tracks only file metadata

---

## ⚙️ Tech Stack

- Python 3.10+
- Django 5.x
- HTML5, CSS3 (Custom Spy UI)
- JS (UI animations)
- Libraries: Pillow, OpenCV, NumPy, Cryptography

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/spyverse.git
cd spyverse

2️⃣ Set up virtual environment
bash
Copy
Edit
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
3️⃣ Install dependencies
bash
Copy
Edit
pip install -r requirements.txt
If requirements.txt is missing, install manually:

bash
Copy
Edit
pip install django pillow opencv-python numpy cryptography
4️⃣ Migrate database
bash
Copy
Edit
python manage.py migrate
5️⃣ Run the development server
bash
Copy
Edit
python manage.py runserver
Visit http://127.0.0.1:8000 in your browser.