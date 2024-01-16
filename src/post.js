import React from 'react';
import "./post.css";
import { Avatar } from "@mui/material"

function Post({ username, caption, imageURL }) {
    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"

                />
                <h3>{username}</h3>
            </div>

            <img className='post__image' src={imageURL} />
            <div className='post__text'>
                <p><strong>{username}</strong> {caption}</p>
            </div>

        </div>
    )
}

export default Post;