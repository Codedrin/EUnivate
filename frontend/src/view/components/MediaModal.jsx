import React from 'react';
import ReactModal from 'react-modal';
import '../../admin.css';

ReactModal.setAppElement('#root');

const MediaModal = ({ isOpen, onRequestClose, media }) => {
  if (!media) return null;

  const isImage = media.type.startsWith('image/');
  const isVideo = media.type.startsWith('video/');

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      closeTimeoutMS={200}
    >
      <button onClick={onRequestClose} className="modal-close">
        &times;
      </button>
      {isImage && <img src={media.url} alt="Preview" className="modal-media image-fullscreen" />}
      {isVideo && <video controls src={media.url} className="modal-media" />}
    </ReactModal>
  );
};

export default MediaModal;
