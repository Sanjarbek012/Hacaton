import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';
/** Login talab qilmaydigan yo'llar uchun */
export const Public = () => SetMetadata(IS_PUBLIC, true);
