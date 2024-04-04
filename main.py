from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from notifypy import Notify
import os
from bs4 import BeautifulSoup
from datetime import datetime
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["amazon"]
collection = db["prices"]

def notify():
    notification = Notify()
    notification.title = "Cool Title"
    notification.message = "Even Cooler Message"
    notification.send()
    
def get_data():
    options = Options()
    options.add_argument("--headless")

    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    with open("products.txt") as f:
        products = f.readlines()

    driver= webdriver.Chrome(options=options)

    for product in products:
        driver.get(f"https://www.amazon.in/dp/{product}")
        page_source = driver.page_source
        with open(f"data/{product.strip()}.html", "w", encoding="utf-8") as f:
            f.write(page_source)

def extract_data():
    files = os.listdir("data")
    for file in files:
        print(file)
        with open(f"data/{file}", encoding="utf-8") as f:
            content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        title = soup.title.getText().split(":")[0]
        time = datetime.now()
        price = soup.find(class_="a-price-whole")
        priceInt = price.getText().replace(".","").replace(",","")
        table = soup.find(id = "productDetails_detailBullets_sections1")
        asin = table.find(class_= "prodDetAttrValue").getText().strip()
        print(priceInt, asin, title, time)
        collection.insert_one({"priceInt": priceInt, "asin": asin, "title": title, "time":time})
        # with open("finaldata.txt", "a") as f:
        #     f.write(f"{priceInt}~~{asin}~~{title}~~{time}\n")
    

if __name__ == "__main__":
    # notify()
    get_data()
    extract_data()



