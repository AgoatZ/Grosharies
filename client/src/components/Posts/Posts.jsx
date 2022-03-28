import Post from "../Post/Post";
import "./Posts.scss";

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