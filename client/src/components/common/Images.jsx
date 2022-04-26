import React, { useState } from 'react';

const defaultPostSrc = '/assets/default-post-image.svg';
const defaultUserSrc = '/assets/default-user-image.svg';

const UserImage = (props) => {
    const [src, setSrc] = useState(() => { return (props.src) ? props.src : defaultUserSrc; });
    const setDefaultSrc = () => { setSrc(defaultUserSrc); }

    return <img
        width={props.width}
        height={props.height}
        onError={setDefaultSrc}
        src={src}
        loading={props.loading}
        alt="User Image" />
}

const UserImageThumbnail = (props) => {
    const maxWidth = 40;
    const maxHeight = 40;
    const width = useState(() => { return (Number(props.width) < maxWidth) ? props.width : maxWidth; });
    const height = useState(() => { return (Number(props.height) < maxHeight) ? props.height : maxHeight; });
    const [src, setSrc] = useState(() => { return (props.src) ? props.src : defaultUserSrc; });
    const setDefaultSrc = () => { setSrc(defaultUserSrc); }

    return <img
        width={width}
        height={height}
        onError={setDefaultSrc}
        src={src}
        loading={props.loading}
        alt="User Image" />
}

const PostImage = (props) => {
    const [src, setSrc] = useState(() => { return (props.src) ? (props.src) : defaultPostSrc; });
    const setDefaultSrc = () => { setSrc(defaultPostSrc); }

    return <img
        width={props.width}
        height={props.height}
        onError={setDefaultSrc}
        src={src}
        loading={props.loading}
        alt="Post Image" />
}

const PostImageThumbnail = (props) => {
    const maxWidth = 100;
    const maxHeight = 100;
    const width = useState(() => { return (Number(props.width) < maxWidth) ? props.width : maxWidth; });
    const height = useState(() => { return (Number(props.height) < maxHeight) ? props.height : maxHeight; });
    const [src, setSrc] = useState(() => { return (props.src) ? (props.src) : defaultPostSrc; });
    const setDefaultSrc = () => { setSrc(defaultPostSrc); }

    return <img
        width={width}
        height={height}
        onError={setDefaultSrc}
        src={src}
        loading={props.loading}
        alt="Post Image" />
}

export {
    UserImage,
    UserImageThumbnail,
    PostImage,
    PostImageThumbnail
}