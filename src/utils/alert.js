import { message } from 'antd';

export const alertSuccess = (msg) => {
    let params = {
        content: msg,
        className: 'custom-class',
        style: {
            marginTop: '20px',
        },
    }
    message.success(params, 5);
};

export const alertError = (msg) => {
    let params = {
        content: msg,
        className: 'custom-class',
        style: {
            marginTop: '20px',
        },
    }
    message.error(params, 8);
};


