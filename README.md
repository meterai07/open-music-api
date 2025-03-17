---

# 🎵 Open API Music

This is a music API service built with **Node.js**, supporting features like albums, playlists, songs, likes, and album cover uploads. The app uses **PostgreSQL** as the database, **Redis** for caching, **RabbitMQ** for messaging, and file storage for album covers.

---

**Run Redis using Docker**

```bash
docker run -d --name redis -p 6379:6379 redis
```

**Run RabbitMQ using Docker**

```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management
```

Access RabbitMQ Management UI at:  
➡️ `http://localhost:15672`  
(Default user: guest / guest)