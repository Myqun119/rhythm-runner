const http = require('http');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');
const PORT = 3001;

function ensureDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], maps: [], comments: [], favorites: [] }, null, 2));
    }
}

function readData() {
    ensureDatabase();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(payload));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            if (!body) {
                resolve({});
                return;
            }
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
    });
}

ensureDatabase();

const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        sendJson(res, 204, {});
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const { pathname } = url;

    try {
        if (req.method === 'POST' && pathname === '/api/register') {
            const { username, password, nickname } = await parseBody(req);
            const data = readData();
            const exist = data.users.find((user) => user.username === username);
            if (exist) {
                sendJson(res, 200, { success: false, msg: '用户名已存在' });
                return;
            }

            const newUser = {
                userId: Date.now().toString(),
                username,
                password,
                nickname: nickname || username,
                createdAt: Date.now(),
            };

            data.users.push(newUser);
            writeData(data);
            sendJson(res, 200, { success: true, user: newUser });
            return;
        }

        if (req.method === 'POST' && pathname === '/api/login') {
            const { username, password } = await parseBody(req);
            const data = readData();
            const user = data.users.find((item) => item.username === username && item.password === password);
            if (!user) {
                sendJson(res, 200, { success: false, msg: '账号或密码错误' });
                return;
            }

            sendJson(res, 200, { success: true, user });
            return;
        }

        if (req.method === 'PUT' && pathname === '/api/user/nickname') {
            const { username, newNickname } = await parseBody(req);
            const data = readData();
            const userIndex = data.users.findIndex((user) => user.username === username);
            if (userIndex === -1) {
                sendJson(res, 200, { success: false, msg: '用户不存在' });
                return;
            }

            const oldNickname = data.users[userIndex].nickname;
            data.users[userIndex].nickname = newNickname;

            data.maps.forEach((map) => {
                if (map.creator === oldNickname || map.creatorId === data.users[userIndex].userId) {
                    map.creator = newNickname;
                }
            });

            writeData(data);
            sendJson(res, 200, { success: true });
            return;
        }

        if (req.method === 'GET' && pathname === '/api/maps') {
            const data = readData();
            const maps = data.maps.map((map) => ({
                ...map,
                favoritesCount: map.favoritesCount !== undefined ? map.favoritesCount : 0,
                downloads: map.downloads !== undefined ? map.downloads : 0,
                rating: map.rating !== undefined ? map.rating : 0,
            }));
            sendJson(res, 200, maps);
            return;
        }

        if (req.method === 'POST' && pathname === '/api/maps') {
            const { mapData, updateId } = await parseBody(req);
            const data = readData();

            if (updateId) {
                const index = data.maps.findIndex((map) => map.id === updateId);
                if (index !== -1) {
                    data.maps[index] = {
                        ...data.maps[index],
                        ...mapData,
                        favoritesCount: data.maps[index].favoritesCount !== undefined ? data.maps[index].favoritesCount : 0,
                    };
                    writeData(data);
                    sendJson(res, 200, { success: true, msg: '更新成功' });
                    return;
                }
            }

            const newMap = {
                id: Date.now().toString(),
                ...mapData,
                createdAt: Date.now(),
                downloads: 0,
                favoritesCount: 0,
                rating: 0,
            };
            data.maps.push(newMap);
            writeData(data);
            sendJson(res, 200, { success: true, msg: '保存成功', mapId: newMap.id });
            return;
        }

        if (req.method === 'POST' && pathname.startsWith('/api/maps/') && pathname.endsWith('/download')) {
            const mapId = pathname.split('/')[3];
            const data = readData();
            const map = data.maps.find((item) => item.id === mapId);
            if (map) {
                map.downloads = (map.downloads || 0) + 1;
                writeData(data);
                sendJson(res, 200, { success: true, downloads: map.downloads });
            } else {
                sendJson(res, 200, { success: false });
            }
            return;
        }

        if (req.method === 'POST' && pathname.startsWith('/api/maps/') && pathname.endsWith('/favorite')) {
            const mapId = pathname.split('/')[3];
            const { userId } = await parseBody(req);
            const data = readData();
            const map = data.maps.find((item) => item.id === mapId);

            if (!map) {
                sendJson(res, 200, { success: false, msg: '地图不存在' });
                return;
            }

            map.favoritesCount = (map.favoritesCount || 0) + 1;
            if (userId) {
                const alreadyFavorited = data.favorites.some((favorite) => favorite.userId === userId && favorite.mapId === mapId);
                if (!alreadyFavorited) {
                    data.favorites.push({ userId, mapId, createdAt: Date.now() });
                }
            }

            writeData(data);
            sendJson(res, 200, { success: true, favoritesCount: map.favoritesCount });
            return;
        }

        if (req.method === 'POST' && pathname.startsWith('/api/maps/') && pathname.endsWith('/unfavorite')) {
            const mapId = pathname.split('/')[3];
            const { userId } = await parseBody(req);
            const data = readData();
            const map = data.maps.find((item) => item.id === mapId);

            if (!map) {
                sendJson(res, 200, { success: false, msg: '地图不存在' });
                return;
            }

            map.favoritesCount = Math.max((map.favoritesCount || 0) - 1, 0);
            if (userId) {
                data.favorites = data.favorites.filter((favorite) => !(favorite.userId === userId && favorite.mapId === mapId));
            }

            writeData(data);
            sendJson(res, 200, { success: true, favoritesCount: map.favoritesCount });
            return;
        }

        // 删除地图（同步删除地图、相关收藏与评论）
        if (req.method === 'POST' && pathname.startsWith('/api/maps/') && pathname.endsWith('/delete')) {
            const mapId = pathname.split('/')[3];
            const data = readData();
            const mapIndex = data.maps.findIndex((item) => item.id === mapId);
            if (mapIndex === -1) {
                sendJson(res, 200, { success: false, msg: '地图不存在' });
                return;
            }

            // remove map
            data.maps.splice(mapIndex, 1);

            // remove favorites referencing this map
            if (Array.isArray(data.favorites)) {
                data.favorites = data.favorites.filter((fav) => fav.mapId !== mapId);
            }

            // remove comments referencing this map
            if (Array.isArray(data.comments)) {
                data.comments = data.comments.filter((c) => c.mapId !== mapId);
            }

            writeData(data);
            sendJson(res, 200, { success: true });
            return;
        }

        if (req.method === 'GET' && pathname.startsWith('/api/favorites/')) {
            const userId = pathname.split('/')[3];
            const data = readData();
            const favorites = data.favorites.filter((favorite) => favorite.userId === userId);
            sendJson(res, 200, favorites.map((favorite) => favorite.mapId));
            return;
        }

        if (req.method === 'GET' && pathname.startsWith('/api/maps/') && pathname.endsWith('/favorites')) {
            const mapId = pathname.split('/')[3];
            const data = readData();
            const map = data.maps.find((item) => item.id === mapId);
            sendJson(res, 200, { favoritesCount: map?.favoritesCount || 0 });
            return;
        }

        sendJson(res, 404, { success: false, msg: 'Not Found' });
    } catch (error) {
        console.error(error);
        sendJson(res, 500, { success: false, msg: '服务器错误' });
    }
});

server.listen(PORT, () => {
    console.log(`✅ 后端服务器已启动: http://localhost:${PORT}`);
    console.log(`📁 数据保存在: ${DB_FILE}`);
});
