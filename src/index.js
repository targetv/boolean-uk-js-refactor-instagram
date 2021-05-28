let state = {
  users: [],
  posts: [],
  currentUser: "Van Gogh",
};

/// Create createelm function
function createElm(tag, attobj) {
  const elm = document.createElement(tag);
  for (const key of Object.keys(attobj)) {
    elm[key] = attobj[key];
  }
  return elm;
}

const rootEl = document.querySelector("#root");

function headerSection() {
  const headerEl = createElm("header", { className: "main-header" });
  const wrapperEl = createElm("div", { className: "wrapper" });
  for (const userData of state.users) {
    const chipEl = userProfile(userData);
    wrapperEl.append(chipEl);
  }
  headerEl.append(wrapperEl);
  rootEl.append(headerEl);
}

function userProfile(user) {
  const chipEl = createElm("div", { className: "chip" });
  if (state.currentUser === user.username) {
    chipEl.classList.add("active");
  }
  const avatarEl = createElm("div", { className: "avatar-small" });
  const userAvatar = createElm("img", { src: user.avatar, alt: user.username });
  const spanEL = createElm("span", { innerText: user.username });
  avatarEl.append(userAvatar);
  chipEl.append(avatarEl, spanEL);
  return chipEl;
}

function mainSection() {
  const mainEl = createElm("main", { className: "wrapper" });
  const createPostEl = createPostForm();
  const feedSection = userPostsFeedSection();
  mainEl.append(createPostEl, feedSection);
  rootEl.append(mainEl);
}

function createPostForm() {
  const sectionEl = createElm("section", { className: "create-post-section" });
  const formEl = createElm("form", {
    id: "create-post-form",
    autocomplete: "off",
  });
  const h2El = createElm("h2", { innerText: "Create a post" });
  const imageLabel = createElm("label", { for: "image", innerText: "Image" });
  const imageInput = createElm("input", {
    id: "image",
    name: "image",
    type: "text",
  });
  const titleLabel = createElm("label", { for: "title", innerText: "Title" });
  const titleInput = createElm("input", {
    id: "title",
    name: "title",
    type: "text",
  });
  const contentLabel = createElm("label", {
    for: "content",
    innerText: "Content",
  });
  const contentTextArea = createElm("textarea", {
    id: "content",
    name: "content",
    row: "2",
    columns: "30",
  });
  const btnsContainer = createElm("div", { className: "action-btns" });
  const previewBtn = createElm("button", {
    id: "preview-btn",
    type: "button",
    innerText: "Preview ",
  });
  const postButton = createElm("button", { type: "submit", innerText: "Post" });
  const getUserId = state.users.find(function (user) {
    if (user.username === state.currentUser) {
      return user.id;
    }
  });
  btnsContainer.append(previewBtn, postButton);
  formEl.append(
    h2El,
    imageLabel,
    imageInput,
    titleLabel,
    titleInput,
    contentLabel,
    contentTextArea,
    btnsContainer
  );
  sectionEl.append(formEl);
  formEl.addEventListener("submit", function (event) {
    event.preventDefault();
    const newPost = {
      image: formEl.image.value,
      title: formEl.title.value,
      content: formEl.content.value,
      userId: getUserId.id,
      comments: [
        {
          id: 1,
          content: "What a great photo!!",
          userId: 3,
          postId: 1,
        },
      ],
    };
    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    }).then((response) => {
      if (response.ok) {
        state.posts.push(newPost);
        render();
        formEl.reset();
      }
    });
  });
  return sectionEl;
}

function userPostsFeedSection() {
  const feedSection = createElm("section", { className: "feed" });
  const postsList = createElm("ul", { className: "stack" });
  for (const post of state.posts) {
    const userPostEl = userPost(post);
    postsList.append(userPostEl);
  }
  feedSection.append(postsList);
  return feedSection;
}

function userPost(post) {
  const liEl = createElm("li", { className: "post" });
  const findUser = state.users.find(function (user) {
    return user.id === post.userId;
  });

  const chipEl = userProfile(findUser);

  const postImageEl = createElm("div", { className: "post--image" });
  const postImage = createElm("img", {
    src: post.image.src,
    alt: post.image.alt,
  });
  const postContentEl = createElm("div", { className: "post--content" });
  const postHeading = createElm("h2", { innerText: post.title });
  const postContentText = createElm("p", { innerText: post.content });
  const postCommentsEl = createElm("div", { className: "post--comments" });
  const postCommentsHeading = createElm("h3", { innerText: "Comments" });

  for (const comment of post.comments) {
    const findUserComment = state.users.find(function (user) {
      return user.id === comment.userId;
    });

    const postCommentEl = createElm("div", { className: "post--comment" });
    const avatarSmallEl = createElm("div", { className: "avatar-small" });
    const imgEL = createElm("img", {
      src: findUserComment.avatar,
      alt: findUserComment.username,
    });
    const commentPEl = createElm("p", { innerText: comment.content });
    avatarSmallEl.append(imgEL);
    postCommentEl.append(avatarSmallEl, commentPEl);
    postCommentsEl.append(postCommentEl);
  }

  const formELComment = createElm("form", {
    id: "create-comment-form",
    autocomplete: "off",
  });
  const commentLabel = createElm("label", {
    for: "comment",
    innerText: "Add Comment",
  });
  const commentInput = createElm("input", {
    id: "comment",
    name: "comment",
    type: "text",
  });
  const commentButton = createElm("button", {
    type: "submit",
    innerText: "Comment",
  });
  formELComment.append(commentLabel, commentInput, commentButton);
  postCommentsEl.prepend(postCommentsHeading);
  postCommentsEl.append(formELComment);
  postContentEl.append(postHeading, postContentText);
  postImageEl.append(postImage);
  liEl.append(chipEl, postImageEl, postContentEl, postCommentsEl);
  return liEl;
}

function getDataFromSever() {
  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((userdata) => {
      state.users = userdata;
      fetch("http://localhost:3000/posts")
        .then((response) => response.json())
        .then((postdata) => {
          state.posts = postdata;
          render();
        });
    });
}

function render() {
  rootEl.innerHTML = "";
  headerSection();
  mainSection();
}

function init() {
  getDataFromSever();
}
init();
