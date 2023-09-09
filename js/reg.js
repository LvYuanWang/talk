const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号';
    }
    const exists = await API.exists(val);
    if (exists.data) {
        return '账号已存在,请重新填写';
    }
});
const nickNameValidator = new FieldValidator('txtNickname', function (val) {
    if (!val) {
        return '请填写昵称';
    }
});
const loginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码';
    }
});
const loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', function (val) {
    if (!val) {
        return '请填写密码';
    }
    if (val !== loginPwdValidator.input.value) {
        return '两次密码不一致';
    }
});

const form = $('.user-form');
form.addEventListener('submit', async function (e) {
    e.preventDefault(); // 阻止表单默认提交
    FieldValidator.validate(loginIdValidator, nickNameValidator, loginPwdValidator, loginPwdConfirmValidator).then(async result => {
        if (!result) {
            return;
        }
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries())
        const resp = await API.reg(data);
        if (resp.code === 0) {
            alert('注册成功,点击确定跳转到登录页面');
            location.href = 'login.html';
        }
    });
});