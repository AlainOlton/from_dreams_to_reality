import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '@/config/cloudinary'

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb:   FileFilterCallback
): void => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only images (JPEG, PNG, WEBP) and PDFs are allowed'))
  }
}

// Profile photos — compressed images only
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'internship-system/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }],
  } as object,
})

// Documents — PDFs (CVs, cover letters, application letters)
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'internship-system/documents',
    allowed_formats: ['pdf'],
    resource_type:  'raw',
  } as object,
})

// Company logos
const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'internship-system/logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'pad', quality: 'auto' }],
  } as object,
})

// General attachments (logbook, messages)
const attachmentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'internship-system/attachments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  } as object,
})

export const uploadProfilePhoto = multer({
  storage:   profileStorage,
  fileFilter,
  limits:    { fileSize: 5 * 1024 * 1024 }, // 5 MB
})

export const uploadDocument = multer({
  storage:   documentStorage,
  fileFilter,
  limits:    { fileSize: 10 * 1024 * 1024 }, // 10 MB
})

export const uploadLogo = multer({
  storage:   logoStorage,
  fileFilter,
  limits:    { fileSize: 5 * 1024 * 1024 },
})

export const uploadAttachment = multer({
  storage:   attachmentStorage,
  fileFilter,
  limits:    { fileSize: 10 * 1024 * 1024 },
})
