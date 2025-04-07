import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('/api/posts?query=something')
            .then(response => {
                setPosts(response.data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.selftext}</p>
                        <p>Author: {post.authorFullname}</p>
                        <img src={post.thumbnail} alt={post.title} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
