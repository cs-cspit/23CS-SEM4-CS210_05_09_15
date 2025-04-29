# crypto.py

import base64
import json
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os


def generate_salt(length: int = 16) -> bytes:
    """
    Generate a secure random salt.

    Args:
        length (int): Length of the salt in bytes. Default is 16.

    Returns:
        bytes: A securely generated random salt.
    """
    return os.urandom(length)


def derive_key_from_password(password: str, salt: bytes) -> bytes:
    """
    Derive a symmetric encryption key from a password and salt using PBKDF2.

    Args:
        password (str): The passphrase provided by the user.
        salt (bytes): The salt used to make the key unique and secure.

    Returns:
        bytes: A derived 32-byte key compatible with Fernet.
    """
    password_bytes = password.encode()
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100_000,
    )
    key = kdf.derive(password_bytes)
    return base64.urlsafe_b64encode(key)  # Fernet needs base64-encoded key


def encrypt_message(message: str, passphrase: str) -> str:
    """
    Encrypt the message using the password-derived key.

    Args:
        message (str): The plaintext message to encrypt.
        password (str): The passphrase used to derive the key.

    Returns:
        dict: {
            'ciphertext': str (base64 encoded),
            'salt': str (base64 encoded)
        }
    """
    salt = os.urandom(16)
    kdf = Scrypt(salt=salt, length=32, n=2**14, r=8, p=1)
    key = kdf.derive(passphrase.encode())

    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ct = aesgcm.encrypt(nonce, message.encode(), None)

    result = {
        "ciphertext": base64.b64encode(nonce + ct).decode(),
        "salt": base64.b64encode(salt).decode()
    }
    return json.dumps(result)


def decrypt_message(encrypted_json: str, passphrase: str) -> str:
    """
    Decrypt the encrypted message using the password and salt.

    Args:
        ciphertext (str): The base64-encoded encrypted message.
        password (str): The same password used during encryption.
        salt (str): The base64-encoded salt used during encryption.

    Returns:
        str: The original decrypted plaintext message.
    """
    data = json.loads(encrypted_json)
    salt = base64.b64decode(data["salt"])
    ct = base64.b64decode(data["ciphertext"])

    kdf = Scrypt(salt=salt, length=32, n=2**14, r=8, p=1)
    key = kdf.derive(passphrase.encode())

    aesgcm = AESGCM(key)
    nonce = ct[:12]
    actual_ct = ct[12:]
    return aesgcm.decrypt(nonce, actual_ct, None).decode()
