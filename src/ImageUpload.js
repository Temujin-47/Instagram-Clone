import { Button } from '@mui/material';
import React, { useState } from 'react'
import { db, storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import './ImageUpload.css';


function ImageUpload(props) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const metadata = { contentType: 'image/jpeg' };
        const imgref = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(imgref, image, metadata)
        console.log(typeof imgref);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress func
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                //Error function...
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(url => {
                        //post image inside db
                        addDoc(collection(db, "posts"), {
                            username: props.username,
                            timestamp: Timestamp.fromDate(new Date()),
                            caption: caption,
                            imageURL: url

                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        )
    }


    return (
        <div className='image__upload'>

            <progress className='image__progress' value={progress} max="100" />
            <input type="text" placeholder="Enter a caption.." onChange={event => setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>

        </div>
    )
}

export default ImageUpload