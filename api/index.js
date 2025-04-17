const express = require('express'); 
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const Post = require('./models/post.js');
const bcrypt = require('bcrypt');
const fs = require('fs');  
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

const salt = 10;
const secret = 'agsvcgdbc';
const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
console.log("Serving images from:", __dirname + '/uploads');

mongoose.connect('mongodb+srv://tanishjindal15:iF5g1FGnjyHsCC7n@cluster0.sepi7.mongodb.net/');

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({ 
            username, 
            password: bcrypt.hashSync(password, salt) 
        });
        res.json(userDoc);
    } catch (err) {
        res.status(500).json({ error: "User creation failed" });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res.status(400).json({ error: "Invalid username or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, userDoc.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid username or password" });
        }
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true }).json({ 
                username: userDoc.username,  
                id: userDoc._id,             
                token 
            });
        });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = `uploads/${path.split('\\').pop()}.${ext}`;
    const absolutePath = `${__dirname}/${newPath}`;

    fs.renameSync(req.file.path, absolutePath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(403).json({ error: "Unauthorized" });

        const { title, summary, content } = req.body;
        const fileUrl = `http://localhost:4000/uploads/${newPath.split('/').pop()}`;  // ✅ CORRECTED

        console.log("Final Image URL:", fileUrl);

        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: fileUrl,
            author: info.id,
        });

        res.json(postDoc);
    });
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(403).json({ error: "Unauthorized" });

        const { id, title, summary, content } = req.body;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        if (post.author.toString() !== info.id) {
            return res.status(403).json({ error: "You are not the author of this post" });
        }

        let cover = post.cover;

        if (req.file) {
            const { originalname, path } = req.file;
            const ext = originalname.split('.').pop();
            const newPath = `uploads/${path.split('\\').pop()}.${ext}`;
            const absolutePath = `${__dirname}/${newPath}`;
            fs.renameSync(req.file.path, absolutePath);
            cover = `http://localhost:4000/uploads/${newPath.split('/').pop()}`;
        }

        post.title = title;
        post.summary = summary;
        post.content = content;
        post.cover = cover;
        await post.save();

        res.json(post);
    });
});

app.get('/post',async (req,res)=>
{
    res.json(await Post.find().populate('author',['username']).sort({createdAt:-1}).limit(20));
})

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findById(id).populate('author', ['username']);
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Post not found or server error.' });
    }
  });
  
app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});