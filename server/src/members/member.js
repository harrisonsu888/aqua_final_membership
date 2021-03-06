const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
// const fs = require('fs')
const upload = multer({ dest: 'tmp_uploads/' })
const db = require(__dirname + '/../db_connect')
const moment = require('moment-timezone')
const memberRouter = express.Router()


// 會員註冊
memberRouter.post('/members/register', upload.none(), (req, res) => {

    // 自動產生MemberId
    let memberId = "";
    let idd = "";
    const sqlMAX = `SELECT MAX(\`idd\`) AS \`idd\`
                FROM \`my_member\` 
                WHERE DATE_FORMAT(\`created_at\`,'%Y-%m') = '${moment(new Date()).format('YYYY-MM')}'`;

    db.query(sqlMAX, (error, result) => {
        if (error) throw error
        if (!result[0].idd) {
            idd = '1';
            memberId = `M${moment(new Date()).format('YYMM')}${idd.padStart(4, '0')}`;
        } else {
            idd = `${result[0].idd + 1}`;
            memberId = `M${moment(new Date()).format('YYMM')}${idd.padStart(4, '0')}`;
        }

        // res.json(req.body)
        // 先檢查輸入
        console.log(req.body)
        const sql = `INSERT INTO \`my_member\`(
                    \`fullName\`, 
                    \`email\`, 
                    \`loginId\`, 
                    \`loginPwd\`,
                    \`avatar\`,
                    \`memberId\`,
                    \`idd\`
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)`

        db.queryAsync(sql, [
            req.body.fullName,
            req.body.email,
            req.body.loginId,
            req.body.loginPwd,
            'DefaultImage.jpg',
            memberId,
            idd
        ])
            .then(r => {
                console.log('註冊成功')
                return res.json(req.body)
            })
            .catch(err => {
                console.log('註冊失敗')
                return res.json(err)
            })
    });
})


//會員登入
memberRouter.post('/members/login', upload.none(), (req, res) => {
    console.log(req.body)
    //登入邏輯
    //1.撈出username和password
    const sql_login = "SELECT `memberId`, `loginId`,`loginPwd`, `avatar` FROM `my_member`";

    //2.資料綁定從前端傳過來的username和password
    let loginId = req.body.loginId;
    let loginPwd = req.body.loginPwd;

    //3.登入訊息已確認資料狀態
    let login_info = {
        success: false,//登入許可
        username: "",//儲存username
        password: "",//儲存password
        memberId: "",
        avatar: "",
    }
    //4.sql資料聯繫
    db.queryAsync(sql_login)
        .then(r => {
            // res.json(r);
            //使用者從前端傳過來的資料進行與資料庫比對
            r.forEach((value, index) => {
                if (loginId === value.loginId && loginPwd === value.loginPwd) {
                    login_info.success = true;
                    login_info.username = value.loginId;
                    login_info.password = value.loginPwd;
                    login_info.memberId = value.memberId;
                    login_info.avatar = value.avatar;
                    // login_info.idd = value.idd
                }
            })
            if (login_info.success) {
                req.session.password = login_info.loginPwd;
                req.session.username = login_info.loginId;
                req.session.memberId = login_info.memberId;
                res.json(login_info)//傳輸資料到前端
            } else {
                res.json(login_info)
            }
        })
});




//會員更改資料
memberRouter.get('/members/:memberId', (req, res) => {
    // console.log('會員修改')
    const memberId = req.params.memberId
    const sql = `SELECT 
                \`avatar\`,
                \`fullName\`, 
                \`mobileNumber\`, 
                \`email\`, 
                \`address\`
                FROM \`my_member\` WHERE \`memberId\`='${memberId}'`

    db.queryAsync(sql)
        .then(r => {
            return res.status(200).json(r)
            // res.render('edit', {row: r[0]})
        })
        .catch(err => {
            return res.status(500).json(err)
        })
})
memberRouter.post('/members/:memberId', upload.single(), (req, res) => {
    const sql = `UPDATE \`my_member\` SET 
                \`avatar\`=?,
                \`fullName\`=?,
                \`mobileNumber\`=?,
                \`email\`=?,
                \`address\`=?
                 WHERE \`memberId\`=?`

    db.queryAsync(sql, [
        avatar,
        req.body.fullName,
        req.body.mobileNumber,
        req.body.email,
        req.body.address,
        req.params.memberId
    ])
        .then(r => {
            console.log('修改資料成功')
            return res.json(req.body)
            // res.redirect(req.baseUrl + '/list')
        })
        .catch(err => {
            console.log('修改資料失敗')
            return res.json(err)
        })
})

module.exports = memberRouter;