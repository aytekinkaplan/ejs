<documents>
<document index="1">
<source>paste.txt</source>
<document_content>Understood. I'll provide the complete code for all relevant files to ensure your blog project is fully functional and professionally structured. This includes the `index.js`, routes, models, and views, along with CSS. Let's go through it step-by-step:

### 1. **Project Structure**

Ensure your project structure looks like this:

```
blog-site/
├── models/
│   └── blog.js
├── routes/
│   └── blogs.js
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── blogs/
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   ├── show.ejs
│   │   └── edit.ejs
│   └── error.ejs
├── public/
│   └── css/
│       └── style.css
├── index.js
├── .env
└── package.json
```

### 2. **Project Files**

#### **`index.js`**

The main entry point for your application.

```javascript
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const blogsRouter = require("./routes/blogs");
const methodOverride = require("method-override");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/blogs", blogsRouter);
app.use((req, res, next) => {
  res.status(404).render("error", { title: "404 Not Found" });
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
```

#### **`models/blog.js`**

Defines the schema and model for blog posts.

```javascript
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
});

module.exports = mongoose.model("Blog", blogSchema);
```

#### **`routes/blogs.js`**

Handles routing for blog-related actions.

```javascript
const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");

// Route for displaying all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render("blogs/index", { blogs, title: "All Blogs" });
  } catch (err) {
    res.status(500).send("Error retrieving blogs");
  }
});

// Route for creating a new blog (form)
router.get("/new", (req, res) => {
  res.render("blogs/new", { title: "Create New Blog" });
});

// Route for showing a single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render("blogs/show", { blog, title: blog.title });
  } catch (err) {
    res.status(404).send("Blog not found");
  }
});

// Route for editing a blog (form)
router.get("/:id/edit", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render("blogs/edit", { blog, title: "Edit Blog" });
  } catch (err) {
    res.status(404).send("Blog not found");
  }
});

// Route for updating a blog
router.put("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.redirect(`/blogs/${blog._id}`);
  } catch (err) {
    res.status(400).send("Error updating blog");
  }
});

// Route for creating a new blog
router.post("/", async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.redirect("/blogs");
  } catch (err) {
    res.status(400).send("Error creating blog");
  }
});

module.exports = router;
```

#### **`views/partials/header.ejs`**

Header partial with navigation links.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= title || 'My Blog' %></title>
    <link rel="stylesheet" href="/css/style.css" />
  </head>
  <body>
    <header>
      <div class="container">
        <h1><a href="/">My Blog</a></h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/blogs">All Blogs</a></li>
            <li><a href="/blogs/new">Create New Blog</a></li>
          </ul>
        </nav>
      </div>
    </header>
  </body>
</html>
```

#### **`views/partials/footer.ejs`**

Footer partial.

```html
    <footer>
        <div class="container">
            <p>&copy; 2024 My Blog</p>
        </div>
    </footer>
    <script src="/js/script.js"></script>
</body>
</html>
```

#### **`views/blogs/index.ejs`**

Displays the list of all blogs.

```html
<%- include('../partials/header', { title: 'All Blogs' }) %>

<div class="container">
  <h2>All Blogs</h2>
  <ul>
    <% blogs.forEach(blog => { %>
    <li><a href="/blogs/<%= blog._id %>"><%= blog.title %></a></li>
    <% }) %>
  </ul>
</div>

<%- include('../partials/footer') %>
```

#### **`views/blogs/new.ejs`**

Form for creating a new blog.

```html
<%- include('../partials/header', { title: 'Create New Blog' }) %>

<div class="container">
  <h2>Create New Blog</h2>
  <form action="/blogs" method="POST">
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" required />

    <label for="content">Content:</label>
    <textarea id="content" name="content" rows="4" required></textarea>

    <label for="author">Author:</label>
    <input type="text" id="author" name="author" required />

    <button type="submit">Create Blog</button>
  </form>
</div>

<%- include('../partials/footer') %>
```

#### **`views/blogs/show.ejs`**

Displays a single blog.

```html
<%- include('../partials/header', { title: blog.title }) %>

<div class="container">
  <h2><%= blog.title %></h2>
  <p><strong>Author:</strong> <%= blog.author %></p>
  <p><%= blog.content %></p>
  <a href="/blogs/<%= blog._id %>/edit">Edit Blog</a>
  <a href="/blogs">Back to All Blogs</a>
</div>

<%- include('../partials/footer') %>
```

#### **`views/blogs/edit.ejs`**

Form for editing a blog.

```html
<%- include('../partials/header', { title: 'Edit Blog' }) %>

<div class="container">
  <h2>Edit Blog</h2>
  <form action="/blogs/<%= blog._id %>?_method=PUT" method="POST">
    <label for="title">Title:</label>
    <input
      type="text"
      id="title"
      name="title"
      value="<%= blog.title %>"
      required
    />

    <label for="content">Content:</label>
    <textarea id="content" name="content" rows="4" required>
<%= blog.content %></textarea
    >

    <label for="author">Author:</label>
    <input
      type="text"
      id="author"
      name="author"
      value="<%= blog.author %>"
      required
    />

    <button type="submit">Update Blog</button>
  </form>
</div>

<%- include('../partials/footer') %>
```

#### **`views/error.ejs`**

Generic error page.

```html
<%- include('./partials/header', { title: 'Error' }) %>

<div class="container">
  <h2>Error</h2>
  <p>Something went wrong. Please try again later.</p>
</div>

<%- include('./partials/footer') %>
```

#### **`public/css/style.css`**

Styles for the blog site.

```css
/* Basic reset and styles */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
}

header {
  background: #333;
  color: #fff;
  padding: 10px 0;
}

header h1 a {
  color: #fff;
  text-decoration: none;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 10px;
}

nav ul li a {
  color: #fff;
  text-decoration: none;
}

footer {
  background: #333;
  color: #fff;
  text-align: center;
  padding: 10px 0;
}

form {
  display: flex;
  flex-direction: column;
}

form label {
  margin-top: 10px;
}

form input,
form textarea {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

form button {
  margin-top: 10px;
  padding: 10px;
  border: none;
  background: #333;
  color: #fff;
  cursor: pointer;
}

form button:hover {
  background: #555;
}
```

### 3. **Ensure Dependencies**

Make sure you have all necessary dependencies in your `package.json`:

```json
{
  "name": "blog-site",
  "version": "1.0.0",
  "description": "A simple blog site",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "ejs": "^3.1.9",
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.0",
    "method-override": "^3.0.0"
  }
}
```

### 4. **Install Dependencies**

Run the following command to install dependencies:

```bash
npm install
```

### 5. **Start the Server**

Use the following command to start the server:

```bash
npm start
```
