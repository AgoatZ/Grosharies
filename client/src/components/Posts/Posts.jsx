import Post from "../post/Post";
import "./Posts.scss";

const Posts = (props) => {
    const posts = props.posts.map(post => {
        return (
            <li className="post">
                <Post title={post.headline} description={post.description} />
            </li>
        );
    });

    return (
        <ul className="postsList">{posts}</ul>
    );
  } 
  
  export default Posts;