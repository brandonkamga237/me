"""Prints the hash to put in ADMIN_PASSWORD_HASH: python -m app.auth.hash_password"""

from getpass import getpass

from app.auth.infra import Argon2Passwords

if __name__ == "__main__":
    password = getpass("Admin password: ")
    if len(password) < 12:
        raise SystemExit("Use at least 12 characters.")
    if getpass("Again: ") != password:
        raise SystemExit("The two entries differ.")
    print(Argon2Passwords().hash(password))
