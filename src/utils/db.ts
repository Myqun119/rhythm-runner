const API_URL = "http://localhost:3001/api";

function getRandomColor() {
    const colors = ["#FFD966", "#4ECDC4", "#FFB7B2", "#A8E6CF", "#D4A5A5", "#9B59B6", "#E67E22", "#1ABC9C"];
    return colors[Math.floor(Math.random() * colors.length)];
}

export interface MapItem {
    id: string;
    name?: string;
    creator?: string;
    creatorId?: string;
    publish?: boolean;
    downloads?: number;
    rating?: number;
    color?: string;
    createdAt?: number;
    [key: string]: any;
}

export async function registerUser(username: string, password: string, nickname: string) {
    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, nickname }),
        });
        return await res.json();
    } catch (error) {
        console.error("注册失败:", error);
        return { success: false, msg: "网络错误，请确保后端服务器已启动 (npm run server)" };
    }
}

export async function loginUser(username: string, password: string) {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem("currentUser", JSON.stringify(data.user));
        }
        return data;
    } catch (error) {
        console.error("登录失败:", error);
        return { success: false, msg: "网络错误，请确保后端服务器已启动 (npm run server)" };
    }
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
}

export function logoutUser() {
    localStorage.removeItem("currentUser");
    return { success: true };
}

export async function updateNickname(username: string, newNickname: string) {
    try {
        const res = await fetch(`${API_URL}/user/nickname`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, newNickname }),
        });
        const result = await res.json();

        if (result.success) {
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.username === username) {
                currentUser.nickname = newNickname;
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
            }
            return { success: true };
        }

        return result;
    } catch (error) {
        console.error("修改昵称失败:", error);
        return { success: false, msg: "网络错误" };
    }
}

export async function getAllMaps() {
    try {
        const res = await fetch(`${API_URL}/maps`);
        return await res.json();
    } catch (error) {
        console.error("获取地图失败:", error);
        return [];
    }
}

export async function getPublishedMaps() {
    const maps = await getAllMaps();
    return maps.filter((map: any) => map.publish === true);
}

export async function getUserMaps() {
    const user = getCurrentUser();
    if (!user) return [];

    const maps = await getAllMaps();
    return maps.filter((map: any) => map.creatorId === user.userId);
}

export async function saveMap(mapData: any, updateId?: string) {
    const user = getCurrentUser();
    if (!user) return { success: false, msg: "请先登录" };

    if (!mapData.data || mapData.data.length === 0) {
        return { success: false, msg: "地图数据不能为空" };
    }

    try {
        const res = await fetch(`${API_URL}/maps`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mapData: {
                    name: mapData.name,
                    data: mapData.data,
                    publish: mapData.publish || false,
                    creator: user.nickname,
                    creatorId: user.userId,
                    downloads: 0,
                    rating: 0,
                    color: getRandomColor(),
                },
                updateId,
                userId: user.userId,
            }),
        });
        return await res.json();
    } catch (error) {
        console.error("保存地图失败:", error);
        return { success: false, msg: "网络错误" };
    }
}

export async function getMapById(mapId: string) {
    const maps = await getAllMaps();
    return maps.find((map: any) => map.id === mapId);
}

export async function deleteMap(mapId: string) {
    try {
        const res = await fetch(`${API_URL}/maps/${mapId}/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();

        // keep a local copy in sync for any client-side caches
        if (result.success) {
            let maps = JSON.parse(localStorage.getItem("maps") || "[]");
            maps = maps.filter((map: any) => map.id !== mapId);
            localStorage.setItem("maps", JSON.stringify(maps));

            let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
            favorites = favorites.filter((fav: any) => fav.mapId !== mapId);
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }

        return result;
    } catch (error) {
        console.error("删除地图失败:", error);
        return { success: false, msg: "网络错误，请确保后端已启动" };
    }
}

export async function updateMapDownloads(mapId: string) {
    try {
        const res = await fetch(`${API_URL}/maps/${mapId}/download`, {
            method: "POST",
        });
        return await res.json();
    } catch (error) {
        console.error("更新下载次数失败:", error);
        return { success: false };
    }
}

export function updateMapRating(mapId: string, rating: number) {
    return { success: true };
}

export function incrementMapPlayCount(mapId: string) {
    return { success: true };
}

export interface Comment {
    id: string;
    mapId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    rating: number;
    createdAt: number;
}

export function getCommentsByMapId(mapId: string): Comment[] {
    const comments = JSON.parse(localStorage.getItem("comments") || "[]");
    return comments.filter((comment: Comment) => comment.mapId === mapId).sort((a: Comment, b: Comment) => b.createdAt - a.createdAt);
}

export function addComment(mapId: string, content: string, rating: number) {
    const user = getCurrentUser();
    if (!user) return { success: false, msg: "请先登录" };
    if (!content.trim()) return { success: false, msg: "评论内容不能为空" };
    if (rating < 1 || rating > 5) return { success: false, msg: "评分必须在1-5之间" };

    const comments = JSON.parse(localStorage.getItem("comments") || "[]");
    const newComment: Comment = {
        id: Date.now().toString(),
        mapId,
        userId: user.userId,
        userName: user.nickname,
        userAvatar: user.avatar || "🎮",
        content: content.trim(),
        rating,
        createdAt: Date.now(),
    };

    comments.push(newComment);
    localStorage.setItem("comments", JSON.stringify(comments));
    updateMapRating(mapId, rating);
    return { success: true, comment: newComment };
}

export function deleteComment(commentId: string) {
    const user = getCurrentUser();
    if (!user) return { success: false, msg: "请先登录" };

    let comments = JSON.parse(localStorage.getItem("comments") || "[]");
    const comment = comments.find((item: Comment) => item.id === commentId);

    if (!comment) return { success: false, msg: "评论不存在" };
    if (comment.userId !== user.userId) return { success: false, msg: "只能删除自己的评论" };

    comments = comments.filter((item: Comment) => item.id !== commentId);
    localStorage.setItem("comments", JSON.stringify(comments));
    return { success: true };
}

export interface Favorite {
    userId: string;
    mapId: string;
    createdAt: number;
}

export async function addFavorite(mapId: string) {
    const user = getCurrentUser();
    if (!user) return { success: false, msg: "请先登录" };

    try {
        const res = await fetch(`${API_URL}/maps/${mapId}/favorite`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.userId }),
        });
        const result = await res.json();

        if (result.success) {
            const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
            favorites.push({ userId: user.userId, mapId, createdAt: Date.now() });
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }

        return result;
    } catch (error) {
        console.error("添加收藏失败:", error);
        return { success: false };
    }
}

export async function removeFavorite(mapId: string) {
    const user = getCurrentUser();
    if (!user) return { success: false, msg: "请先登录" };

    try {
        const res = await fetch(`${API_URL}/maps/${mapId}/unfavorite`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.userId }),
        });
        const result = await res.json();

        if (result.success) {
            let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
            favorites = favorites.filter((favorite: Favorite) => !(favorite.userId === user.userId && favorite.mapId === mapId));
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }

        return result;
    } catch (error) {
        console.error("取消收藏失败:", error);
        return { success: false };
    }
}

export function isFavorited(mapId: string): boolean {
    const user = getCurrentUser();
    if (!user) return false;

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.some((favorite: Favorite) => favorite.userId === user.userId && favorite.mapId === mapId);
}

export async function syncFavorites() {
    const user = getCurrentUser();
    if (!user) return;

    try {
        const res = await fetch(`${API_URL}/favorites/${user.userId}`);
        const favoriteIds = await res.json();

        const favorites = favoriteIds.map((mapId: string) => ({
            userId: user.userId,
            mapId,
            createdAt: Date.now(),
        }));
        localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
        console.error("同步收藏失败:", error);
    }
}

export interface SearchOptions {
    keyword?: string;
    sortBy?: "latest" | "popular" | "downloads" | "rating";
    difficulty?: string;
    limit?: number;
}

export async function searchMaps(options: SearchOptions) {
    let maps = await getPublishedMaps();

    if (options.keyword) {
        const keyword = options.keyword.toLowerCase();
        maps = maps.filter((map: any) => map.name.toLowerCase().includes(keyword) || map.creator.toLowerCase().includes(keyword));
    }

    switch (options.sortBy) {
        case "latest":
            maps.sort((a: any, b: any) => b.createdAt - a.createdAt);
            break;
        case "popular":
            maps.sort((a: any, b: any) => (b.playCount || 0) - (a.playCount || 0));
            break;
        case "downloads":
            maps.sort((a: any, b: any) => (b.downloads || 0) - (a.downloads || 0));
            break;
        case "rating":
            maps.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
            break;
        default:
            maps.sort((a: any, b: any) => b.createdAt - a.createdAt);
    }

    if (options.limit && options.limit > 0) {
        maps = maps.slice(0, options.limit);
    }

    return maps;
}
