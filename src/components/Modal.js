/**
 * Modal
 */

import Modal from 'antd/lib/modal';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';

export const showConfirm = (options = {}) => {
  const {
    title = '',
    content = '',
    onOk = () => {}
  } = options;

  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    onOk,
    onCancel() {
      console.log('Cancel');
    },
    getContainer: document.getElementById('modal')
  });
}

export const showInfo = (options = {}) => {
  const {
    title = '',
    content = ''
  } = options;

  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    getContainer: document.getElementById('modal')
  });
}
