import Post from "../Post/Post";
import "./Posts.css";

const Posts = (props) => {
    const posts = props.posts.map(post => {
        return (
            <li>
                <Post />
                {/* <Post id={post.id} ... /> */}
            </li>
        );
    });

    return (
        <ul>{posts}</ul>
    );
  }
  
  export default Posts;