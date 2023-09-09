// 用户登录和注册的表单项验证的通用代码
/**
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
    /**
     * 构造器
     * @param {*} txtId 文本框Id
     * @param {*} validatorFunc 验证规则函数
     */
    constructor(txtId, validatorFunc) {
        this.input = $('#' + txtId);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        this.input.onblur = () => {
            this.validate();
        }
    }

    /**
     * 验证,成功返回true,失败返回false
     */
    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = '';
            return true;
        }
    }

    /**
     * 静态方法
     * 对传入的所有验证器进行统一的验证,所有的返回均通过则返回true,否则返回false
     * @param {FieldValidator[]} validators 
     */
    static async validate(...validators) {
        const proms = validators.map(v => v.validate());
        const result = await Promise.all(proms);
        return result.every(v => v);
    }
}

// test = () => {
//     FieldValidator.validate(loginIdValidator, nickNameValidator).then(result => console.log(result))
// };