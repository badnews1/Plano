/**
 * Public API для features/avatar-upload
 */

export { AvatarUploadButton } from './ui/AvatarUploadButton';
export { AvatarCropModal } from './ui/AvatarCropModal';
export { validateImageFile, convertFileToBase64, MAX_FILE_SIZE } from './lib/utils';
export { getCroppedImg } from './lib/cropImage';