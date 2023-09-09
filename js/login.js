const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号';
    }
});
const loginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码';
    }
});
const form = $('.user-form');
form.addEventListener('submit', async function (e) {
    e.preventDefault(); // 阻止表单默认提交
    FieldValidator.validate(loginIdValidator, loginPwdValidator).then(async result => {
        if (!result) {
            return;
        }
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries())
        const resp = await API.login(data);
        if (resp.code === 0) {
            alert('登录成功,点击确定,跳转到首页');
            location.href = 'index.html';
        } else {
            loginIdValidator.p.innerText = '账号或密码错误';
            loginPwdValidator.input.value = '';
        }
    });
});