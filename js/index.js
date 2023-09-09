(async () => {
    // 验证是否有登录,如果没有登录,跳转到登录页面,如果有登录,获取到登录的用户信息
    const user = await API.profile();
    const data = user.data;
    if (!data) {
        alert(user.msg);
        location.href = 'login.html';
        return;
    }
    // 下面的代码环境一定是登录的状态
    const doms = {
        aside: {
            nickName: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $('.close'),
        chatContainer: $('.chat-container'),
        msgContainer: $('.msg-container'),
        txtMsg: $('#txtMsg'),
    }
    // 设置用户信息
    setUserInfo = () => {
        doms.aside.nickName.innerText = data.nickname;
        doms.aside.loginId.innerText = data.loginId;
    }
    setUserInfo();

    // 注销事件
    doms.close.addEventListener('click', () => {
        API.loginOut();
        location.href = 'login.html';
    });

    // 转换时间
    function createDate(time) {
        const date = new Date(time);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    // 根据消息对象,将其添加到页面中
    /*
        content: "你是谁"
        createdAt: 1694167449592
        from: "xiaoChou"
        to: null
    */
    addChat = (chatContent) => {
        const text = `
        <div class="chat-item ${chatContent.from === null ? '' : 'me'}">
            <img class="chat-avatar" src=${chatContent.from === null ? './asset/robot-avatar.jpg' : './asset/avatar.png'} />
            <div class="chat-content">${chatContent.content}</div>
            <div class="chat-date">${createDate(chatContent.createdAt)}</div>
        </div>
        `;
        doms.chatContainer.innerHTML += text;
    }

    // 当获取聊天信息后,让滚动条滚动到最底部
    scrollBottom = () => {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    // 获取聊天记录
    getHistory = async () => {
        const history = await API.getHistory();
        for (const hist of history.data) {
            addChat(hist);
        }
        scrollBottom();
    }

    await getHistory();

    // 发送聊天信息
    sendChat = async () => {
        const content = doms.txtMsg.value.trim();
        if (!content) {
            return;
        }
        addChat({
            content,
            createdAt: Date.now(),  // 获取当前时间戳
            from: user.loginId,
            to: null
        })
        scrollBottom();
        const chat = await API.sendChat(content);
        addChat({
            content: chat.data.content,
            createdAt: chat.data.createdAt,
            from: null,
            to: user.loginId
        })
        scrollBottom();
    }

    // 监听提交事件
    doms.msgContainer.addEventListener('submit', e => {
        e.preventDefault();
        sendChat();
        doms.txtMsg.value = '';
    })
})()