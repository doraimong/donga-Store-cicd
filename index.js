const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//application/x-www-form-urlencoded �����͸� �м��ؼ� �������� ��
app.use(bodyParser.urlencoded({ extended: true }));
//application/ json Ÿ������ �� ���� �м� ��������
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
const { request } = require("express");
mongoose
  .connect(config.mongoURI, { dbName: "Donga_project" }) //��ü : "mongodb://localhost:27017/"
  .then(() => console.log("MongoDB Connected.............")) //���� ��� ���������� cmd�� mongod�� ġ�� ���� ������.
  .catch((err) => console.log(err));

app.post("/api/users/register", (req, res) => {
  //ȸ�� ���� �Ҷ� �ʿ��� �������� Ŭ���̾�Ʈ���� �������� �װ͵��� ������ ���̽��� �־��ش�.
  //body-parser�� �̿��ؼ� ������ ������ �޴´�.
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      //status(200)�� ������ �ǹ�
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //��û�� �̸����� �����ͺ��̽����� �ִ��� �˻�.
  User.findOne({ email: req.body.email }, (err, user) => {
    //User ����(���� ��Ű�� ��������) �̿� -> �˻��ؼ� ���ٸ� user ���� ���̴�.
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "������ �̸��Ͽ� �ش��ϴ� ������ �����ϴ�.",
      });
    }

    //��û�� �̸����� �����ͺ��̽��� �ִٸ� ��й�ȣ�� �´��� Ȯ��
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "��й�ȣ�� Ʋ�Ƚ��ϴ�." });

      // ��й�ȣ�� �´ٸ� ��ū�� ����
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        //��ū�� ��Ű�� ����
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  //auth�� �̵����, �ݹ� �Լ��� ���ִ°�
  //������� �̵��� ����ߴٴ� �ǹ̴� Authentication�� True ��� ��
  //true��� ���� Ŭ���̾�Ʈ�� ����
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, //role:0 -> �Ϲ�����, role->0�� �ƴϸ� ������
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image, //������������� �������� ��밡��
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id }, //auth �̵����� ã�Ƽ� �����°� : _id: req.user._id
    { token: "" }, //��ū ����
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

app.get("/test", (req, res) => {
  console.log("test ok");
  res.send("test ok");
});

app.get("/", (req, res) => {
  console.log("base api test ok");
  res.send("base api test ok");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
