const API = (() => {
    const BASE_URL = 'https://study.duyiedu.com';
    const TOKEN_KEY = 'token';

    /**
     * POST请求
     * @param {URL} url 路径
     * @param {Object} body 请求内容
     * @returns fetch-POST
     */
    function post(url, body) {
        const headers = {
            "Content-Type": "application/json",
        };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        };
        return fetch(BASE_URL + url, { method: 'POST', headers, body: JSON.stringify(body) })
    }

    /**
     * GET请求
     * @param {URL} url 路径
     * @returns fetch-GET
     */
    function get(url) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        };
        return fetch(BASE_URL + url, { headers })
    }

    /**
     * 用户注册
     * @param {Object} userInfo 账号、昵称、密码
     */
    async function reg(userInfo) {
        const reg = await post('/api/user/reg', userInfo);
        return await reg.json();
    }

    /**
     * 用户登录
     * @param {Object} loginInfo 用户名、密码
     */
    async function login(loginInfo) {
        const res = await post('/api/user/login', loginInfo);
        const result = await res.json();
        if (result.code === 0) {
            const token = res.headers.get('authorization');
            localStorage.setItem(TOKEN_KEY, token);
        };
        return result;
    }

    /**
     * 验证账号
     * @param {Object} loginId 账号Id
     */
    async function exists(loginId) {
        const exi = await get('/api/user/exists?loginId=' + loginId);
        return await exi.json();
    }

    /**
     * 获取用户信息
     * @returns {Object} 用户信息
     */
    async function profile() {
        const pro = await get('/api/user/profile');
        return await pro.json();
    }

    /**
     * 发送聊天消息
     * @param {String} content 
     */
    async function sendChat(content) {
        const chat = await post('/api/chat', { content });
        return await chat.json();
    }

    /**
     * 获取聊天记录
     * @returns {Array} 聊天记录
     */
    async function getHistory() {
        const history = await get('/api/chat/history');
        return await history.json();
    }

    /**
     * 退出登录
     */
    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }

    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut
    }
})()