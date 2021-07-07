import React from 'react';
import Alert from 'react-bootstrap/Alert';


const Error = ({ message }) => {
    if (message === null) {
        return null;
    }
    return (
        <Alert key={message} variant={"danger"}>
            Error: {message}
        </Alert>
    )
};

export default Error;