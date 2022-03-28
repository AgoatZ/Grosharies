import Post from "../Post/Post";
import "./Posts.scss";

const Posts = (props) => {
    const posts = props.posts.map(post => {
        return (
            <li className="post">
                <Post />
                {/* <Post id={post.id} ... /> */}
            </li>
        );
    });

    return (
        <ul className="postsList">{posts}</ul>
    );
  }
  
  export default Posts;