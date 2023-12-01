import pymongo

from config.settings import settings

client = pymongo.MongoClient(
    settings.DB_HOST,
    port=settings.DB_PORT,
    username=settings.DB_USER,
    password=settings.DB_PASSWORD,
    authSource="admin",
    serverSelectionTimeoutMS=3000,
)

try:
    conn = client.server_info()
    print(f'Connected to MongoDB {conn.get("version")}')
except Exception:
    print("Unable to connect to the MongoDB server.")

db = client[settings.DB_NAME]
UserCollection = db.users
UserCollection.create_index([("email", pymongo.ASCENDING)], unique=True)
